/**
 * @typedef {'visitor' | 'therapist'} UserType
 * @typedef {'male' | 'female' | 'other' | 'prefer-not-to-say'} Gender
 */

// Schema definitions - these define what fields are allowed and required
export const USER_SCHEMA = {
  // Required fields
  required: ['uid', 'email', 'displayName', 'photoURL', 'phoneNumber', 'emailVerified'],
  
  // Optional fields
  optional: ['nickname', 'phone', 'birthYear', 'gender', 'userType', 'createdAt', 'updatedAt'],
  
  // All allowed fields
  all: ['uid', 'email', 'displayName', 'photoURL', 'phoneNumber', 'emailVerified', 
        'nickname', 'phone', 'birthYear', 'gender', 'userType', 'createdAt', 'updatedAt'],
  
  // Field types for validation
  types: {
    uid: 'string',
    email: 'string|null',
    displayName: 'string|null',
    photoURL: 'string|null',
    phoneNumber: 'string|null',
    emailVerified: 'boolean',
    nickname: 'string',
    phone: 'string',
    birthYear: 'string',
    gender: 'enum',
    userType: 'enum',
    createdAt: 'number',
    updatedAt: 'number'
  }
};

export const FIRESTORE_PROFILE_SCHEMA = {
  required: [],
  optional: ['nickname', 'phone', 'birthYear', 'gender', 'userType', 'createdAt', 'updatedAt'],
  all: ['nickname', 'phone', 'birthYear', 'gender', 'userType', 'createdAt', 'updatedAt'],
  types: {
    nickname: 'string',
    phone: 'string',
    birthYear: 'string',
    gender: 'enum',
    userType: 'enum',
    createdAt: 'number',
    updatedAt: 'number'
  }
};

export const LOGIN_FORM_SCHEMA = {
  required: ['email', 'password'],
  optional: ['showPassword'],
  all: ['email', 'password', 'showPassword'],
  types: {
    email: 'string',
    password: 'string',
    showPassword: 'boolean'
  }
};

export const SIGNUP_FORM_SCHEMA = {
  required: ['nickname', 'email', 'password', 'confirmPassword', 'phone', 'birthYear', 
            'gender', 'agreeToPrivacy'],
  optional: ['showPassword', 'showConfirmPassword'],
  all: ['nickname', 'email', 'password', 'confirmPassword', 'phone', 'birthYear', 
        'gender', 'showPassword', 'showConfirmPassword', 'agreeToPrivacy'],
  types: {
    nickname: 'string',
    email: 'string',
    password: 'string',
    confirmPassword: 'string',
    phone: 'string',
    birthYear: 'string',
    gender: 'enum',
    showPassword: 'boolean',
    showConfirmPassword: 'boolean',
    agreeToPrivacy: 'boolean'
  }
};

export const SIGNUP_PAYLOAD_SCHEMA = {
  required: ['email', 'password', 'nickname', 'phone', 'birthYear', 'gender', 'userType'],
  optional: [],
  all: ['email', 'password', 'nickname', 'phone', 'birthYear', 'gender', 'userType'],
  types: {
    email: 'string',
    password: 'string',
    nickname: 'string',
    phone: 'string',
    birthYear: 'string',
    gender: 'enum',
    userType: 'enum'
  }
};

export const SIGNIN_PAYLOAD_SCHEMA = {
  required: ['email', 'password'],
  optional: [],
  all: ['email', 'password'],
  types: {
    email: 'string',
    password: 'string'
  }
};

export const AUTH_STATE_SCHEMA = {
  required: ['user', 'isAuthenticated', 'selectedUserType', 'loginForm', 'signUpForm', 'loading', 'error'],
  optional: [],
  all: ['user', 'isAuthenticated', 'selectedUserType', 'loginForm', 'signUpForm', 'loading', 'error'],
  types: {
    user: 'object|null',
    isAuthenticated: 'boolean',
    selectedUserType: 'enum',
    loginForm: 'object',
    signUpForm: 'object',
    loading: 'boolean',
    error: 'string|null'
  }
};

// Enum definitions
export const VALID_GENDERS = ['male', 'female', 'other', 'prefer-not-to-say'];
export const VALID_USER_TYPES = ['visitor', 'therapist'];

// Default values
export const DEFAULTS = {
  USER_TYPE: 'visitor',
  GENDER: 'female'
};

