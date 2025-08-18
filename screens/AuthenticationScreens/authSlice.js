import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  registerUser,
  loginUser,
  logoutUser,
  sendPasswordReset,
  setupAuthStateListener,
} from '../../network/authNetwork';
import {
  serializeUser,
  serializeSignUpPayload,
  serializeSignInPayload,
  createInitialAuthState,
  validateFormData,
  getAllowedFields,
  conformsToSchema,
} from '../../serilizers/authSerilizer';

const initialState = createInitialAuthState();

export const signUpWithEmail = createAsyncThunk(
  'auth/signUpWithEmail',
  async (payload, { getState, rejectWithValue }) => {
    try {
      console.log('Starting signUpWithEmail thunk');
      
      const { selectedUserType } = getState().auth;
      
      const validation = validateFormData(payload, 'signup');
      if (!validation.isValid) {
        console.error('Form validation failed:', validation.errors);
        return rejectWithValue(validation.errors.join(', '));
      }
      
      const cleanPayload = serializeSignUpPayload({
        ...payload,
        userType: selectedUserType,
      });
      console.log('Sending clean payload to API:', Object.keys(cleanPayload));

      const { user: apiUser, profile } = await registerUser(cleanPayload);

      const serializedUser = serializeUser(apiUser, profile);
      if (!serializedUser) {
        throw new Error('Invalid user data received from API');
      }
      
      console.log('signUpWithEmail completed successfully');
      return serializedUser;
    } catch (error) {
      console.error('signUpWithEmail error:', error);
      return rejectWithValue(error.message || 'Registration failed');
    }
  }
);

export const signInWithEmail = createAsyncThunk(
  'auth/signInWithEmail',
  async (payload, { getState, rejectWithValue }) => {
    try {
      console.log('Starting signInWithEmail thunk');
      
      const { selectedUserType } = getState().auth;
      
      const validation = validateFormData(payload, 'login');
      if (!validation.isValid) {
        console.error('Form validation failed:', validation.errors);
        return rejectWithValue(validation.errors.join(', '));
      }
      
      const cleanPayload = serializeSignInPayload({
        ...payload,
        userType: selectedUserType, 
      });
      console.log('Sending clean payload to API:', Object.keys(cleanPayload));

      const { user: apiUser, profile } = await loginUser(cleanPayload);

      const serializedUser = serializeUser(apiUser, profile);
      if (!serializedUser) {
        throw new Error('Invalid user data received from API');
      }

      if (serializedUser.userType !== selectedUserType) {
        console.error(`User type mismatch: stored=${serializedUser.userType}, selected=${selectedUserType}`);
        
        try {
          await logoutUser();
        } catch (logoutError) {
          console.error('Error signing out after user type mismatch:', logoutError);
        }
        
        const storedTypeLabel = serializedUser.userType === 'therapist' ? 'Therapist' : 'Visitor';
        const selectedTypeLabel = selectedUserType === 'therapist' ? 'Therapist' : 'Visitor';
        
        return rejectWithValue(
          `This account is registered as a ${storedTypeLabel}. Please select "${storedTypeLabel}" to login, or use a different ${selectedTypeLabel} account.`
        );
      }
      
      console.log('signInWithEmail completed successfully with matching user type');
      return serializedUser;
    } catch (error) {
      console.error('signInWithEmail error:', error);
      return rejectWithValue(error.message || 'Login failed');
    }
  });

export const signOutUser = createAsyncThunk(
  'auth/signOutUser',
  async (_, { rejectWithValue }) => {
    try {
      console.log('Starting signOutUser thunk');
      await logoutUser();
      console.log('signOutUser completed successfully');
      return true;
    } catch (error) {
      console.error('signOutUser error:', error);
      return rejectWithValue(error.message || 'Logout failed');
    }
  }
);

