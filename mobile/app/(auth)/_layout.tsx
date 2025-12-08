import PushNotificationManager from '@/components/PushNotificationManager';
import SafeScreen from '@/components/SafeScreen';
import { Redirect, Stack } from 'expo-router'

export default function AuthRoutesLayout() {
  
  // const isSignedIn = false
  // if (isSignedIn) {
  //   return <Redirect href={'/feed'} />
  // }
  return (
    <PushNotificationManager>
      <SafeScreen>
        <Stack screenOptions={{ headerShown: false }}/>
      </SafeScreen>
    </PushNotificationManager>
  );
}