/**
<<<<<<< HEAD
=======
 * Core User object representing authenticated user data stored in Redux
 * @typedef {Object} User
 * @property {string} uid
 * @property {string|null} email
 * @property {string|null} displayName
 * @property {string|null} photoURL
 * @property {string|null} phoneNumber
 * @property {boolean} emailVerified
 * @property {string} [nickname]
 * @property {string} [phone]
 * @property {string} [birthYear]
 * @property {Gender} [gender]
 * @property {UserType} [userType]
 * @property {number} [createdAt]
 * @property {number} [updatedAt]
 */

/**
 * Firestore user profile (stored in DB)
 * @typedef {Object} FirestoreUserProfile
 * @property {string} [nickname]
 * @property {string} [phone]
 * @property {string} [birthYear]
 * @property {Gender} [gender]
 * @property {UserType} [userType]
 * @property {number} [createdAt]
 * @property {number} [updatedAt]
 */

/**
 * Login form state
 * @typedef {Object} LoginForm
 * @property {string} email
 * @property {string} password
 * @property {boolean} showPassword
 */

/**
 * Sign up form state
 * @typedef {Object} SignUpForm
 * @property {string} nickname
 * @property {string} email
 * @property {string} password
 * @property {string} confirmPassword
 * @property {string} phone
 * @property {string} birthYear
 * @property {Gender} gender
 * @property {boolean} showPassword
 * @property {boolean} showConfirmPassword
 * @property {boolean} agreeToPrivacy
 */

/**
 * Sign-up API payload
 * @typedef {Object} SignUpPayload
 * @property {string} email
 * @property {string} password
 * @property {string} nickname
 * @property {string} phone
 * @property {string} birthYear
 * @property {Gender} gender
 * @property {UserType} userType
 */

/**
 * Sign-in API payload
 * @typedef {Object} SignInPayload
 * @property {string} email
 * @property {string} password
 */

/**
 * Redux auth state
 * @typedef {Object} AuthState
 * @property {User|null} user
 * @property {boolean} isAuthenticated
 * @property {UserType} selectedUserType
 * @property {LoginForm} loginForm
 * @property {SignUpForm} signUpForm
 * @property {boolean} loading
 * @property {string|null} error
 */

/**
>>>>>>> e882e68 (Refactored folder structure)
 * Utility function to get allowed fields for a schema
 * @param {string} schemaName - Name of the schema
 * @returns {string[]} Array of allowed field names
 */
export const getAllowedFields = (schemaName) => {
  const schemas = {
    USER: USER_SCHEMA,
    FIRESTORE_PROFILE: FIRESTORE_PROFILE_SCHEMA,
    LOGIN_FORM: LOGIN_FORM_SCHEMA,
    SIGNUP_FORM: SIGNUP_FORM_SCHEMA,
    SIGNUP_PAYLOAD: SIGNUP_PAYLOAD_SCHEMA,
    SIGNIN_PAYLOAD: SIGNIN_PAYLOAD_SCHEMA,
    AUTH_STATE: AUTH_STATE_SCHEMA
  };
  
  return schemas[schemaName]?.all || [];
};

/**
 * Utility function to get required fields for a schema
 * @param {string} schemaName - Name of the schema
 * @returns {string[]} Array of required field names
 */
export const getRequiredFields = (schemaName) => {
  const schemas = {
    USER: USER_SCHEMA,
    FIRESTORE_PROFILE: FIRESTORE_PROFILE_SCHEMA,
    LOGIN_FORM: LOGIN_FORM_SCHEMA,
    SIGNUP_FORM: SIGNUP_FORM_SCHEMA,
    SIGNUP_PAYLOAD: SIGNUP_PAYLOAD_SCHEMA,
    SIGNIN_PAYLOAD: SIGNIN_PAYLOAD_SCHEMA,
    AUTH_STATE: AUTH_STATE_SCHEMA
  };
  
  return schemas[schemaName]?.required || [];
};

/**
 * Utility function to get field type for validation
 * @param {string} schemaName - Name of the schema
 * @param {string} fieldName - Name of the field
 * @returns {string} Field type
 */
export const getFieldType = (schemaName, fieldName) => {
  const schemas = {
    USER: USER_SCHEMA,
    FIRESTORE_PROFILE: FIRESTORE_PROFILE_SCHEMA,
    LOGIN_FORM: LOGIN_FORM_SCHEMA,
    SIGNUP_FORM: SIGNUP_FORM_SCHEMA,
    SIGNUP_PAYLOAD: SIGNUP_PAYLOAD_SCHEMA,
    SIGNIN_PAYLOAD: SIGNIN_PAYLOAD_SCHEMA,
    AUTH_STATE: AUTH_STATE_SCHEMA
  };
  
  return schemas[schemaName]?.types[fieldName] || 'unknown';
};

