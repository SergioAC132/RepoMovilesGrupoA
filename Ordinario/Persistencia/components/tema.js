import { Platform, StyleSheet, Text, TouchableOpacity } from 'react-native'

export const colores = {
  papel: '#F5F1E8',
  superficie: '#FFFDF8',
  tinta: '#1C1A17',
  tenue: '#7A7368',
  linea: '#DDD6C8',
  etiqueta: '#1F5C4A',
  peligro: '#B3261E',
}

export const mono = Platform.select({ ios: 'Menlo', android: 'monospace', default: 'monospace' })

export const precio = (n) =>
  '$' + Number(n).toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

export function mensajeError(msg = '') {
  if (msg.includes('row-level security'))
    return 'Supabase bloqueó la operación. Revisa las políticas RLS de la tabla productos.'
  if (msg.includes('Invalid API key'))
    return 'La clave de Supabase no es válida. Revisa EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY en tu .env.'
  if (msg.includes('Network request failed') || msg.includes('Failed to fetch'))
    return 'Sin conexión con Supabase. Revisa la URL en tu .env y reinicia con npx expo start -c.'
  return msg
}

const variantes = {
  primario: { fondo: { backgroundColor: colores.etiqueta }, texto: { color: '#fff' } },
  peligro: { fondo: { backgroundColor: colores.peligro }, texto: { color: '#fff' } },
  secundario: {
    fondo: { backgroundColor: 'transparent', borderWidth: 1, borderColor: colores.linea },
    texto: { color: colores.tinta },
  },
  texto: { fondo: { backgroundColor: 'transparent' }, texto: { color: colores.etiqueta } },
  textoPeligro: { fondo: { backgroundColor: 'transparent' }, texto: { color: colores.peligro } },
}

export function Boton({ titulo, onPress, variante = 'primario', disabled, style }) {
  const v = variantes[variante]
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.8}
      accessibilityRole="button"
      style={[s.base, v.fondo, disabled && s.deshabilitado, style]}
    >
      <Text style={[s.texto, v.texto]}>{titulo}</Text>
    </TouchableOpacity>
  )
}

const s = StyleSheet.create({
  base: {
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  deshabilitado: { opacity: 0.5 },
  texto: { fontWeight: '600', fontSize: 15 },
})