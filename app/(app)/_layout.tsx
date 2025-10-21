import { Colors } from '@/constants/theme'
import { useColorScheme } from '@/hooks/use-color-scheme'
import { Tabs } from 'expo-router'
import { Heart, Home, Menu, User } from 'lucide-react-native'
import { useTranslation } from 'react-i18next'

export default function AppLayout() {
  const colorScheme = useColorScheme()
  const colors = Colors[colorScheme ?? 'light']
  const { t } = useTranslation()

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.tint,
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.background,
          height: 64,
          paddingBottom: 8,
        },
      }}>
      {/* Discover/Home */}
      <Tabs.Screen
        name="index"
        options={{
          title: t('app.home') || 'Discover',
          tabBarIcon: ({ color, size }) => <Home size={size} color={color} />,
        }}
      />

      {/* Account (moved to be second) */}
      <Tabs.Screen
        name="settings"
        options={{
          title: t('app.settings') || 'Account',
          tabBarIcon: ({ color, size }) => <User size={size} color={color} />,
        }}
      />

      {/* Saved/Wishlist */}
      <Tabs.Screen
        name="storage"
        options={{
          title: t('app.storage') || 'Saved',
          tabBarIcon: ({ color, size }) => <Heart size={size} color={color} />,
        }}
      />

      {/* Menu (formerly messaging) */}
      <Tabs.Screen
        name="messaging"
        options={{
          title: t('Menu') || 'Menu',
          tabBarIcon: ({ color, size }) => <Menu size={size} color={color} />,
        }}
      />
    </Tabs>
  )
}