export const sendResetEmail = createAsyncThunk(
  'auth/sendResetEmail',
  async (email, { rejectWithValue }) => {
    try {
      console.log('Starting sendResetEmail thunk');
      
      if (!email || !email.includes('@')) {
        return rejectWithValue('Please enter a valid email address');
      }
      
      await sendPasswordReset(email);
      console.log('sendResetEmail completed successfully');
      return true;
    } catch (error) {
      console.error('sendResetEmail error:', error);
      return rejectWithValue(error.message || 'Could not send reset email');
    }
  }
);

export const startAuthListener = createAsyncThunk(
  'auth/startAuthListener',
  async (_, { dispatch }) => {
    try {
      console.log('Starting auth listener');
      
      const unsubscribe = setupAuthStateListener((apiUser, profile) => {
        if (!apiUser) {
          console.log('No user from auth state listener');
          dispatch(authSlice.actions.logout());
          return;
        }

        console.log('User detected from auth state listener:', apiUser.uid);
       
        const serializedUser = serializeUser(apiUser, profile);
        if (serializedUser) {
          console.log('User data serialized from listener:', Object.keys(serializedUser));
          dispatch(authSlice.actions.loginSuccess(serializedUser));
        } else {
          console.error('Failed to serialize user from auth listener');
        }
      });

      return unsubscribe;
    } catch (error) {
      console.error('Error starting auth listener:', error);
      throw error;
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setSelectedUserType: (state, action) => {
      const { VALID_USER_TYPES } = require('../../serilizers/authSerilizer');
      
      if (VALID_USER_TYPES.includes(action.payload)) {
        console.log('Setting selected user type:', action.payload);
        state.selectedUserType = action.payload;
      } else {
        console.warn(`Invalid user type: ${action.payload}, ignoring`);
      }
    },

    setLoginEmail: (state, action) => {
      const allowedFields = getAllowedFields('LOGIN_FORM');
      if (allowedFields.includes('email')) {
        state.loginForm.email = action.payload;
      }
    },
    setLoginPassword: (state, action) => {
      const allowedFields = getAllowedFields('LOGIN_FORM');
      if (allowedFields.includes('password')) {
        state.loginForm.password = action.payload;
      }
    },
    toggleLoginPasswordVisibility: (state) => {
      const allowedFields = getAllowedFields('LOGIN_FORM');
      if (allowedFields.includes('showPassword')) {
        state.loginForm.showPassword = !state.loginForm.showPassword;
      }
    },

    setSignUpField: (state, action) => {
      const { field, value } = action.payload;
      const allowedFields = getAllowedFields('SIGNUP_FORM');
      
      if (allowedFields.includes(field) && state.signUpForm.hasOwnProperty(field)) {
        state.signUpForm[field] = value;
      } else {
        console.warn(`Field '${field}' not allowed in SIGNUP_FORM_SCHEMA, ignoring`);
      }
    },
    toggleSignUpPasswordVisibility: (state) => {
      const allowedFields = getAllowedFields('SIGNUP_FORM');
      if (allowedFields.includes('showPassword')) {
        state.signUpForm.showPassword = !state.signUpForm.showPassword;
      }
    },
    toggleSignUpConfirmPasswordVisibility: (state) => {
      const allowedFields = getAllowedFields('SIGNUP_FORM');
      if (allowedFields.includes('showConfirmPassword')) {
        state.signUpForm.showConfirmPassword = !state.signUpForm.showConfirmPassword;
      }
    },
    togglePrivacyAgreement: (state) => {
      const allowedFields = getAllowedFields('SIGNUP_FORM');
      if (allowedFields.includes('agreeToPrivacy')) {
        state.signUpForm.agreeToPrivacy = !state.signUpForm.agreeToPrivacy;
      }
    },

    updateLoginForm: (state, action) => {
      const allowedFields = getAllowedFields('LOGIN_FORM');
      const updates = {};
      
      Object.entries(action.payload).forEach(([key, value]) => {
        if (allowedFields.includes(key)) {
          updates[key] = value;
        } else {
          console.warn(`Field '${key}' not allowed in LOGIN_FORM_SCHEMA, ignoring`);
        }
      });
      
      state.loginForm = { ...state.loginForm, ...updates };
    },

    updateSignUpForm: (state, action) => {
      const allowedFields = getAllowedFields('SIGNUP_FORM');
      const updates = {};
      
      Object.entries(action.payload).forEach(([key, value]) => {
        if (allowedFields.includes(key)) {
          updates[key] = value;
        } else {
          console.warn(`Field '${key}' not allowed in SIGNUP_FORM_SCHEMA, ignoring`);
        }
      });
      
      state.signUpForm = { ...state.signUpForm, ...updates };
    },

    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },

    loginSuccess: (state, action) => {
      console.log('Login success reducer called');
      
      if (conformsToSchema(action.payload, 'USER')) {
        state.user = action.payload;
        state.isAuthenticated = true;
        state.loading = false;
        state.error = null;
        console.log('User data conforms to USER_SCHEMA');
      } else {
        console.error('User data does not conform to USER_SCHEMA, re-serializing...');
        const cleanUser = serializeUser(action.payload, {});
        if (cleanUser) {
          state.user = cleanUser;
          state.isAuthenticated = true;
          state.loading = false;
          state.error = null;
          console.log('User data re-serialized to match schema');
        } else {
          console.error('Failed to serialize user data');
          state.error = 'Invalid user data format';
        }
      }
    },
    
    logout: (state) => {
      console.log('Logout reducer called');
      const initialAuthState = createInitialAuthState();
      state.user = null;
      state.isAuthenticated = false;
      state.loginForm = initialAuthState.loginForm;
      state.signUpForm = initialAuthState.signUpForm;
      state.selectedUserType = initialAuthState.selectedUserType;
      state.error = null;
      state.loading = false;
    },
    
    resetForms: (state) => {
      const initialAuthState = createInitialAuthState();
      state.loginForm = initialAuthState.loginForm;
      state.signUpForm = initialAuthState.signUpForm;
      state.error = null;
    },
    
    updateUserProfile: (state, action) => {
      if (state.user) {
        console.log('Updating user profile:', action.payload);
        
        const allowedFields = getAllowedFields('USER');
        const filteredUpdate = {};
        
        Object.entries(action.payload).forEach(([key, value]) => {
          if (allowedFields.includes(key)) {
            filteredUpdate[key] = value;
          } else {
            console.warn(`Field '${key}' not allowed in USER_SCHEMA for profile update, ignoring`);
          }
        });
        
        state.user = { ...state.user, ...filteredUpdate };
        console.log('Profile updated with filtered data:', Object.keys(filteredUpdate));
      }
    },

    validateCurrentState: (state) => {
      const isValid = conformsToSchema(state, 'AUTH_STATE');
      if (!isValid) {
        console.warn('Current auth state does not conform to AUTH_STATE_SCHEMA');
      }
      return isValid;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(signUpWithEmail.pending, (state) => {
        console.log('signUpWithEmail.pending');
        state.loading = true;
        state.error = null;
      })
      .addCase(signUpWithEmail.fulfilled, (state, action) => {
        console.log('signUpWithEmail.fulfilled');
        state.user = action.payload; 
        state.isAuthenticated = true;
        state.loading = false;
        state.error = null;
        state.signUpForm = createInitialAuthState().signUpForm;
      })
      .addCase(signUpWithEmail.rejected, (state, action) => {
        console.log('signUpWithEmail.rejected:', action.payload);
        state.loading = false;
        state.error = action.payload || 'Registration failed.';
      })

      .addCase(signInWithEmail.pending, (state) => {
        console.log('signInWithEmail.pending');
        state.loading = true;
        state.error = null;
      })
      .addCase(signInWithEmail.fulfilled, (state, action) => {
        console.log('signInWithEmail.fulfilled');
        state.user = action.payload; 
        state.isAuthenticated = true;
        state.loading = false;
        state.error = null;
        state.loginForm = createInitialAuthState().loginForm;
      })
      .addCase(signInWithEmail.rejected, (state, action) => {
        console.log('signInWithEmail.rejected:', action.payload);
        state.loading = false;
        state.error = action.payload || 'Login failed.';
      })

      .addCase(signOutUser.pending, (state) => {
        console.log('signOutUser.pending');
        state.loading = true;
        state.error = null;
      })
      .addCase(signOutUser.fulfilled, (state) => {
        console.log('signOutUser.fulfilled');
        const initialAuthState = createInitialAuthState();
        state.user = null;
        state.isAuthenticated = false;
        state.loading = false;
        state.error = null;
        state.loginForm = initialAuthState.loginForm;
        state.signUpForm = initialAuthState.signUpForm;
        state.selectedUserType = initialAuthState.selectedUserType;
      })
      .addCase(signOutUser.rejected, (state, action) => {
        console.log('signOutUser.rejected:', action.payload);
        state.loading = false;
        state.error = action.payload || 'Logout failed.';
      })

      // Password reset cases
      .addCase(sendResetEmail.pending, (state) => {
        console.log('sendResetEmail.pending');
        state.loading = true;
        state.error = null;
      })
      .addCase(sendResetEmail.fulfilled, (state) => {
        console.log('sendResetEmail.fulfilled');
        state.loading = false;
        state.error = null;
      })
      .addCase(sendResetEmail.rejected, (state, action) => {
        console.log('sendResetEmail.rejected:', action.payload);
        state.loading = false;
        state.error = action.payload || 'Could not send reset email.';
      })

      .addCase(startAuthListener.pending, (state) => {
        console.log('startAuthListener.pending');
        state.loading = true;
      })
      .addCase(startAuthListener.fulfilled, (state) => {
        console.log('startAuthListener.fulfilled - listener started');
        state.loading = false;
      })
      .addCase(startAuthListener.rejected, (state, action) => {
        console.log('startAuthListener.rejected:', action.payload);
        state.loading = false;
        state.error = 'Failed to initialize authentication';
      });
  },
});

