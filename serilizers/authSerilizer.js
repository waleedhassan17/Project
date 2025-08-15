// auth/authSerializer.js

import { 
  USER_SCHEMA,
  FIRESTORE_PROFILE_SCHEMA,
  SIGNUP_PAYLOAD_SCHEMA,
  SIGNIN_PAYLOAD_SCHEMA,
  LOGIN_FORM_SCHEMA,
  SIGNUP_FORM_SCHEMA,
  AUTH_STATE_SCHEMA,
  VALID_GENDERS,
  VALID_USER_TYPES,
  DEFAULTS,
  getAllowedFields,
  getRequiredFields,
  getFieldType
} from '../models/authModel';

/**
 * Generic function to filter object data based on schema
 * Discards any extra fields not defined in the model schema
 * @param {Object} data - Raw data from network/form
 * @param {string} schemaName - Name of schema to validate against
 * @returns {Object} Filtered object containing only schema-defined fields
 */
const filterBySchema = (data, schemaName) => {
  if (!data || typeof data !== 'object') {
    return {};
  }

  const allowedFields = getAllowedFields(schemaName);
  const filtered = {};

  // Only include fields that are defined in the schema
  allowedFields.forEach(field => {
    if (data.hasOwnProperty(field)) {
      filtered[field] = data[field];
    }
  });

  return filtered;
};

/**
 * Validates field value against schema type definition
 * @param {any} value - Value to validate
 * @param {string} expectedType - Expected type from schema
 * @param {string} fieldName - Field name for enum validation
 * @returns {boolean} True if value matches expected type
 */
const isValidFieldType = (value, expectedType, fieldName) => {
  switch (expectedType) {
    case 'string':
      return typeof value === 'string';
    case 'string|null':
      return value === null || typeof value === 'string';
    case 'boolean':
      return typeof value === 'boolean';
    case 'number':
      return typeof value === 'number';
    case 'object':
      return typeof value === 'object' && value !== null;
    case 'object|null':
      return value === null || (typeof value === 'object' && value !== null);
    case 'enum':
      if (fieldName === 'gender') {
        return VALID_GENDERS.includes(value);
      }
      if (fieldName === 'userType' || fieldName === 'selectedUserType') {
        return VALID_USER_TYPES.includes(value);
      }
      return false;
    default:
      return true;
  }
};

/**
 * Validates object against schema and filters invalid fields
 * @param {Object} data - Data to validate
 * @param {string} schemaName - Schema name to validate against
 * @returns {Object} Validated and filtered object
 */
const validateAndFilter = (data, schemaName) => {
  const filtered = filterBySchema(data, schemaName);
  const validated = {};
  
  // Get schema for type validation
  const schemas = {
    USER: USER_SCHEMA,
    FIRESTORE_PROFILE: FIRESTORE_PROFILE_SCHEMA,
    LOGIN_FORM: LOGIN_FORM_SCHEMA,
    SIGNUP_FORM: SIGNUP_FORM_SCHEMA,
    SIGNUP_PAYLOAD: SIGNUP_PAYLOAD_SCHEMA,
    SIGNIN_PAYLOAD: SIGNIN_PAYLOAD_SCHEMA,
    AUTH_STATE: AUTH_STATE_SCHEMA
  };
  
  const schema = schemas[schemaName];
  if (!schema) {
    return filtered;
  }

  // Validate each field against its expected type
  Object.entries(filtered).forEach(([key, value]) => {
    const expectedType = schema.types[key];
    if (expectedType && isValidFieldType(value, expectedType, key)) {
      validated[key] = value;
    } else if (expectedType) {
      console.warn(`Field '${key}' failed type validation. Expected: ${expectedType}, Got: ${typeof value}`);
    }
  });

  return validated;
};

/**
 * Serializes Firebase User and Firestore profile data into a clean User object
 * Filters out any extra fields not defined in USER_SCHEMA
 * 
 * @param {Object|null} firebaseUser - Firebase User object from Firebase Auth
 * @param {Object} firestoreProfile - Profile data from Firestore (optional)
 * @returns {Object|null} Clean User object matching USER_SCHEMA or null
 */
export const serializeUser = (firebaseUser, firestoreProfile = {}) => {
  if (!firebaseUser) {
    console.log('No Firebase user to serialize');
    return null;
  }

  try {
    // Combine Firebase user and Firestore profile data
    const combinedData = {
      // Firebase Auth fields
      uid: firebaseUser.uid,
      email: firebaseUser.email || null,
      displayName: firebaseUser.displayName || null,
      photoURL: firebaseUser.photoURL || null,
      phoneNumber: firebaseUser.phoneNumber || null,
      emailVerified: firebaseUser.emailVerified || false,
      
      // Firestore profile fields
      ...firestoreProfile
    };

    // Filter and validate against USER_SCHEMA
    const serializedUser = validateAndFilter(combinedData, 'USER');

    // Ensure required fields are present
    const requiredFields = getRequiredFields('USER');
    const missingFields = requiredFields.filter(field => !(field in serializedUser));
    
    if (missingFields.length > 0) {
      console.error('Missing required fields in user data:', missingFields);
      return null;
    }

    console.log('User serialized successfully:', serializedUser.uid);
    console.log('Filtered fields:', Object.keys(serializedUser));
    return serializedUser;
    
  } catch (error) {
    console.error('Error serializing user:', error);
    return null;
  }
};

