import { Ionicons } from '@react-native-vector-icons/ionicons/static';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { HomeScreen } from '../screens/home/HomeScreen';
import { ProfileScreen } from '../screens/profile/ProfileScreen';
import { colors } from '../theme';
import { MainTabParamList } from './types';

const Tab = createBottomTabNavigator<MainTabParamList>();

type TabIconProps = { focused: boolean; color: string; size: number };

// Defined outside the component so React sees the same function on every render.
const renderHomeIcon = ({ focused, color, size }: TabIconProps) => (
  <Ionicons
    name={focused ? 'flame' : 'flame-outline'}
    size={size}
    color={color}
  />
);

const renderProfileIcon = ({ focused, color, size }: TabIconProps) => (
  <Ionicons
    name={focused ? 'person-circle' : 'person-circle-outline'}
    size={size}
    color={color}
  />
);

export function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.amber,
        tabBarInactiveTintColor: colors.textSubtle,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{ tabBarIcon: renderHomeIcon }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ tabBarIcon: renderProfileIcon }}
      />
    </Tab.Navigator>
  );
}
