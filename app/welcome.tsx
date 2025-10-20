import AELogo from '@/components/AELogo'
import { useRouter } from 'expo-router'
import React from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { ACCENT_COLOR } from '../theme/colors'

// Single consolidated WelcomeScreen component
export default function WelcomeScreen() {
  const router = useRouter()

  // Use a plain View as a safe fallback background so bundling doesn't fail
  // if `assets/images/welcome-bg.jpg` is not present. To use an ImageBackground
  // with a local file again, add the image at that path and replace the root
  // <View> below with the original <ImageBackground source={require('../../assets/images/welcome-bg.jpg')}> ...
  return (
    <View style={[styles.bg, { backgroundColor: '#F6EAEF' }]}> 
      <View style={styles.overlay} />

      <View style={styles.content}>
        <View style={styles.topRow}>
          <AELogo size={56} />
        </View>

        <View style={styles.center}>
          <Text style={styles.title}>Welcome to AfriConnect</Text>
          <Text style={styles.subtitle}>Buy, sell and connect with your community</Text>
        </View>

        <View style={styles.actions}>
          <TouchableOpacity style={styles.primary} onPress={() => router.push('/(auth)/login')}>
            <Text style={styles.primaryText}>Log in</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.ghost} onPress={() => router.push('/(auth)/register')}>
            <Text style={styles.ghostText}>Sign up</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  bg: { flex: 1, width: '100%', height: '100%' },
  overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.25)' },
  content: { flex: 1, padding: 24, justifyContent: 'space-between' },
  topRow: { marginTop: 48 },
  center: { alignItems: 'center', marginTop: 40 },
  title: { color: '#fff', fontSize: 32, fontWeight: '800', textAlign: 'center', marginBottom: 8 },
  subtitle: { color: '#fff', fontSize: 16, textAlign: 'center', opacity: 0.9 },
  actions: { marginBottom: 48 },
  primary: { backgroundColor: ACCENT_COLOR, paddingVertical: 14, borderRadius: 12, alignItems: 'center', marginBottom: 12 },
  primaryText: { color: '#fff', fontWeight: '700', fontSize: 16 },
  ghost: { backgroundColor: 'rgba(255,255,255,0.9)', paddingVertical: 12, borderRadius: 12, alignItems: 'center' },
  ghostText: { color: '#333', fontWeight: '700' },
})
