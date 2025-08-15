import { auth, db } from '../firebase/firebaseConfig';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
  updateProfile,
} from 'firebase/auth';
import {
  doc,
  setDoc,
  getDoc,
  collection,
  getDocs,
} from 'firebase/firestore';


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
  // Add Firestore error codes
  'permission-denied': 'Permission denied. Check Firestore security rules.',
  'unavailable': 'Firestore service is currently unavailable.',
  'invalid-argument': 'Invalid data provided to Firestore.',
};


export const mapAuthError = (code, fallback = 'Something went wrong') => {
  return AUTH_ERROR_MESSAGES[code] || fallback;
};


const validateFirestoreConnection = () => {
  if (!db) {
    throw new Error('Firestore database not initialized. Check your Firebase config.');
  }
  console.log('Firestore connection validated');
};


const getCollectionName = (userType) => {
  return userType === 'therapist' ? 'therapists' : 'users';
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
    console.log('=== Starting user registration ===');
    console.log('Email:', email);
    console.log('User type:', userType);
    
    validateFirestoreConnection();
    
    console.log('Creating Firebase Auth user...');
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    console.log('✅ Firebase Auth user created successfully:', user.uid);

    if (nickname) {
      try {
        await updateProfile(user, { displayName: nickname });
        console.log('✅ Display name updated:', nickname);
      } catch (profileError) {
        console.warn('⚠️ Failed to update display name:', profileError.message);
     
      }
    }


    const collectionName = getCollectionName(userType);
    console.log('Storing user in collection:', collectionName);

  
    const profileData = {
      nickname: nickname || '',
      phone: phone || '',
      birthYear: birthYear || '',
      gender: gender || '',
      userType: userType || 'visitor',
      email: email,
      uid: user.uid, 
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    if (userType === 'therapist') {
      profileData.isVerified = false; 
      profileData.specializations = []; // Can be populated later
      profileData.experience = ''; // Can be populated later
      profileData.qualifications = []; // Can be populated later
    }

    console.log('Preparing to save profile data:', JSON.stringify(profileData, null, 2));

  
    try {
      const userDocRef = doc(db, collectionName, user.uid);
      console.log(`Document reference created for path: ${collectionName}/${user.uid}`);
      
      await setDoc(userDocRef, profileData);
      console.log(`✅ Profile saved to ${collectionName} collection successfully!`);
      
  
      const verifyDoc = await getDoc(userDocRef);
      if (verifyDoc.exists()) {
        console.log('✅ Verification: Document exists in Firestore');
        console.log('Saved data:', verifyDoc.data());
      } else {
        console.error('❌ Verification failed: Document not found after save');
      }
      
    } catch (firestoreError) {
      console.error('❌ Firestore save error:', firestoreError);
      console.error('Error code:', firestoreError.code);
      console.error('Error message:', firestoreError.message);
      
   
      throw new Error(`Failed to save profile: ${mapAuthError(firestoreError.code, firestoreError.message)}`);
    }

    console.log('=== Registration completed successfully ===');
    return {
      user: user,
      profile: profileData,
      collection: collectionName,
    };

  } catch (error) {
    console.error('❌ Registration error:', error);
    console.error('Error code:', error.code);
    console.error('Error message:', error.message);
    throw new Error(mapAuthError(error.code, error.message));
  }
};


export const loginUser = async ({ email, password }) => {
  try {
    console.log('=== Starting user login ===');
    console.log('Email:', email);
    
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    console.log('✅ User logged in successfully:', user.uid);


    const profile = await getUserProfileFromFirestore(user.uid);

    return {
      user: user,
      profile: profile,
    };
  } catch (error) {
    console.error('❌ Login error:', error);
    throw new Error(mapAuthError(error.code, error.message));
  }
};


export const logoutUser = async () => {
  try {
    console.log('Attempting to logout user');
    await signOut(auth);
    console.log('✅ User logged out successfully');
    return true;
  } catch (error) {
    console.error('❌ Logout error:', error);
    throw new Error(mapAuthError(error.code, error.message));
  }
};


export const sendPasswordReset = async (email) => {
  try {
    console.log('Sending password reset email to:', email);
    await sendPasswordResetEmail(auth, email);
    console.log('✅ Password reset email sent successfully');
    return true;
  } catch (error) {
    console.error('❌ Password reset error:', error);
    throw new Error(mapAuthError(error.code, error.message));
  }
};


