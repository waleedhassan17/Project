import React, { useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useAppSelector, useAppDispatch } from '../../hooks/useReduxHooks';
import {
  selectSelectedUserType,
  selectLoginForm,
  selectAuthLoading,
  selectAuthError,
  setSelectedUserType,
  setLoginEmail,
  setLoginPassword,
  toggleLoginPasswordVisibility,
  signInWithEmail,
  clearError,
} from './authSlice';
import CustomInput from '../../components/CustomInput';
import CustomButton from '../../components/CustomButton';
import AppLogo from '../../components/AppLogo';

const ShezlongLogin = () => {
  const navigation = useNavigation();
  const dispatch = useAppDispatch();
  
  const selectedUserType = useAppSelector(selectSelectedUserType);
  const { email, password, showPassword } = useAppSelector(selectLoginForm);
  const loading = useAppSelector(selectAuthLoading);
  const error = useAppSelector(selectAuthError);

  const userTypeOptions = [
    { value: 'visitor', label: 'Visitor', icon: 'person' },
    { value: 'therapist', label: 'Therapist', icon: 'medical' }
  ];


  useEffect(() => {
    if (error) {
      dispatch(clearError());
    }
  }, [email, password, selectedUserType]);

  const validateForm = () => {
 
    if (!selectedUserType) {
      Alert.alert('Error', 'Please select whether you are a Visitor or Therapist');
      return false;
    }

    if (!email.trim()) {
      Alert.alert('Error', 'Please enter your email address');
      return false;
    }
    
  
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      Alert.alert('Error', 'Please enter a valid email address');
      return false;
    }
    
    if (!password.trim()) {
      Alert.alert('Error', 'Please enter your password');
      return false;
    }

    if (password.trim().length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters long');
      return false;
    }
    
    return true;
  };

  const handleSignIn = async () => {
    console.log('Login attempt started');
    
    if (error) {
      dispatch(clearError());
    }

    if (!validateForm()) {
      return;
    }

    try {
      console.log('Attempting to sign in with:', { 
        email: email.trim(), 
        userType: selectedUserType 
      });
      
      const result = await dispatch(signInWithEmail({ 
        email: email.trim(), 
        password,
        userType: selectedUserType 
      })).unwrap();
      
      console.log('Login successful:', result);
      
    
      try {
        navigation.navigate('Home');
      } catch (navigationError) {
        console.error('Navigation error:', navigationError);
        navigation.replace('Home');
      }
    } catch (err) {
      console.error('Login failed:', err);
      Alert.alert('Login Failed', err || 'Please check your credentials and try again.');
    }
  };

  const handleForgotPassword = () => {
    Alert.alert(
      'Forgot Password',
      'Please contact support or use the password reset feature.',
      [{ text: 'OK' }]
    );
  };

  const handleEmailChange = (text) => {
    dispatch(setLoginEmail(text));
    if (error) {
      dispatch(clearError());
    }
  };

  const handlePasswordChange = (text) => {
    dispatch(setLoginPassword(text));
    if (error) {
      dispatch(clearError());
    }
  };

  const handleUserTypeChange = (userType) => {
    dispatch(setSelectedUserType(userType));
    if (error) {
      dispatch(clearError());
    }
  };

  const isFormComplete = () => {
    return selectedUserType && email.trim() && password.trim();
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Logo and Header */}
        <AppLogo size="large" />

        {/* Sign in as */}
        <Text style={styles.signInText}>Sign in as</Text>

        {/* User Type Selection */}
        <View style={styles.userTypeContainer}>
          {userTypeOptions.map((option) => (
            <TouchableOpacity
              key={option.value}
              style={[
                styles.userTypeButton,
                selectedUserType === option.value && styles.selectedUserType,
              ]}
              onPress={() => handleUserTypeChange(option.value)}
              disabled={loading}
            >
              <View
                style={[
                  styles.userTypeIcon,
                  selectedUserType === option.value && styles.selectedUserTypeIcon,
                ]}
              >
                <Ionicons
                  name={option.icon}
                  size={32}
                  color={selectedUserType === option.value ? '#4A90E2' : '#999'}
                />
              </View>
              <Text
                style={[
                  styles.userTypeText,
                  selectedUserType === option.value && styles.selectedUserTypeText,
                ]}
              >
                {option.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Selection indicator */}
        {!selectedUserType && (
          <View style={styles.selectionHint}>
            <Text style={styles.selectionHintText}>
              Please select your account type above
            </Text>
          </View>
        )}

        {/* Error Display */}
        {error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        {/* Form Fields */}
        <View style={styles.formContainer}>
          <CustomInput
            placeholder="Email"
            value={email}
            onChangeText={handleEmailChange}
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
            editable={!loading}
          />

          <CustomInput
            placeholder="Password"
            value={password}
            onChangeText={handlePasswordChange}
            secureTextEntry={!showPassword}
            showPasswordToggle
            showPassword={showPassword}
            onTogglePassword={() => dispatch(toggleLoginPasswordVisibility())}
            autoComplete="password"
            editable={!loading}
          />

          <TouchableOpacity 
            style={styles.forgotPasswordContainer}
            onPress={handleForgotPassword}
            disabled={loading}
          >
            <Text style={styles.forgotPasswordText}>Forget password?</Text>
          </TouchableOpacity>
        </View>

        {/* Sign In Button */}
        <CustomButton
          title={loading ? "Signing in..." : "Sign in"}
          onPress={handleSignIn}
          style={[
            styles.signInButton,
            loading && styles.signInButtonDisabled,
            !isFormComplete() && styles.signInButtonDisabled
          ]}
          disabled={loading || !isFormComplete()}
        />

        {/* Sign Up Link */}
        <View style={styles.signUpContainer}>
          <Text style={styles.signUpText}>If you have not an account </Text>
          <TouchableOpacity 
            onPress={() => navigation.navigate('SignUp')}
            disabled={loading}
          >
            <Text style={[
              styles.signUpLink,
              loading && styles.signUpLinkDisabled
            ]}>
              Sign up
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
     flex: 1,
     backgroundColor: '#F5F5F5'
   },
  content: {
     flex: 1,
     paddingHorizontal: 20, 
     paddingTop: 40
   },
  signInText: { 
    fontSize: 18,
    color: '#333', 
    textAlign: 'center', 
    marginBottom: 30 
  },
  userTypeContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
    gap: 60,
  },
  userTypeButton: {
     alignItems: 'center' 
    },
  userTypeIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#E0E0E0',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  selectedUserTypeIcon: { 
    backgroundColor: '#E3F2FD'
   },
  userTypeText: { 
    fontSize: 16,
    color: '#999',
    fontWeight: '500'
   },
  selectedUserTypeText: {
     color: '#4A90E2', 
     fontWeight: '600'
   },
  selectionHint: {
    backgroundColor: '#FFF3E0',
    borderLeftWidth: 4,
    borderLeftColor: '#FF9800',
    padding: 12,
    marginBottom: 20,
    borderRadius: 4,
  },
  selectionHintText: {
    color: '#F57C00',
    fontSize: 14,
    textAlign: 'center',
    fontWeight: '500',
  },
  errorContainer: {
    backgroundColor: '#FFEBEE',
    borderLeftWidth: 4,
    borderLeftColor: '#F44336',
    padding: 12,
    marginBottom: 20,
    borderRadius: 4,
  },
  errorText: {
    color: '#D32F2F',
    fontSize: 14,
    fontWeight: '500',
  },
  formContainer: {
     marginBottom: 30 
  },
  forgotPasswordContainer: {
     alignItems: 'flex-start', 
     marginTop: -8 
  },
  forgotPasswordText: {
    color: '#4A90E2',
    fontSize: 14 
  },
  signInButton: {
     marginBottom: 30 
  },
  signInButtonDisabled: {
    opacity: 0.6 
  },
  signUpContainer: { 
    flexDirection: 'row',
    justifyContent: 'center',
     alignItems: 'center'
   },
  signUpText: {
     color: '#999', 
     fontSize: 14 
    },
  signUpLink: { 
    color: '#4A90E2', 
    fontSize: 14, 
    fontWeight: '500' 
  },
  signUpLinkDisabled: { 
    opacity: 0.6
   },
});

export default ShezlongLogin;