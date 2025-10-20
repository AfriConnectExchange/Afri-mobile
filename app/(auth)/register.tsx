import AELogo from '@/components/AELogo'
import { Alert } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Colors } from '@/constants/theme'
import { useColorScheme } from '@/hooks/use-color-scheme'
import { storage } from '@/lib/storage'
import { supabase } from '@/lib/supabase'
import { FontAwesome5 } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import * as WebBrowser from 'expo-web-browser'
import { Globe } from 'lucide-react-native'
// Render official Google SVG using react-native-svg's SvgXml
// Make sure to install: npx expo install react-native-svg
import { googleSvg } from '@/assets/googleLogo'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Linking, Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { SvgXml } from 'react-native-svg'

export default function RegisterScreen() {
  const { t, i18n } = useTranslation()
  const router = useRouter()
  const colorScheme = useColorScheme()
  const colors = Colors[colorScheme ?? 'light']
  
  const [email, setEmail] = useState('')
  const [fullName, setFullName] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [acceptedTerms, setAcceptedTerms] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showLanguageModal, setShowLanguageModal] = useState(false)

  async function handleRegister() {
    setError('')
    if (!fullName.trim()) {
      setError(t('auth.fullNameRequired'))
      return
    }
    
    if (!acceptedTerms) {
      setError(t('auth.mustAcceptTerms'))
      return
    }

    if (password !== confirmPassword) {
      setError(t('auth.passwordsDoNotMatch'))
      return
    }
    
    setLoading(true)
    
    const { error: signUpError } = await supabase.auth.signUp({
      email,
      password,
    })
    
    if (signUpError) {
      setError(signUpError.message)
    } else {
      router.replace('/(auth)/verify-email')
    }
    
    setLoading(false)
  }

  async function handleChangeLanguage(lang: string) {
    await storage.setLanguage(lang)
    i18n.changeLanguage(lang)
    setShowLanguageModal(false)
  }

  const getLanguageDisplay = () => {
    switch (i18n.language) {
      case 'pl': return 'Polski'
      case 'zh': return '中文'
      default: return 'English'
    }
  }

  async function handleSocialSignIn(provider: 'google' | 'facebook') {
    try {
      setError('')
      setLoading(true)
      const { error: oauthError } = await supabase.auth.signInWithOAuth({ provider })
      if (oauthError) setError(oauthError.message)
    } catch (err: any) {
      setError(err?.message ?? 'Social sign-in failed')
    } finally {
      setLoading(false)
    }
  }

  const openLink = async (url: string) => {
    try {
      await WebBrowser.openBrowserAsync(url)
    } catch {
      // Fallback to Linking if WebBrowser fails
      Linking.openURL(url)
    }
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Language selector in top-right */}
      <TouchableOpacity 
        style={styles.topHint}
        onPress={() => setShowLanguageModal(true)}
      >
        <Globe size={14} color={colors.icon} />
        <Text style={[styles.hintText, { color: colors.icon }]}>
          {getLanguageDisplay()}
        </Text>
      </TouchableOpacity>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.logoHeaderRow}>
          <AELogo size={48} />
          <View style={styles.appTitleWrap}>
            <Text style={[styles.appTitle, { color: colors.text }]}>{t('app.name')}</Text>
            <Text style={[styles.title, { color: colors.text }]}>{t('auth.createAccount')}</Text>
          </View>
        </View>

        {error && <Alert variant="error" message={error} />}

        <Input
          label={t('auth.fullName')}
          value={fullName}
          onChangeText={setFullName}
          placeholder={t('auth.fullName')}
        />

        <Input
          label={t('auth.email')}
          value={email}
          onChangeText={setEmail}
          placeholder={t('auth.email')}
          keyboardType="email-address"
        />

        <Input
          label={t('auth.password')}
          value={password}
          onChangeText={setPassword}
          placeholder={t('auth.password')}
          secureTextEntry
        />

        <Input
          label={t('auth.confirmPassword')}
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          placeholder={t('auth.confirmPassword')}
          secureTextEntry
        />

        {/* Terms and Privacy Checkbox */}
        <TouchableOpacity
          style={styles.checkboxContainer}
          onPress={() => setAcceptedTerms(!acceptedTerms)}
        >
          <View style={[
            styles.checkbox,
            acceptedTerms && { backgroundColor: colors.tint, borderColor: colors.tint }
          ]}>
            {acceptedTerms && <FontAwesome5 name="check" size={14} color="#fff" />}
          </View>
          <Text style={[styles.termsText, { color: colors.text }]}>
            {t('auth.iAgreeToThe')}{' '}
            <Text 
              style={[styles.link, { color: colors.tint }]}
              onPress={(e) => {
                e.stopPropagation()
                openLink('https://basicsass.razikus.com/legal/terms')
              }}
            >
              {t('auth.termsOfService')}
            </Text>
            {' '}{t('auth.and')}{' '}
            <Text 
              style={[styles.link, { color: colors.tint }]}
              onPress={(e) => {
                e.stopPropagation()
                openLink('https://basicsass.razikus.com/legal/privacy')
              }}
            >
              {t('auth.privacyPolicy')}
            </Text>
          </Text>
        </TouchableOpacity>

        <View style={styles.buttonContainer}>
          <Button
            title={t('auth.signUp')}
            onPress={handleRegister}
            loading={loading}
            disabled={!acceptedTerms}
          />
        </View>

        {/* Social sign-in */}
        <Text style={[styles.orText, { color: colors.icon }]}>{t('auth.orSignInWith')}</Text>
        <View style={styles.socialRowCompact}>
          <TouchableOpacity
            style={[styles.socialBox, { backgroundColor: 'rgba(0,0,0,0.06)', borderColor: 'rgba(0,0,0,0.08)' }]}
            onPress={() => handleSocialSignIn('google')}
            accessibilityLabel={t('auth.signInWithGoogle')}
            disabled={loading}
          >
            <SvgXml xml={googleSvg} width={18} height={18} />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.socialBox, { backgroundColor: 'rgba(0,0,0,0.06)', borderColor: 'rgba(0,0,0,0.08)' }]}
            onPress={() => handleSocialSignIn('facebook')}
            accessibilityLabel={t('auth.signInWithFacebook')}
            disabled={loading}
          >
            <FontAwesome5 name="facebook" size={18} color="#1877F2" />
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Text style={{ color: colors.text }}>
            {t('auth.alreadyHaveAccount')}{' '}
          </Text>
          <TouchableOpacity onPress={() => router.push('/(auth)/login')}>
            <Text style={[styles.link, { color: colors.tint }]}>
              {t('auth.signIn')}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Language Modal */}
      <Modal
        visible={showLanguageModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowLanguageModal(false)}
      >
        <SafeAreaView style={[styles.modalContainer, { backgroundColor: colors.background }]}>
          <View style={styles.modalHeader}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>
              {t('settings.language')}
            </Text>
            <TouchableOpacity onPress={() => setShowLanguageModal(false)}>
              <Text style={{ color: colors.tint }}>
                {t('settings.close')}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.modalContent}>
            <TouchableOpacity
              style={[
                styles.languageOption,
                i18n.language === 'en' && { backgroundColor: colors.tint }
              ]}
              onPress={() => handleChangeLanguage('en')}
            >
              <Text style={[
                styles.languageOptionText,
                { color: i18n.language === 'en' ? '#fff' : colors.text }
              ]}>
                {t('settings.languages.english')}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.languageOption,
                i18n.language === 'pl' && { backgroundColor: colors.tint }
              ]}
              onPress={() => handleChangeLanguage('pl')}
            >
              <Text style={[
                styles.languageOptionText,
                { color: i18n.language === 'pl' ? '#fff' : colors.text }
              ]}>
                {t('settings.languages.polish')}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.languageOption,
                i18n.language === 'zh' && { backgroundColor: colors.tint }
              ]}
              onPress={() => handleChangeLanguage('zh')}
            >
              <Text style={[
                styles.languageOptionText,
                { color: i18n.language === 'zh' ? '#fff' : colors.text }
              ]}>
                {t('settings.languages.chinese')}
              </Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topHint: {
    position: 'absolute',
    top: 60,
    right: 24,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    zIndex: 10,
  },
  hintText: {
    fontSize: 12,
    fontWeight: '500',
  },
  content: {
    padding: 24,
    paddingTop: 40,
  },
  header: {
    marginBottom: 32,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  logoHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: 16,
    marginBottom: 24,
  },
  appTitleWrap: {
    flexDirection: 'column',
    justifyContent: 'center',
  },
  appTitle: {
    fontSize: 14,
    fontWeight: '700',
    opacity: 0.9,
  },
  logoRow: {
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 8,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    marginTop: 8,
    marginBottom: 8,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderColor: '#d1d5db',
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 2,
  },
  termsText: {
    fontSize: 14,
    flex: 1,
    lineHeight: 20,
  },
  link: {
    fontSize: 14,
    fontWeight: '600',
  },
  buttonContainer: {
    marginTop: 24,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
  },
  modalContainer: {
    flex: 1,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  modalContent: {
    padding: 16,
  },
  languageOption: {
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    marginBottom: 12,
  },
  languageOptionText: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  socialRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    marginTop: 16,
  },
  socialRowCompact: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
    marginTop: 12,
  },
  socialBox: {
    width: 44,
    height: 44,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    marginHorizontal: 6,
  },
  orText: {
    fontSize: 12,
    textAlign: 'center',
    marginTop: 12,
  },
  socialButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
  },
  socialText: {
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
  },
})