/**
 * Serializes sign up form data into a clean payload matching SIGNUP_PAYLOAD_SCHEMA
 * Discards any extra form fields not defined in the schema
 * 
 * @param {Object} formData - Raw form data from Redux state
 * @returns {Object} Clean payload for registration API
 * @throws {Error} If validation fails
 */
export const serializeSignUpPayload = (formData) => {
  try {
    // Add default userType if not provided
    const dataWithDefaults = {
      ...formData,
      userType: formData.userType || DEFAULTS.USER_TYPE,
      gender: formData.gender || 'prefer-not-to-say'
    };

    // Filter and validate against SIGNUP_PAYLOAD_SCHEMA
    const payload = validateAndFilter(dataWithDefaults, 'SIGNUP_PAYLOAD');

    // Check required fields
    const requiredFields = getRequiredFields('SIGNUP_PAYLOAD');
    const missingFields = requiredFields.filter(field => {
      const value = payload[field];
      return !value || (typeof value === 'string' && value.trim().length === 0);
    });

    if (missingFields.length > 0) {
      throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
    }

    // Clean string fields
    if (payload.email) payload.email = payload.email.trim().toLowerCase();
    if (payload.nickname) payload.nickname = payload.nickname.trim();
    if (payload.phone) payload.phone = payload.phone.trim();
    if (payload.birthYear) payload.birthYear = payload.birthYear.trim();

    console.log('Sign up payload serialized:', { ...payload, password: '[HIDDEN]' });
    console.log('Filtered fields:', Object.keys(payload));
    return payload;
    
  } catch (error) {
    console.error('Error serializing sign up payload:', error);
    throw error;
  }
};

/**
 * Serializes sign in form data into a clean payload matching SIGNIN_PAYLOAD_SCHEMA
 * Discards any extra form fields not defined in the schema
 * 
 * @param {Object} formData - Raw form data from Redux state
 * @returns {Object} Clean payload for login API
 * @throws {Error} If validation fails
 */
export const serializeSignInPayload = (formData) => {
  try {
    // Filter and validate against SIGNIN_PAYLOAD_SCHEMA
    const payload = validateAndFilter(formData, 'SIGNIN_PAYLOAD');

    // Check required fields
    const requiredFields = getRequiredFields('SIGNIN_PAYLOAD');
    const missingFields = requiredFields.filter(field => {
      const value = payload[field];
      return !value || (typeof value === 'string' && value.trim().length === 0);
    });

    if (missingFields.length > 0) {
      throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
    }

    // Clean email
    if (payload.email) payload.email = payload.email.trim().toLowerCase();

    console.log('Sign in payload serialized:', { ...payload, password: '[HIDDEN]' });
    console.log('Filtered fields:', Object.keys(payload));
    return payload;
    
  } catch (error) {
    console.error('Error serializing sign in payload:', error);
    throw error;
  }
};

/**
 * Creates initial login form state matching LOGIN_FORM_SCHEMA
 * @returns {Object} Initial login form state
 */
export const createInitialLoginForm = () => {
  const allowedFields = getAllowedFields('LOGIN_FORM');
  const initialForm = {};

  allowedFields.forEach(field => {
    switch (field) {
      case 'email':
      case 'password':
        initialForm[field] = '';
        break;
      case 'showPassword':
        initialForm[field] = false;
        break;
    }
  });

  return initialForm;
};

/**
 * Creates initial sign up form state matching SIGNUP_FORM_SCHEMA
 * @returns {Object} Initial sign up form state
 */
export const createInitialSignUpForm = () => {
  const allowedFields = getAllowedFields('SIGNUP_FORM');
  const initialForm = {};

  allowedFields.forEach(field => {
    switch (field) {
      case 'nickname':
      case 'email':
      case 'password':
      case 'confirmPassword':
      case 'phone':
      case 'birthYear':
        initialForm[field] = '';
        break;
      case 'gender':
        initialForm[field] = DEFAULTS.GENDER;
        break;
      case 'showPassword':
      case 'showConfirmPassword':
      case 'agreeToPrivacy':
        initialForm[field] = false;
        break;
    }
  });

  return initialForm;
};

/**
 * Creates initial auth state matching AUTH_STATE_SCHEMA
 * @returns {Object} Initial auth state for Redux
 */
