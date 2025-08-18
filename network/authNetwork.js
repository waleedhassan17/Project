// API-based authentication network layer
// Simulates Firebase functionality with REST API calls

const API_BASE_URL = 'https://api.shezlong.com'; // Replace with your actual API endpoint

// Simulated error mapping - similar to Firebase auth errors
const AUTH_ERROR_MESSAGES = {
  'auth/invalid-email': 'Invalid email address.',
  'auth/missing-password': 'Please enter a password.',
  'auth/wrong-password': 'Incorrect password.',
  'auth/user-not-found': 'No account found with this email.',
  'auth/email-already-in-use': 'Email is already registered.',
  'auth/weak-password': 'Password must be at least 6 characters.',
  'auth/too-many-requests': 'Too many attempts. Try again later.',
  'auth/network-request-failed': 'Network error. Please check your connection.',
  'auth/invalid-credential': 'Invalid login credentials.',
  'auth/user-disabled': 'This account has been disabled.',
  'permission-denied': 'Permission denied. Check API access.',
  'unavailable': 'Service is currently unavailable.',
  'invalid-argument': 'Invalid data provided.',
};

export const mapAuthError = (code, fallback = 'Something went wrong') => {
  return AUTH_ERROR_MESSAGES[code] || fallback;
};

// Simulated API client
class APIClient {
  constructor(baseURL) {
    this.baseURL = baseURL;
    this.token = null;
  }

  setAuthToken(token) {
    this.token = token;
  }

  async makeRequest(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`;
    }

    const config = {
      ...options,
      headers,
    };

    console.log(`API Request: ${options.method || 'GET'} ${url}`);

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `HTTP ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error('API Request failed:', error);
      throw error;
    }
  }
}

const apiClient = new APIClient(API_BASE_URL);

// Simulate user storage (in real implementation, this would be handled by your backend)
let currentUser = null;
let authStateListeners = [];

// Helper function to generate mock user data
const generateMockUser = (email, profile) => {
  const uid = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  return {
    uid,
    email,
    displayName: profile.nickname || email.split('@')[0],
    photoURL: null,
    phoneNumber: profile.phone || null,
    emailVerified: true,
    ...profile,
  };
};

// Helper function to simulate API delay
const simulateDelay = (ms = 1000) => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

