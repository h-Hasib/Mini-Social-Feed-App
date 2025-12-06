// import { View, Text, Button } from "react-native";
// import { logoutUser } from "@/services/auth.service";
// import { router } from "expo-router";

// export default function ProfileScreen() {
//   async function handleLogout() {
//     await logoutUser();
//     router.replace("/(auth)/login");
//   }

//   return (
//     <View style={{ padding: 20 }}>
//       <Text>Profile Page</Text>
//       <Button title="Log Out" onPress={handleLogout} />
//     </View>
//   );
// }


import { View, Text } from 'react-native'
import React from 'react'
import { SignedIn, SignedOut, useUser } from '@clerk/clerk-expo'
import { Link } from 'expo-router'
import { SignOutButton } from '@/components/SignOutButton'

const profile = () => {
  const { user } = useUser()
  return (
    <View>
      <View>
      <Text>Profile</Text>
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

export default profile