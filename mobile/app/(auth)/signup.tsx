import * as React from 'react'
import { Text, TextInput, TouchableOpacity, View } from 'react-native'
import { useRouter } from 'expo-router'
import { useState } from 'react'
import { styles } from '@/assets/styles/auth.styles'
import { COLORS } from '@/constants/colors'
import { Ionicons } from '@expo/vector-icons'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { api, signupUser } from '../../services/authService'
import { registerForPushNotificationsAsync } from '../../services/notificationService';


export default function SignUpScreen() {
  const router = useRouter()
  const [emailAddress, setEmailAddress] = useState('')
  const [password, setPassword] = useState('')
  const [userName, setUserName] = useState('')
  const [code, setCode] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false);
  
  // Handle submission of sign-up form
  const onSignUpPress = async () => {
    setError('');
    setLoading(true);
    // router.replace('/feed')
    try {
      const payload = { email: emailAddress, password: password, userName: userName };
      const response = await signupUser(payload);
      console.log('Signup Success:', response);
      const { accessToken } = response;

      const pushToken = await registerForPushNotificationsAsync();

      if (pushToken) {
        // 2. Send token to backend
        await api.post(
          '/user/push-token',
          { token: pushToken },
          { headers: { Authorization: `Bearer ${accessToken}` } }
        );
        console.log('Push token saved successfully');
      }

      router.replace('/feed');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <KeyboardAwareScrollView 
      style={{ flex:1 }} 
      contentContainerStyle={{flexGrow:1}} 
      enableOnAndroid={true}
      enableAutomaticScroll={true}
      >
      <View style={styles.container}>
        <Text style={styles.title}>Create Account</Text>
        
        {error ? (
          <View style={styles.errorBox}>
            <Ionicons name="alert-circle" size={20} color={COLORS.expense} />
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity onPress={() => setError('')}>
              <Ionicons name="close" size={20} color={COLORS.textLight} />
            </TouchableOpacity>
          </View>
        ):null}

        <TextInput
          style={[styles.input, error && styles.errorInput]}
          autoCapitalize="none"
          value={emailAddress}
          placeholder="Enter email"
          placeholderTextColor="#9A8478"
          onChangeText={(email) => setEmailAddress(email)}
        />
        <TextInput
          style={[styles.input, error && styles.errorInput]}
          autoCapitalize="none"
          placeholder="Create username"
          placeholderTextColor="#9A8478"
          onChangeText={(userName) => setUserName(userName)}
        />
        <TextInput
          style={[styles.input, error && styles.errorInput]}
          autoCapitalize="none"
          value={password}
          placeholder="Enter password"
          placeholderTextColor="#9A8478"
          secureTextEntry={true}
          onChangeText={(password) => setPassword(password)}
        />
        
        <TouchableOpacity style={styles.button} onPress={onSignUpPress} disabled={loading}>
          <Text style={styles.buttonText}>{loading ? 'Signing Up...' : 'Sign Up'}</Text>
        </TouchableOpacity>

        <View style={styles.footerContainer}>
          <Text style={styles.footerText}>Already have an account?</Text>
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={styles.linkText}>Login</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAwareScrollView>
  )
}