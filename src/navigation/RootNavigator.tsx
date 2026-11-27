import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useCallback, useState } from 'react';

import { useAuth } from '../context/AuthContext';
import { LoginScreen } from '../screens/LoginScreen';
import { OnboardingScreen } from '../screens/onboarding/OnboardingScreen';
import { SplashScreen } from '../screens/SplashScreen';
import { colors } from '../theme';
import { MainTabs } from './MainTabs';
import { RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

// Screens are chosen from state instead of calling navigate(). When the user logs
// in or out, the old screens are removed from the stack, so Back can't return to them.
export function RootNavigator() {
  const { status, hasOnboarded } = useAuth();
  const [isSplashAnimationDone, setIsSplashAnimationDone] = useState(false);

  // Stable identity, so the splash animation effect doesn't restart on re-render.
  const handleSplashFinish = useCallback(
    () => setIsSplashAnimationDone(true),
    [],
  );

  // Keep the splash up until both the animation has played and the saved session is read.
  const showSplash = !isSplashAnimationDone || status === 'restoring';

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'fade',
        contentStyle: { backgroundColor: colors.night },
      }}
    >
      {showSplash ? (
        <Stack.Screen name="Splash">
          {() => <SplashScreen onFinish={handleSplashFinish} />}
        </Stack.Screen>
      ) : status === 'signedIn' ? (
        <Stack.Screen name="Main" component={MainTabs} />
      ) : (
        <>
          {hasOnboarded ? null : (
            <Stack.Screen name="Onboarding" component={OnboardingScreen} />
          )}
          <Stack.Screen name="Login" component={LoginScreen} />
        </>
      )}
    </Stack.Navigator>
  );
}
