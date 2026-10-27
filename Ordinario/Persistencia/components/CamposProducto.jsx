import { StyleSheet, Text, TextInput, View } from 'react-native'
import { colores, mono } from './tema'

export const valoresVacios = { producto: '', descripcion: '', precio: '' }

export function validarProducto(v) {
  const e = {}
  if (!v.producto.trim()) e.producto = 'Escribe el nombre del producto.'
  const n = parseFloat(v.precio.replace(',', '.'))
  if (!v.precio.trim() || Number.isNaN(n) || n < 0) e.precio = 'Escribe un precio válido, por ejemplo 45.50.'
  return e
}

export function aPayload(v) {
  return {
    producto: v.producto.trim(),
    descripcion: v.descripcion.trim(),
    precio: parseFloat(v.precio.replace(',', '.')),
  }
}

export default function CamposProducto({ valores, errores = {}, onCambiar, autoFocus = false }) {
  return (
    <View style={s.grupo}>
      <Campo etiqueta="Nombre" error={errores.producto}>
        <TextInput
          value={valores.producto}
          onChangeText={(t) => onCambiar('producto', t)}
          placeholder="Ej. Café molido 500 g"
          placeholderTextColor={colores.tenue}
          autoFocus={autoFocus}
          style={[s.input, errores.producto && s.inputError]}
        />
      </Campo>

      <Campo etiqueta="Descripción">
        <TextInput
          value={valores.descripcion}
          onChangeText={(t) => onCambiar('descripcion', t)}
          placeholder="Opcional"
          placeholderTextColor={colores.tenue}
          multiline
          style={[s.input, s.multilinea]}
        />
      </Campo>

      <Campo etiqueta="Precio" error={errores.precio}>
        <View style={[s.precioFila, errores.precio && s.inputError]}>
          <Text style={s.signo}>$</Text>
          <TextInput
            value={valores.precio}
            onChangeText={(t) => onCambiar('precio', t)}
            placeholder="0.00"
            placeholderTextColor={colores.tenue}
            keyboardType="decimal-pad"
            style={s.precioInput}
          />
        </View>
      </Campo>
    </View>
  )
}

function Campo({ etiqueta, error, children }) {
  return (
    <View>
      <Text style={s.etiqueta}>{etiqueta}</Text>
      {children}
      {error ? <Text style={s.error}>{error}</Text> : null}
    </View>
  )
}

const s = StyleSheet.create({
  grupo: { gap: 16 },
  etiqueta: { fontSize: 14, fontWeight: '600', color: colores.tinta, marginBottom: 6 },
  input: {
    backgroundColor: colores.superficie,
    borderWidth: 1,
    borderColor: colores.linea,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    color: colores.tinta,
  },
  inputError: { borderColor: colores.peligro },
  multilinea: { minHeight: 88, textAlignVertical: 'top' },
  precioFila: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colores.superficie,
    borderWidth: 1,
    borderColor: colores.linea,
    borderRadius: 10,
    paddingLeft: 14,
  },
  signo: { fontFamily: mono, fontSize: 16, color: colores.tenue, marginRight: 6 },
  precioInput: { flex: 1, paddingVertical: 12, paddingRight: 14, fontFamily: mono, fontSize: 16, color: colores.tinta },
  error: { color: colores.peligro, fontSize: 13, marginTop: 6 },
})