export const registerUser = async ({
  email,
  password,
  nickname,
  phone,
  birthYear,
  gender,
  userType = 'visitor',
}) => {
  try {
    console.log('=== Starting user registration via API ===');
    console.log('Email:', email);
    console.log('User type:', userType);
    
    // Simulate API delay
    await simulateDelay(1500);

    // Simulate API call to register user
    /*
    const response = await apiClient.makeRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify({
        email,
        password,
        nickname,
        phone,
        birthYear,
        gender,
        userType,
      }),
    });
    */

    // For demo purposes, create mock data
    const profileData = {
      nickname: nickname || '',
      phone: phone || '',
      birthYear: birthYear || '',
      gender: gender || '',
      userType: userType || 'visitor',
      email: email,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    if (userType === 'therapist') {
      profileData.isVerified = false;
      profileData.specializations = [];
      profileData.experience = '';
      profileData.qualifications = [];
    }

    // Simulate checking for existing user
    if (email === 'existing@example.com') {
      throw new Error(mapAuthError('auth/email-already-in-use'));
    }

    const mockUser = generateMockUser(email, profileData);
    
    // Set current user for auth state
    currentUser = mockUser;
    
    // Generate mock auth token
    const authToken = `mock_token_${mockUser.uid}`;
    apiClient.setAuthToken(authToken);

    console.log('✅ User registered successfully via API');
    
    // Notify auth state listeners
    authStateListeners.forEach(listener => {
      listener(mockUser, profileData);
    });

    return {
      user: mockUser,
      profile: profileData,
      collection: userType === 'therapist' ? 'therapists' : 'users',
    };

  } catch (error) {
    console.error('❌ Registration error:', error);
    throw new Error(mapAuthError(error.code, error.message));
  }
};

export const loginUser = async ({ email, password }) => {
  try {
    console.log('=== Starting user login via API ===');
    console.log('Email:', email);
    
    // Simulate API delay
    await simulateDelay(1200);

    // Simulate API call to login
    /*
    const response = await apiClient.makeRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    */

    // For demo purposes, simulate login validation
    if (password.length < 6) {
      throw new Error(mapAuthError('auth/weak-password'));
    }

    if (email === 'notfound@example.com') {
      throw new Error(mapAuthError('auth/user-not-found'));
    }

    if (password === 'wrongpassword') {
      throw new Error(mapAuthError('auth/wrong-password'));
    }

    // Create mock user data
    const profileData = {
      nickname: email.split('@')[0],
      phone: '+1234567890',
      birthYear: '1990',
      gender: 'prefer-not-to-say',
      userType: 'visitor',
      email: email,
      createdAt: Date.now() - 86400000, // 1 day ago
      updatedAt: Date.now(),
    };

    const mockUser = generateMockUser(email, profileData);
    
    // Set current user for auth state
    currentUser = mockUser;
    
    // Generate mock auth token
    const authToken = `mock_token_${mockUser.uid}`;
    apiClient.setAuthToken(authToken);

    console.log('✅ User logged in successfully via API');
    
    // Notify auth state listeners
    authStateListeners.forEach(listener => {
      listener(mockUser, profileData);
    });

    const profile = await getUserProfileFromAPI(mockUser.uid);

    return {
      user: mockUser,
      profile: profile,
    };
  } catch (error) {
    console.error('❌ Login error:', error);
    throw new Error(mapAuthError(error.code, error.message));
  }
};

export const logoutUser = async () => {
  try {
    console.log('Attempting to logout user via API');
    
    // Simulate API delay
    await simulateDelay(500);

    // Simulate API call to logout
    /*
    await apiClient.makeRequest('/auth/logout', {
      method: 'POST',
    });
    */

    // Clear auth token
    apiClient.setAuthToken(null);
    
    // Clear current user
    currentUser = null;
    
    console.log('✅ User logged out successfully');
    
    // Notify auth state listeners
    authStateListeners.forEach(listener => {
      listener(null, null);
    });

    return true;
  } catch (error) {
    console.error('❌ Logout error:', error);
    throw new Error(mapAuthError(error.code, error.message));
  }
};

export const sendPasswordReset = async (email) => {
  try {
    console.log('Sending password reset email via API to:', email);
    
    // Simulate API delay
    await simulateDelay(800);

    // Simulate API call to send reset email
    /*
    await apiClient.makeRequest('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
    */

    console.log('✅ Password reset email sent successfully');
    return true;
  } catch (error) {
    console.error('❌ Password reset error:', error);
    throw new Error(mapAuthError(error.code, error.message));
  }
};

export const getUserProfileFromAPI = async (uid) => {
  try {
    console.log('=== Fetching user profile from API ===');
    console.log('UID:', uid);
    
    // Simulate API delay
    await simulateDelay(600);

    // Simulate API call to get user profile
    /*
    const response = await apiClient.makeRequest(`/users/${uid}`);
    return response.profile;
    */

    // For demo purposes, return mock profile data
    const mockProfiles = {
      visitor: {
        nickname: 'John Doe',
        phone: '+1234567890',
        birthYear: '1990',
        gender: 'male',
        userType: 'visitor',
        createdAt: Date.now() - 86400000,
        updatedAt: Date.now(),
        collection: 'users'
      },
      therapist: {
        nickname: 'Dr. Sarah Smith',
        phone: '+1987654321',
        birthYear: '1985',
        gender: 'female',
        userType: 'therapist',
        isVerified: true,
        specializations: ['Anxiety', 'Depression'],
        experience: '5 years',
        qualifications: ['PhD Psychology', 'Licensed Therapist'],
        createdAt: Date.now() - 2592000000, // 30 days ago
        updatedAt: Date.now(),
        collection: 'therapists'
      }
    };

    // Return profile based on current user or default to visitor
    const userType = currentUser?.userType || 'visitor';
    const profile = mockProfiles[userType];
    
    console.log('✅ Profile fetched from API:', profile);
    return profile;
    
  } catch (error) {
    console.error('❌ Failed to get user profile from API:', error);
    return {};
  }
};

export const updateUserDisplayName = async (user, displayName) => {
  try {
    console.log('Updating display name via API:', displayName);
    
    // Simulate API delay
    await simulateDelay(500);

    // Simulate API call to update display name
    /*
    await apiClient.makeRequest(`/users/${user.uid}/display-name`, {
      method: 'PATCH',
      body: JSON.stringify({ displayName }),
    });
    */

    // Update current user
    if (currentUser && currentUser.uid === user.uid) {
      currentUser.displayName = displayName;
    }

    console.log('✅ Display name updated successfully');
    return { ...user, displayName };
  } catch (error) {
    console.error('❌ Update display name error:', error);
    throw new Error(mapAuthError(error.code, error.message));
  }
};

export const updateUserProfileInAPI = async (uid, profileData, userType = null) => {
  try {
    console.log('=== Updating user profile via API ===');
    console.log('UID:', uid);
    console.log('Profile data:', profileData);
    
    // Simulate API delay
    await simulateDelay(800);

    const updateData = {
      ...profileData,
      updatedAt: Date.now(),
    };

    // Simulate API call to update profile
    /*
    const response = await apiClient.makeRequest(`/users/${uid}`, {
      method: 'PATCH',
      body: JSON.stringify(updateData),
    });
    */

    const collectionName = userType === 'therapist' ? 'therapists' : 'users';
    
    console.log(`✅ Profile updated via API successfully`);
    return { ...updateData, collection: collectionName };
  } catch (error) {
    console.error('❌ Update profile error:', error);
    throw new Error(mapAuthError(error.code, 'Failed to update user profile'));
  }
};

export const setupAuthStateListener = (callback) => {
  console.log('Setting up auth state listener for API');
  
  // Add callback to listeners array
  authStateListeners.push(callback);
  
  // Immediately call with current user state
  if (currentUser) {
    getUserProfileFromAPI(currentUser.uid).then(profile => {
      callback(currentUser, profile);
    });
  } else {
    callback(null, null);
  }

  // Return unsubscribe function
  return () => {
    const index = authStateListeners.indexOf(callback);
    if (index > -1) {
      authStateListeners.splice(index, 1);
    }
  };
};

export const getTherapists = async (limit = 10) => {
  try {
    console.log('=== Fetching therapists via API ===');
    
    // Simulate API delay
    await simulateDelay(700);

    // Simulate API call to get therapists
    /*
    const response = await apiClient.makeRequest(`/therapists?limit=${limit}`);
    return response.therapists;
    */

    // Mock therapists data
    const mockTherapists = [
      {
        id: 'therapist_1',
        nickname: 'Dr. Sarah Johnson',
        email: 'sarah.johnson@shezlong.com',
        phone: '+1234567890',
        gender: 'female',
        userType: 'therapist',
        isVerified: true,
        specializations: ['Anxiety', 'Depression', 'PTSD'],
        experience: '8 years',
        qualifications: ['PhD Clinical Psychology', 'Licensed Clinical Psychologist'],
        rating: 4.8,
        sessionsCompleted: 245,
      },
      {
        id: 'therapist_2',
        nickname: 'Dr. Michael Chen',
        email: 'michael.chen@shezlong.com',
        phone: '+1987654321',
        gender: 'male',
        userType: 'therapist',
        isVerified: true,
        specializations: ['Cognitive Behavioral Therapy', 'Family Therapy'],
        experience: '12 years',
        qualifications: ['MD Psychiatry', 'Board Certified Psychiatrist'],
        rating: 4.9,
        sessionsCompleted: 367,
      },
      {
        id: 'therapist_3',
        nickname: 'Dr. Emma Rodriguez',
        email: 'emma.rodriguez@shezlong.com',
        phone: '+1555123456',
        gender: 'female',
        userType: 'therapist',
        isVerified: true,
        specializations: ['Trauma Therapy', 'Mindfulness', 'Addiction Recovery'],
        experience: '6 years',
        qualifications: ['MA Clinical Psychology', 'EMDR Certified'],
        rating: 4.7,
        sessionsCompleted: 189,
      },
    ];
    
    console.log(`✅ Fetched ${mockTherapists.length} therapists via API`);
    return mockTherapists.slice(0, limit);
  } catch (error) {
    console.error('❌ Error fetching therapists:', error);
    throw new Error('Failed to fetch therapists');
  }
};

export const testAPIConnection = async () => {
  try {
    console.log('=== Testing API Connection ===');
    
    // Simulate API delay
    await simulateDelay(300);

    // Simulate API health check
    /*
    const response = await apiClient.makeRequest('/health');
    return response.status === 'ok';
    */

    console.log('✅ API connection test successful');
    return true;
  } catch (error) {
    console.error('❌ API connection test error:', error);
    return false;
  }
};

// Additional helper functions for API-based auth
export const refreshAuthToken = async () => {
  try {
    if (!currentUser) {
      throw new Error('No authenticated user');
    }

    // Simulate API call to refresh token
    /*
    const response = await apiClient.makeRequest('/auth/refresh', {
      method: 'POST',
    });
    apiClient.setAuthToken(response.token);
    */

    console.log('✅ Auth token refreshed');
    return true;
  } catch (error) {
    console.error('❌ Token refresh error:', error);
    throw error;
  }
};

export const validateSession = async () => {
  try {
    if (!currentUser) {
      return false;
    }

    // Simulate API call to validate session
    /*
    const response = await apiClient.makeRequest('/auth/validate');
    return response.valid;
    */

    console.log('✅ Session validated');
    return true;
  } catch (error) {
    console.error('❌ Session validation error:', error);
    return false;
  }
};

// Simulate auth state persistence (normally handled by your app's state management)
export const getCurrentUser = () => {
  return currentUser;
};

export const clearCurrentUser = () => {
  currentUser = null;
  apiClient.setAuthToken(null);
};

// Export the API client for additional custom requests
export { apiClient };