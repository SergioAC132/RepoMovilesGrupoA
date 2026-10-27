import { useEffect, useRef } from 'react'
import { Animated, StyleSheet, Text } from 'react-native'
import { colores } from './tema'

export default function Aviso({ aviso, onOcultar }) {
  const opacidad = useRef(new Animated.Value(0)).current

  useEffect(() => {
    if (!aviso) return
    opacidad.setValue(0)
    Animated.timing(opacidad, { toValue: 1, duration: 200, useNativeDriver: true }).start()
    const t = setTimeout(onOcultar, 2800)
    return () => clearTimeout(t)
  }, [aviso])

  if (!aviso) return null

  return (
    <Animated.View
      accessibilityLiveRegion="polite"
      pointerEvents="none"
      style={[s.caja, aviso.tipo === 'error' && s.error, { opacity: opacidad }]}
    >
      <Text style={s.texto}>{aviso.texto}</Text>
    </Animated.View>
  )
}

const s = StyleSheet.create({
  caja: {
    position: 'absolute',
    bottom: 24,
    left: 16,
    right: 16,
    alignSelf: 'center',
    maxWidth: 480,
    backgroundColor: colores.tinta,
    borderRadius: 12,
    padding: 14,
  },
  error: { backgroundColor: colores.peligro },
  texto: { color: '#fff', fontSize: 15 },
})