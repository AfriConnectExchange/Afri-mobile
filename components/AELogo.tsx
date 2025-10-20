import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { ACCENT_COLOR } from '../theme/colors'

export default function AELogo({ size = 56 }: { size?: number }) {
  const boxSize = size
  return (
    <View
      style={[
        styles.box,
        {
          width: boxSize,
          height: boxSize,
          borderRadius: Math.round(boxSize * 0.22), // increased radius for a softer rounded look
        },
      ]}>
      <Text style={[styles.text, { fontSize: Math.round(boxSize * 0.45) }]}>AE</Text>
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