// Selectors
export const selectUser = (state) => state.auth.user;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectSelectedUserType = (state) => state.auth.selectedUserType;
export const selectLoginForm = (state) => state.auth.loginForm;
export const selectSignUpForm = (state) => state.auth.signUpForm;
export const selectAuthLoading = (state) => state.auth.loading;
export const selectAuthError = (state) => state.auth.error;

export const selectUserType = (state) => state.auth.user?.userType;
export const selectUserNickname = (state) => state.auth.user?.nickname;
export const selectUserEmail = (state) => state.auth.user?.email;

export const selectIsFormValid = (formType) => (state) => {
  const form = formType === 'login' ? state.auth.loginForm : state.auth.signUpForm;
  const validation = validateFormData(form, formType);
  return validation.isValid;
};

export const selectUserProfile = (state) => {
  const user = state.auth.user;
  if (!user) return null;
  
  const allowedProfileFields = getAllowedFields('FIRESTORE_PROFILE');
  const profile = {};
  
  allowedProfileFields.forEach(field => {
    if (user.hasOwnProperty(field)) {
      profile[field] = user[field];
    }
  });
  
  return profile;
};

export const selectFormValidationErrors = (formType) => (state) => {
  const form = formType === 'login' ? state.auth.loginForm : state.auth.signUpForm;
  const validation = validateFormData(form, formType);
  return validation.errors;
};

export const {
  setSelectedUserType,
  setLoginEmail,
  setLoginPassword,
  toggleLoginPasswordVisibility,
  setSignUpField,
  toggleSignUpPasswordVisibility,
  toggleSignUpConfirmPasswordVisibility,
  togglePrivacyAgreement,
  updateLoginForm,
  updateSignUpForm,
  setLoading,
  setError,
  clearError,
  loginSuccess,
  logout,
  resetForms,
  updateUserProfile,
  validateCurrentState,
} = authSlice.actions;

export default authSlice.reducer;