/**
 * Validates data against a schema
 * @param {Object} data - Data to validate
 * @param {string} schemaName - Name of the schema to validate against
<<<<<<< HEAD
 * @returns {Object} Validation result with isValid and errors
=======
 * @returns {boolean} Whether data conforms to schema
>>>>>>> e882e68 (Refactored folder structure)
 */
export const conformsToSchema = (data, schemaName) => {
  const schema = {
    USER: USER_SCHEMA,
    FIRESTORE_PROFILE: FIRESTORE_PROFILE_SCHEMA,
    LOGIN_FORM: LOGIN_FORM_SCHEMA,
    SIGNUP_FORM: SIGNUP_FORM_SCHEMA,
    SIGNUP_PAYLOAD: SIGNUP_PAYLOAD_SCHEMA,
    SIGNIN_PAYLOAD: SIGNIN_PAYLOAD_SCHEMA,
    AUTH_STATE: AUTH_STATE_SCHEMA
  }[schemaName];

  if (!schema) {
    console.warn(`Unknown schema: ${schemaName}`);
    return false;
  }

  // Check required fields
  for (const field of schema.required) {
    if (!(field in data) || data[field] === undefined) {
      console.warn(`Missing required field: ${field}`);
      return false;
    }
  }

  // Check for unexpected fields
  for (const field in data) {
    if (!schema.all.includes(field)) {
      console.warn(`Unexpected field: ${field}`);
      return false;
    }
  }

  return true;
};

/**
 * Validates form data
 * @param {Object} formData - Form data to validate
 * @param {string} formType - Type of form ('login' or 'signup')
 * @returns {Object} Validation result
 */
