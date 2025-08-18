

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
  required: ['email', 'password'], // Remove 'showPassword' from required
  optional: ['showPassword'], // Move it to optional
  all: ['email', 'password', 'showPassword'],
  types: {
    email: 'string',
    password: 'string',
    showPassword: 'boolean'
  }
};

export const SIGNUP_FORM_SCHEMA = {
  required: ['nickname', 'email', 'password', 'confirmPassword', 'phone', 'birthYear', 
            'gender',  'agreeToPrivacy'],
  optional: ['showPassword', 'showConfirmPassword',],
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