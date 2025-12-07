import { Redirect, Stack } from 'expo-router'

export default function AuthRoutesLayout() {
  // const { isSignedIn } = useAuth()
  const isSignedIn = true
  if (isSignedIn) {
    return <Redirect href={'/feed'} />
  }
  return <Stack screenOptions={{ headerShown: false }}/>
}