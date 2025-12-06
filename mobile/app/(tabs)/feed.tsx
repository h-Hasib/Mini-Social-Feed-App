import { View, Text } from 'react-native'
import React from 'react'
import { SignedIn, SignedOut, useUser } from '@clerk/clerk-expo'
import { SignOutButton } from '@/components/SignOutButton'
import { Link } from 'expo-router'

const feed = () => {
  const { user } = useUser()
  return ( 
    <View>
      <View>
      <Text>feed</Text>
      </View>
      <SignedIn>
        <Text>Hello {user?.emailAddresses[0].emailAddress}</Text>
        <SignOutButton />
      </SignedIn>
      <SignedOut>
        <Link href="/(auth)/login">
          <Text>Sign in</Text>
        </Link>
        <Link href="/(auth)/signup">
          <Text>Sign up</Text>
        </Link>
      </SignedOut>
    </View>
  )
}

export default feed