export const getUserProfileFromFirestore = async (uid) => {
  try {
    console.log('=== Fetching user profile from Firestore ===');
    console.log('UID:', uid);
    
    validateFirestoreConnection();
    
  
    let docRef = doc(db, 'users', uid);
    console.log('Checking document path: users/' + uid);
    
    let docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      const profile = docSnap.data();
      console.log('✅ Profile fetched from users collection:', profile);
      return { ...profile, collection: 'users' };
    }

  
    docRef = doc(db, 'therapists', uid);
    console.log('Checking document path: therapists/' + uid);
    
    docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      const profile = docSnap.data();
      console.log('✅ Profile fetched from therapists collection:', profile);
      return { ...profile, collection: 'therapists' };
    }

    console.log('⚠️ No profile found in either collection for user:', uid);
    return {};
    
  } catch (error) {
    console.error('❌ Failed to get user profile from Firestore:', error);
    console.error('Error code:', error.code);
    console.error('Error message:', error.message);
    return {};
  }
};


export const updateUserDisplayName = async (user, displayName) => {
  try {
    console.log('Updating display name:', displayName);
    await updateProfile(user, { displayName });
    console.log('✅ Display name updated successfully');
    return user;
  } catch (error) {
    console.error('❌ Update display name error:', error);
    throw new Error(mapAuthError(error.code, error.message));
  }
};

export const updateUserProfileInFirestore = async (uid, profileData, userType = null) => {
  try {
    console.log('=== Updating user profile in Firestore ===');
    console.log('UID:', uid);
    console.log('Profile data:', profileData);
    
    validateFirestoreConnection();
    

    let collectionName;
    
    if (userType) {
      collectionName = getCollectionName(userType);
    } else {
  
      const existingProfile = await getUserProfileFromFirestore(uid);
      collectionName = existingProfile.collection || 'users'; 
    }
    
    const updateData = {
      ...profileData,
      updatedAt: new Date().toISOString(),
    };
    
    const docRef = doc(db, collectionName, uid);
    await setDoc(docRef, updateData, { merge: true });
    
    console.log(`✅ Profile updated in ${collectionName} collection successfully`);
    return { ...updateData, collection: collectionName };
  } catch (error) {
    console.error('❌ Update profile error:', error);
    console.error('Error code:', error.code);
    throw new Error(mapAuthError(error.code, 'Failed to update user profile'));
  }
};

export const setupAuthStateListener = (callback) => {
  console.log('Setting up auth state listener');
  
  return onAuthStateChanged(auth, async (firebaseUser) => {
    console.log('Auth state changed:', firebaseUser ? firebaseUser.uid : 'No user');
    
    if (!firebaseUser) {
      callback(null, null);
      return;
    }

    try {
      const profile = await getUserProfileFromFirestore(firebaseUser.uid);
      callback(firebaseUser, profile);
    } catch (error) {
      console.error('❌ Error in auth state listener:', error);
      callback(firebaseUser, {});
    }
  });
};


export const getTherapists = async (limit = 10) => {
  try {
    console.log('=== Fetching therapists ===');
    validateFirestoreConnection();
    

    const therapistsRef = collection(db, 'therapists');
    const snapshot = await getDocs(therapistsRef);
    
    const therapists = [];
    snapshot.forEach((doc) => {
      therapists.push({ id: doc.id, ...doc.data() });
    });
    
    console.log(`✅ Fetched ${therapists.length} therapists`);
    return therapists;
  } catch (error) {
    console.error('❌ Error fetching therapists:', error);
    throw new Error('Failed to fetch therapists');
  }
};


export const testFirestoreConnection = async () => {
  try {
    console.log('=== Testing Firestore Connection ===');
    validateFirestoreConnection();
    
    const testDocRef = doc(db, 'test', 'connection');
    await setDoc(testDocRef, {
      message: 'Firestore connection test',
      timestamp: new Date().toISOString(),
    });
    
    const testDoc = await getDoc(testDocRef);
    if (testDoc.exists()) {
      console.log('✅ Firestore connection test successful');
      console.log('Test data:', testDoc.data());
      return true;
    } else {
      console.error('❌ Firestore connection test failed: Document not found');
      return false;
    }
  } catch (error) {
    console.error('❌ Firestore connection test error:', error);
    return false;
  }
};