export const validateFormData = (formData, formType) => {
  const errors = [];
  
  if (formType === 'login') {
    if (!formData.email?.trim()) {
      errors.push('Email is required');
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      errors.push('Invalid email format');
    }
    
    if (!formData.password?.trim()) {
      errors.push('Password is required');
    } else if (formData.password.length < 6) {
      errors.push('Password must be at least 6 characters');
    }
  }
  
  if (formType === 'signup') {
    if (!formData.nickname?.trim()) {
      errors.push('Nickname is required');
    }
    
    if (!formData.email?.trim()) {
      errors.push('Email is required');
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      errors.push('Invalid email format');
    }
    
    if (!formData.password?.trim()) {
      errors.push('Password is required');
    } else if (formData.password.length < 6) {
      errors.push('Password must be at least 6 characters');
    }
    
    if (formData.password !== formData.confirmPassword) {
      errors.push('Passwords do not match');
    }
    
    if (!formData.phone?.trim()) {
      errors.push('Phone number is required');
    }
    
    if (!formData.birthYear?.trim()) {
      errors.push('Birth year is required');
    } else {
      const year = parseInt(formData.birthYear);
      const currentYear = new Date().getFullYear();
      if (isNaN(year) || year < 1900 || year > currentYear - 13) {
        errors.push('Invalid birth year (must be at least 13 years old)');
      }
    }
    
    if (!formData.gender) {
      errors.push('Gender selection is required');
    } else if (!VALID_GENDERS.includes(formData.gender)) {
      errors.push('Invalid gender selection');
    }
    
    if (!formData.agreeToPrivacy) {
      errors.push('You must agree to the Privacy Policy');
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Serializes API user data to match the USER_SCHEMA
 * @param {Object} apiUser - User object from API
 * @param {Object} profile - Profile data from API
 * @returns {Object|null} Serialized user object
 */
export const serializeUser = (apiUser, profile = {}) => {
  try {
    if (!apiUser) {
      console.warn('serializeUser: No API user provided');
      return null;
    }

    const serialized = {
      uid: apiUser.uid || `user_${Date.now()}`,
      email: apiUser.email || null,
      displayName: apiUser.displayName || profile.nickname || null,
      photoURL: apiUser.photoURL || null,
      phoneNumber: apiUser.phoneNumber || profile.phone || null,
      emailVerified: apiUser.emailVerified !== undefined ? apiUser.emailVerified : true,
    };

    // Add profile fields if available
    const allowedProfileFields = getAllowedFields('FIRESTORE_PROFILE');
    allowedProfileFields.forEach(field => {
      if (profile && profile[field] !== undefined) {
        serialized[field] = profile[field];
      }
    });

    console.log('User serialized successfully:', Object.keys(serialized));
    return serialized;
  } catch (error) {
    console.error('Error serializing user:', error);
    return null;
  }
};

/**
 * Serializes signup form data to API payload format
 * @param {Object} formData - Signup form data
 * @returns {Object} Serialized signup payload
 */
export const serializeSignUpPayload = (formData) => {
  try {
    const allowedFields = getAllowedFields('SIGNUP_PAYLOAD');
    const payload = {};

    allowedFields.forEach(field => {
      if (formData[field] !== undefined) {
        payload[field] = formData[field];
      }
    });

    // Ensure required fields have values
    const requiredFields = getRequiredFields('SIGNUP_PAYLOAD');
    for (const field of requiredFields) {
      if (!payload[field]) {
        console.warn(`Missing required field in signup payload: ${field}`);
      }
    }

    console.log('Signup payload serialized:', Object.keys(payload));
    return payload;
  } catch (error) {
    console.error('Error serializing signup payload:', error);
    return {};
  }
};

/**
 * Serializes signin form data to API payload format
 * @param {Object} formData - Signin form data
 * @returns {Object} Serialized signin payload
 */
export const serializeSignInPayload = (formData) => {
  try {
    const allowedFields = getAllowedFields('SIGNIN_PAYLOAD');
    const payload = {};

    allowedFields.forEach(field => {
      if (formData[field] !== undefined) {
        payload[field] = formData[field];
      }
    });

    console.log('Signin payload serialized:', Object.keys(payload));
    return payload;
  } catch (error) {
    console.error('Error serializing signin payload:', error);
    return {};
  }
};

/**
 * Creates initial auth state with proper schema compliance
 * @returns {Object} Initial auth state
 */
export const createInitialAuthState = () => {
  return {
    user: null,
    isAuthenticated: false,
    selectedUserType: null,
    loginForm: {
      email: '',
      password: '',
      showPassword: false,
    },
    signUpForm: {
      nickname: '',
      email: '',
      password: '',
      confirmPassword: '',
      phone: '',
      birthYear: '',
      gender: '',
      showPassword: false,
      showConfirmPassword: false,
      agreeToPrivacy: false,
    },
    loading: false,
    error: null,
  };
};

/**
 * Validates enum values
 * @param {any} value - Value to validate
 * @param {string[]} validValues - Array of valid enum values
 * @returns {boolean} Whether value is valid
 */
export const isValidEnum = (value, validValues) => {
  return validValues.includes(value);
};

/**
 * Validates field type
 * @param {any} value - Value to validate
 * @param {string} type - Expected type
 * @returns {boolean} Whether value matches type
 */
export const validateFieldType = (value, type) => {
  if (type.includes('|null') && value === null) {
    return true;
  }
  
  if (type.includes('|undefined') && value === undefined) {
    return true;
  }
  
  const baseType = type.split('|')[0];
  
  switch (baseType) {
    case 'string':
      return typeof value === 'string';
    case 'boolean':
      return typeof value === 'boolean';
    case 'number':
      return typeof value === 'number';
    case 'object':
      return typeof value === 'object';
    case 'enum':
      // For enum validation, we need the specific enum values
      // This is handled separately in conformsToSchema
      return true;
    default:
      return false;
  }
};

/**
 * Comprehensive data validation with detailed error reporting
 * @param {Object} data - Data to validate
 * @param {string} schemaName - Schema name to validate against
 * @returns {Object} Detailed validation result
 */
export const validateDataDetailed = (data, schemaName) => {
  const schema = {
    USER: USER_SCHEMA,
    FIRESTORE_PROFILE: FIRESTORE_PROFILE_SCHEMA,
    LOGIN_FORM: LOGIN_FORM_SCHEMA,
    SIGNUP_FORM: SIGNUP_FORM_SCHEMA,
    SIGNUP_PAYLOAD: SIGNUP_PAYLOAD_SCHEMA,
    SIGNIN_PAYLOAD: SIGNIN_PAYLOAD_SCHEMA,
    AUTH_STATE: AUTH_STATE_SCHEMA
  }[schemaName];

  if (!schema) {
    return {
      isValid: false,
      errors: [`Unknown schema: ${schemaName}`],
      warnings: []
    };
  }

  const errors = [];
  const warnings = [];

  // Check required fields
  for (const field of schema.required) {
    if (!(field in data) || data[field] === undefined) {
      errors.push(`Missing required field: ${field}`);
    }
  }

  // Check field types and enum values
  for (const [field, value] of Object.entries(data)) {
    if (!schema.all.includes(field)) {
      warnings.push(`Unexpected field: ${field}`);
      continue;
    }

    const fieldType = schema.types[field];
    if (fieldType === 'enum') {
      if (field === 'gender' && !isValidEnum(value, VALID_GENDERS)) {
        errors.push(`Invalid gender value: ${value}`);
      } else if (field === 'userType' && !isValidEnum(value, VALID_USER_TYPES)) {
        errors.push(`Invalid userType value: ${value}`);
      }
    } else if (!validateFieldType(value, fieldType)) {
      errors.push(`Invalid type for ${field}: expected ${fieldType}, got ${typeof value}`);
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
};

/**
 * Creates a clean user profile for API storage
 * @param {Object} userData - Raw user data
 * @returns {Object} Clean profile data
 */
export const createCleanProfile = (userData) => {
  const allowedFields = getAllowedFields('FIRESTORE_PROFILE');
  const profile = {};

  allowedFields.forEach(field => {
    if (userData[field] !== undefined) {
      profile[field] = userData[field];
    }
  });

  // Add timestamps if not present
  if (!profile.createdAt) {
    profile.createdAt = Date.now();
  }
  profile.updatedAt = Date.now();

  return profile;
};

/**
 * Sanitizes user input to prevent XSS and other attacks
 * @param {string} input - User input string
 * @returns {string} Sanitized string
 */
export const sanitizeInput = (input) => {
  if (typeof input !== 'string') {
    return input;
  }
  
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .substring(0, 255); // Limit length
};

/**
 * Validates and sanitizes signup form data
 * @param {Object} formData - Raw form data
 * @returns {Object} Sanitized and validated form data
 */
export const sanitizeSignUpForm = (formData) => {
  const sanitized = { ...formData };

  // Sanitize string fields
  const stringFields = ['nickname', 'email', 'phone', 'birthYear'];
  stringFields.forEach(field => {
    if (sanitized[field]) {
      sanitized[field] = sanitizeInput(sanitized[field]);
    }
  });

  // Validate email format
  if (sanitized.email) {
    sanitized.email = sanitized.email.toLowerCase();
  }

  // Validate phone number (basic)
  if (sanitized.phone) {
    sanitized.phone = sanitized.phone.replace(/[^\d+\-\s()]/g, '');
  }

  // Validate birth year
  if (sanitized.birthYear) {
    const year = parseInt(sanitized.birthYear);
    if (!isNaN(year)) {
      sanitized.birthYear = year.toString();
    }
  }

  return sanitized;
};

/**
 * Creates mock user data for testing/development
 * @param {string} userType - Type of user to create
 * @returns {Object} Mock user data
 */
export const createMockUser = (userType = 'visitor') => {
  const baseUser = {
    uid: `mock_${userType}_${Date.now()}`,
    email: `${userType}@example.com`,
    displayName: userType === 'therapist' ? 'Dr. Mock Therapist' : 'Mock Visitor',
    photoURL: null,
    phoneNumber: '+1234567890',
    emailVerified: true,
    nickname: userType === 'therapist' ? 'Dr. Mock' : 'MockUser',
    phone: '+1234567890',
    birthYear: '1990',
    gender: 'prefer-not-to-say',
    userType,
    createdAt: Date.now() - 86400000, // 1 day ago
    updatedAt: Date.now(),
  };

  if (userType === 'therapist') {
    baseUser.isVerified = true;
    baseUser.specializations = ['General Therapy'];
    baseUser.experience = '5 years';
    baseUser.qualifications = ['Licensed Therapist'];
  }

  return baseUser;
};

/**
 * Filters object to only include allowed fields
 * @param {Object} obj - Object to filter
 * @param {string} schemaName - Schema to filter against
 * @returns {Object} Filtered object
 */
export const filterBySchema = (obj, schemaName) => {
  const allowedFields = getAllowedFields(schemaName);
  const filtered = {};

  allowedFields.forEach(field => {
    if (obj && obj[field] !== undefined) {
      filtered[field] = obj[field];
    }
  });

  return filtered;
};

/**
 * Merges user data with profile data safely
 * @param {Object} userData - Base user data
 * @param {Object} profileData - Profile data to merge
 * @returns {Object} Merged user object
 */
export const mergeUserWithProfile = (userData, profileData) => {
  const merged = { ...userData };
  
  const allowedProfileFields = getAllowedFields('FIRESTORE_PROFILE');
  allowedProfileFields.forEach(field => {
    if (profileData && profileData[field] !== undefined) {
      merged[field] = profileData[field];
    }
  });

  return merged;
};

/**
 * Validates user session data
 * @param {Object} sessionData - Session data from API
 * @returns {boolean} Whether session is valid
 */
export const validateSession = (sessionData) => {
  if (!sessionData || !sessionData.user) {
    return false;
  }

  // Check if user has required fields
  const requiredFields = getRequiredFields('USER');
  for (const field of requiredFields) {
    if (!sessionData.user[field] && sessionData.user[field] !== false) {
      console.warn(`Invalid session: missing ${field}`);
      return false;
    }
  }

  return true;
};