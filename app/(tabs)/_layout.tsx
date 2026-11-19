import { Feather } from '@expo/vector-icons';
import { Tabs } from 'expo-router';

import { uk } from '@/constants/uk';
import { useTheme } from '@/hooks/useTheme';

export default function TabLayout() {
  const { colors } = useTheme();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: true,
        tabBarActiveTintColor: colors.accent,
        tabBarInactiveTintColor: colors.muted,
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
          letterSpacing: 0.3,
        },
        tabBarStyle: {
          backgroundColor: colors.bg,
          borderTopColor: colors.border,
          borderTopWidth: 1,
        },
        sceneStyle: {
          backgroundColor: colors.bg,
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: uk.tabs.inbox,
          tabBarIcon: ({ color, size }) => (
            <Feather name="inbox" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="board"
        options={{
          title: uk.tabs.board,
          tabBarIcon: ({ color, size }) => (
            <Feather name="check-square" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
