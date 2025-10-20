import '@/lib/i18n'
import { supabase } from '@/lib/supabase'
import { useFonts } from 'expo-font'
import * as Linking from 'expo-linking'
import { Stack, useRouter } from 'expo-router'
import * as SplashScreen from 'expo-splash-screen'
import { StatusBar } from 'expo-status-bar'
import { useEffect } from 'react'
import { Text, TextInput } from 'react-native'

// Keep splash visible while we load fonts
SplashScreen.preventAutoHideAsync()

export default function RootLayout() {
  const router = useRouter()

  const [fontsLoaded] = useFonts({
    'PlusJakartaSans-Regular': require('../assets/font/static/PlusJakartaSans-Regular.ttf'),
    'PlusJakartaSans-Medium': require('../assets/font/static/PlusJakartaSans-Medium.ttf'),
    'PlusJakartaSans-SemiBold': require('../assets/font/static/PlusJakartaSans-SemiBold.ttf'),
    'PlusJakartaSans-Bold': require('../assets/font/static/PlusJakartaSans-Bold.ttf'),
  })

  useEffect(() => {
    if (fontsLoaded) {
      // Apply global default font for Text and TextInput (safe, best-effort)
      try {
        if (Text && Object.prototype.hasOwnProperty.call(Text, 'defaultProps')) {
          ;(Text as any).defaultProps = {
            ...(Text as any).defaultProps || {},
            style: { ...(Text as any).defaultProps?.style || {}, fontFamily: 'PlusJakartaSans-Regular' }
          }
        }

        if (TextInput && Object.prototype.hasOwnProperty.call(TextInput, 'defaultProps')) {
          ;(TextInput as any).defaultProps = {
            ...(TextInput as any).defaultProps || {},
            style: { ...(TextInput as any).defaultProps?.style || {}, fontFamily: 'PlusJakartaSans-Regular' }
          }
        }
      } catch {
        // Ignore if environment prevents overriding defaults
      }

      SplashScreen.hideAsync()
    }
  }, [fontsLoaded])

  useEffect(() => {
    const handleDeepLink = async (event: { url: string }) => {
      const url = event.url
      
      if (url && url.includes('reset-password')) {
        const hashIndex = url.indexOf('#')
        if (hashIndex !== -1) {
          const hashFragment = url.substring(hashIndex + 1)
          const params = new URLSearchParams(hashFragment)
          
          const accessToken = params.get('access_token')
          const refreshToken = params.get('refresh_token')
          const type = params.get('type')
          
          
          if (accessToken && refreshToken && type === 'recovery') {
            const { data, error } = await supabase.auth.setSession({
              access_token: accessToken,
              refresh_token: refreshToken,
            })
            
            
            if (!error && data.session) {
              router.replace('/(auth)/reset-password')
            } 
          }
        }
      }
    }

    const subscription = Linking.addEventListener('url', handleDeepLink)

    Linking.getInitialURL().then((url) => {
      if (url) {
        handleDeepLink({ url })
      }
    })

    return () => {
      subscription.remove()
    }
  }, [router])

  return (
    <>
      {fontsLoaded ? (
        <>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="index" />
            <Stack.Screen name="(auth)" />
            <Stack.Screen name="(app)" />
          </Stack>
          <StatusBar style="auto" />
        </>
      ) : null}
    </>
  )
}