export const createInitialAuthState = () => {
  const allowedFields = getAllowedFields('AUTH_STATE');
  const initialState = {};

  allowedFields.forEach(field => {
    switch (field) {
      case 'user':
      case 'error':
        initialState[field] = null;
        break;
      case 'isAuthenticated':
      case 'loading':
        initialState[field] = false;
        break;
      case 'selectedUserType':
        initialState[field] = DEFAULTS.USER_TYPE;
        break;
      case 'loginForm':
        initialState[field] = createInitialLoginForm();
        break;
      case 'signUpForm':
        initialState[field] = createInitialSignUpForm();
        break;
    }
  });

  return initialState;
};

/**
 * Validates and serializes user profile update data
 * Filters out any fields not defined in FIRESTORE_PROFILE_SCHEMA
 * 
 * @param {Object} updateData - Profile data to update
 * @returns {Object} Clean, validated profile update data
 * @throws {Error} If validation fails
 */
export const serializeProfileUpdate = (updateData) => {
  try {
    // Add updatedAt timestamp
    const dataWithTimestamp = {
      ...updateData,
      updatedAt: Date.now()
    };

    // Filter and validate against FIRESTORE_PROFILE_SCHEMA
    const cleanUpdate = validateAndFilter(dataWithTimestamp, 'FIRESTORE_PROFILE');

    // Additional validation for specific fields
    if (cleanUpdate.birthYear) {
      const birthYear = cleanUpdate.birthYear.trim();
      if (birthYear.length === 4 && /^\d{4}$/.test(birthYear)) {
        const year = parseInt(birthYear, 10);
        const currentYear = new Date().getFullYear();
        if (year < 1900 || year > currentYear) {
          delete cleanUpdate.birthYear;
          console.warn('Invalid birth year removed from update');
        }
      } else {
        delete cleanUpdate.birthYear;
        console.warn('Invalid birth year format removed from update');
      }
    }

    // Clean string fields
    if (cleanUpdate.nickname) cleanUpdate.nickname = cleanUpdate.nickname.trim();
    if (cleanUpdate.phone) cleanUpdate.phone = cleanUpdate.phone.trim();

    console.log('Profile update serialized:', cleanUpdate);
    console.log('Filtered fields:', Object.keys(cleanUpdate));
    return cleanUpdate;
    
  } catch (error) {
    console.error('Error serializing profile update:', error);
    throw new Error('Invalid profile update data');
  }
};

/**
 * Validates form data against schema before submission
 * @param {Object} formData - Form data to validate
 * @param {string} formType - Type of form ('login' or 'signup')
 * @returns {Object} Validation result with isValid boolean and errors array
 */
export const validateFormData = (formData, formType = 'login') => {
  const errors = [];
  const schemaName = formType === 'login' ? 'LOGIN_FORM' : 'SIGNUP_FORM';
  
  try {
    // Filter data against schema first
    const filteredData = filterBySchema(formData, schemaName);
    
    // Check required fields
    const requiredFields = getRequiredFields(schemaName);
    
    requiredFields.forEach(field => {
      const value = filteredData[field];
      
      if (value === undefined || value === null) {
        errors.push(`${field} is required`);
        return;
      }
      
      if (typeof value === 'string' && value.trim().length === 0) {
        errors.push(`${field} cannot be empty`);
        return;
      }
      
      // Specific validations
      if (field === 'email' && typeof value === 'string') {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
          errors.push('Please enter a valid email address');
        }
      }
      
      if (field === 'password' && typeof value === 'string' && value.length < 6) {
        errors.push('Password must be at least 6 characters');
      }
    });
    
    // Additional validations for signup
    if (formType === 'signup') {
      if (filteredData.password !== filteredData.confirmPassword) {
        errors.push('Passwords do not match');
      }
      
      if (!filteredData.agreeToPrivacy) {
        errors.push('Please accept the privacy policy');
      }
    }
    
  } catch (error) {
    console.error('Error validating form data:', error);
    errors.push('Form validation failed');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

/**
 * Utility function to check if data conforms to a specific schema
 * @param {Object} data - Data to check
 * @param {string} schemaName - Schema to validate against
 * @returns {boolean} True if data matches schema
 */
export const conformsToSchema = (data, schemaName) => {
  try {
    const allowedFields = getAllowedFields(schemaName);
    const requiredFields = getRequiredFields(schemaName);
    
    // Check if all required fields are present
    const hasAllRequired = requiredFields.every(field => 
      data.hasOwnProperty(field) && data[field] !== undefined && data[field] !== null
    );
    
    if (!hasAllRequired) {
      return false;
    }
    
    // Check if there are no extra fields
    const dataFields = Object.keys(data);
    const hasExtraFields = dataFields.some(field => !allowedFields.includes(field));
    
    return !hasExtraFields;
    
  } catch (error) {
    console.error('Error checking schema conformance:', error);
    return false;
  }
};

// Export schema information for external use
export { 
  getAllowedFields, 
  getRequiredFields, 
  getFieldType, 
  VALID_GENDERS, 
  VALID_USER_TYPES, 
  DEFAULTS 
};