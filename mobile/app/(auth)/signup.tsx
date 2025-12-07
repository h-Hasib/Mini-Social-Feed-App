import * as React from 'react'
import { Text, TextInput, TouchableOpacity, View } from 'react-native'
import { useRouter } from 'expo-router'
import { useState } from 'react'
import { styles } from '@/assets/styles/auth.styles'
import { COLORS } from '@/constants/colors'
import { Ionicons } from '@expo/vector-icons'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

export default function SignUpScreen() {
  const router = useRouter()
  const [emailAddress, setEmailAddress] = useState('')
  const [password, setPassword] = useState('')
  const [code, setCode] = useState('')
  const [error, setError] = useState('')
  
  // Handle submission of sign-up form
  const onSignUpPress = async () => {
    router.replace('/feed')
  }

  // Handle submission of verification form
  const onVerifyPress = async () => {
    router.replace('/feed')
  }

  // if (pendingVerification) {
  //   return (
  //     <View style={styles.verificationContainer}>
  //       <Text style={styles.verificationTitle}>Verify your email</Text>

  //       {error ? (
  //         <View style={styles.errorBox}>
  //           <Ionicons name="alert-circle" size={20} color={COLORS.expense} />
  //           <Text style={styles.errorText}>{error}</Text>
  //           <TouchableOpacity onPress={() => setError('')}>
  //             <Ionicons name="close" size={20} color={COLORS.textLight} />
  //           </TouchableOpacity>
  //         </View>
  //       ):null}

  //       <TextInput
  //         style={[styles.verificationInput, error && styles.errorInput]}
  //         value={code}
  //         placeholder="Enter your verification code"
  //         onChangeText={(code) => setCode(code)}
  //       />
  //       <TouchableOpacity onPress={onVerifyPress} style={styles.button}>
  //         <Text style={styles.buttonText}>Verify</Text>
  //       </TouchableOpacity>
  //     </View>
  //   )
  // }

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
          value={password}
          placeholder="Enter password"
          placeholderTextColor="#9A8478"
          secureTextEntry={true}
          onChangeText={(password) => setPassword(password)}
        />
        
        <TouchableOpacity style={styles.button} onPress={onSignUpPress}>
          <Text style={styles.buttonText}>Sign Up</Text>
        </TouchableOpacity>

        <View style={styles.footerContainer}>
          <Text style={styles.footerText}>Already have an account?</Text>
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={styles.linkText}>Sign in</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAwareScrollView>
  )
}