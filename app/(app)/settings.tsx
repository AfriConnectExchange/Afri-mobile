import { MFASetup } from '@/components/MFASetup'
import { Alert } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Colors } from '@/constants/theme'
import { useColorScheme } from '@/hooks/use-color-scheme'
import { storage } from '@/lib/storage'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'expo-router'
import { ChevronRight, Globe, Key, Shield, User, LogOut, Trash2, ShieldCheck, ChevronsUp, Receipt } from 'lucide-react-native'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Modal, Alert as RNAlert, ScrollView, StyleSheet, Text, TouchableOpacity, View, Image } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import * as ImagePicker from 'expo-image-picker';

export default function SettingsScreen() {
  const { t, i18n } = useTranslation()
  const router = useRouter()
  const colorScheme = useColorScheme()
  const colors = Colors[colorScheme ?? 'light']
  
  const [user, setUser] = useState<any>(null)
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [showPasswordModal, setShowPasswordModal] = useState(false)
  const [showMFAModal, setShowMFAModal] = useState(false)
  const [showLanguageModal, setShowLanguageModal] = useState(false)
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [mfaFactors, setMfaFactors] = useState<any[]>([])

  useEffect(() => {
    loadUser()
    loadMFAFactors()
  }, [])

  useEffect(() => {
    if (user?.user_metadata?.avatar_url) {
      downloadImage(user.user_metadata.avatar_url)
    }
  }, [user])

  async function downloadImage(path: string) {
    try {
      const { data, error } = await supabase.storage.from('avatars').download(path)
      if (error) {
        throw error
      }
      const fr = new FileReader()
      fr.readAsDataURL(data)
      fr.onload = () => {
        setAvatarUrl(fr.result as string)
      }
    } catch (error) {
      console.log('Error downloading image: ', error)
    }
  }

  async function pickImage() {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      alert('Sorry, we need camera roll permissions to make this work!');
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      const image = result.assets[0];
      const fileExt = image.uri.split('.').pop();
      const fileName = `${user.id}.${fileExt}`;
      const filePath = `${Date.now()}`;
      
      const response = await fetch(image.uri);
      const blob = await response.blob();

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, blob, { contentType: `image/${fileExt}`, upsert: true });

      if (uploadError) {
        console.error('Error uploading image: ', uploadError);
        RNAlert.alert("Error", "Failed to upload image.");
        return;
      }

      const { data: { publicUrl } } = supabase.storage.from('avatars').getPublicUrl(filePath)

      const { error: updateError } = await supabase.auth.updateUser({
        data: { avatar_url: filePath },
      });

      if (updateError) {
        console.error('Error updating user metadata: ', updateError);
        RNAlert.alert("Error", "Failed to update profile picture.");
        return;
      }
      setAvatarUrl(image.uri);
    }
  }

  async function loadUser() {
    const { data: { user } } = await supabase.auth.getUser()
    setUser(user)
  }

  async function loadMFAFactors() {
    const { data } = await supabase.auth.mfa.listFactors()
    setMfaFactors(data?.totp || [])
  }

  async function handleChangePassword() {
    setError('')
    setSuccess('')
    
    if (newPassword !== confirmPassword) {
      setError(t('settings.passwordsDoNotMatch'))
      return
    }

    if (newPassword.length < 6) {
      setError(t('settings.passwordTooShort'))
      return
    }

    setLoading(true)

    const { error: updateError } = await supabase.auth.updateUser({
      password: newPassword
    })

    if (updateError) {
      setError(updateError.message)
    } else {
      setSuccess(t('settings.passwordUpdated'))
      setNewPassword('')
      setConfirmPassword('')
      setTimeout(() => {
        setShowPasswordModal(false)
        setSuccess('')
      }, 2000)
    }

    setLoading(false)
  }

  async function handleChangeLanguage(lang: string) {
    await storage.setLanguage(lang)
    i18n.changeLanguage(lang)
    setShowLanguageModal(false)
  }

  async function handleLogout() {
    RNAlert.alert(
      t('auth.logout'),
      t('auth.logoutConfirm'),
      [
        { text: t('storage.cancel'), style: 'cancel' },
        {
          text: t('auth.logout'),
          style: 'destructive',
          onPress: async () => {
            await supabase.auth.signOut()
            router.replace('/(auth)/login')
          },
        },
      ]
    )
  }

  function handleDeleteAccount() {
    RNAlert.alert(
      "Delete Account",
      "Are you sure you want to delete your account? This action is irreversible.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            // Add account deletion logic here
            RNAlert.alert("Account Deleted", "Your account has been deleted.")
          },
        },
      ]
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.profileContainer}>
          <TouchableOpacity onPress={pickImage}>
            <Image 
              source={{ uri: avatarUrl || 'https://www.gravatar.com/avatar/?d=mp'}} 
              style={styles.avatar} 
            />
          </TouchableOpacity>
          <Text style={[styles.userName, { color: colors.text }]}>
            {user?.user_metadata?.full_name || 'Bisi Williams'}
          </Text>
          <Text style={[styles.userType, { color: colors.icon }]}>
            (Customer)
          </Text>
        </View>
        
        <View style={styles.menuContainer}>
          <TouchableOpacity style={styles.menuItem} onPress={() => {}}>
            <Receipt size={20} color={colors.icon} />
            <Text style={[styles.menuItemText, { color: colors.text }]}>Receipts</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem} onPress={() => {}}>
            <ChevronsUp size={20} color={colors.icon} />
            <Text style={[styles.menuItemText, { color: colors.text }]}>Upgrade Profile</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem} onPress={() => {}}>
            <ShieldCheck size={20} color={colors.icon} />
            <Text style={[styles.menuItemText, { color: colors.text }]}>Verify Identity</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem} onPress={handleDeleteAccount}>
            <Trash2 size={20} color={colors.icon} />
            <Text style={[styles.menuItemText, { color: colors.text }]}>Delete Account</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem} onPress={handleLogout}>
            <LogOut size={20} color={colors.icon} />
            <Text style={[styles.menuItemText, { color: colors.text }]}>Log out</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  profileContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 16,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  userType: {
    fontSize: 16,
  },
  menuContainer: {
    // No specific styles needed here for now
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    gap: 16,
  },
  menuItemText: {
    fontSize: 16,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  section: {
    gap: 12,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  label: {
    fontSize: 14,
  },
  value: {
    fontSize: 14,
    fontWeight: '500',
    flex: 1,
    textAlign: 'right',
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  settingText: {
    fontSize: 16,
    fontWeight: '500',
  },
  settingSubtext: {
    fontSize: 12,
    marginTop: 2,
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
  languageText: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
})
