import { Colors } from '@/constants/theme'
import { useColorScheme } from '@/hooks/use-color-scheme'
import { supabase } from '@/lib/supabase'
import { Tabs, useRouter } from 'expo-router'
import { Bell, Heart, Home, Menu, PlusCircle, User } from 'lucide-react-native'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Text, TouchableOpacity, View } from 'react-native'

export default function AppLayout() {
  const colorScheme = useColorScheme()
  const colors = Colors[colorScheme ?? 'light']
  const { t } = useTranslation()
  const router = useRouter()

  // local state for smart Sell behaviour and notification count
  const [kycStatus, setKycStatus] = useState<string | null>(null)
  const [unreadNotifications, setUnreadNotifications] = useState<number>(0)

  useEffect(() => {
    let mounted = true

    async function loadUser() {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser()

        if (!mounted) return

        if (user && user.user_metadata && (user.user_metadata as any).kyc_status) {
          setKycStatus((user.user_metadata as any).kyc_status)
        } else {
          setKycStatus(null)
        }

        // Attempt to fetch unread notifications count from 'notifications' table if available
        // If the table doesn't exist or request fails, we'll silently ignore and keep 0.
        try {
          const { data, error } = await (supabase as any)
            .from('notifications')
            .select('id')
            .eq('is_read', false)
            .limit(1000) // cap

          if (!error && data) {
            setUnreadNotifications(data.length)
          }
        } catch {
          // ignore
        }
      } catch {
        // ignore on client-side auth failures
      }
    }

    loadUser()

    return () => {
      mounted = false
    }
  }, [])

  // Handler for the central Sell button
  const onPressSell = () => {
    if (kycStatus === 'verified') {
      router.push(('/(app)/create-listing') as any)
    } else {
      router.push(('/(app)/auth/register?become_seller=1') as any)
    }
  }

  // Custom center button component
  const CenterSellButton = () => (
    <TouchableOpacity
      onPress={onPressSell}
      activeOpacity={0.8}
      style={{
        width: 64,
        height: 64,
        borderRadius: 32,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20,
        backgroundColor: colors.tint,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
      }}>
      <PlusCircle size={28} color="#fff" />
    </TouchableOpacity>
  )

  // small badge for notifications
  const NotificationIconWithBadge = ({ color, size }: { color: string; size: number }) => (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      <Bell size={size} color={color} />
      {unreadNotifications > 0 && (
        <View
          style={{
            position: 'absolute',
            right: -6,
            top: -3,
            backgroundColor: '#ff3b30',
            borderRadius: 8,
            minWidth: 16,
            paddingHorizontal: 4,
            height: 16,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Text style={{ color: '#fff', fontSize: 10, fontWeight: '600' }}>{unreadNotifications}</Text>
        </View>
      )}
    </View>
  )

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

      {/* Center Sell - use an empty route target; screen exists to keep tab order but we'll render a custom button */}
      <Tabs.Screen
        name="sell"
        options={{
          title: 'Sell',
          tabBarIcon: () => <CenterSellButton />, // render center button in tab bar
          tabBarButton: () => (
            // render a custom touchable that uses our onPressSell handler
            <View style={{ alignItems: 'center', justifyContent: 'center' }}>{<CenterSellButton />}</View>
          ),
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