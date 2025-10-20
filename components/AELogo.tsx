import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { ACCENT_COLOR } from '../theme/colors'

export default function AELogo({ size = 64 }: { size?: number }) {
  const boxSize = size
  return (
    <View style={[styles.box, { width: boxSize, height: boxSize, borderRadius: Math.round(boxSize * 0.14) }]}> 
      <Text style={styles.text}>AE</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  box: {
    backgroundColor: ACCENT_COLOR,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
  },
  text: {
    color: '#fff',
    fontWeight: '800',
    fontSize: 28,
  },
})
