import { Colors } from '@/constants/theme'
import { useColorScheme } from '@/hooks/use-color-scheme'
import { FontAwesome5 } from '@expo/vector-icons'
import { useState } from 'react'
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'

interface InputProps {
  label?: string
  value: string
  onChangeText: (text: string) => void
  placeholder?: string
  secureTextEntry?: boolean
  error?: string
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters'
  keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad'
}

export function Input({ 
  label, 
  value, 
  onChangeText, 
  placeholder, 
  secureTextEntry, 
  error,
  autoCapitalize = 'none',
  keyboardType = 'default'
}: InputProps) {
  const colorScheme = useColorScheme()
  const colors = Colors[colorScheme ?? 'light']
  const [isSecure, setIsSecure] = useState<boolean>(!!secureTextEntry)
  
  return (
    <View style={styles.container}>
      {label && <Text style={[styles.label, { color: colors.text }]}>{label}</Text>}
      <View style={styles.inputWrap}>
        <TextInput
          style={[
            styles.input,
            { 
              backgroundColor: colors.background,
              color: colors.text,
              borderColor: error ? '#ef4444' : colors.icon
            }
          ]}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={colors.icon}
          secureTextEntry={isSecure}
          autoCapitalize={autoCapitalize}
          keyboardType={keyboardType}
        />

        {secureTextEntry ? (
          <TouchableOpacity
            onPress={() => setIsSecure(!isSecure)}
            style={styles.iconButton}
            accessibilityLabel={isSecure ? 'Show password' : 'Hide password'}
          >
            <FontAwesome5 name={isSecure ? 'eye-slash' : 'eye'} size={16} color={colors.icon} />
          </TouchableOpacity>
        ) : null}
      </View>
      {error && <Text style={styles.error}>{error}</Text>}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    paddingRight: 44,
    fontSize: 16,
  },
  inputWrap: {
    position: 'relative',
  },
  iconButton: {
    position: 'absolute',
    right: 12,
    top: 12,
    height: 24,
    width: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  error: {
    color: '#ef4444',
    fontSize: 12,
    marginTop: 4,
  },
})