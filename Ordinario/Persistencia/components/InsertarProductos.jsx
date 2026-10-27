import { useState } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { supabase } from '../lib/supabaseClient'
import CamposProducto, { valoresVacios, validarProducto, aPayload } from './CamposProducto'
import { Boton, colores, mensajeError } from './tema'

export default function InsertarProductos({ onCreado, onAviso }) {
  const [abierto, setAbierto] = useState(false)
  const [valores, setValores] = useState(valoresVacios)
  const [errores, setErrores] = useState({})
  const [guardando, setGuardando] = useState(false)

  const cerrar = () => {
    setAbierto(false)
    setValores(valoresVacios)
    setErrores({})
  }

  const cambiar = (campo, texto) => {
    setValores((v) => ({ ...v, [campo]: texto }))
    setErrores((e) => ({ ...e, [campo]: undefined }))
  }

  const agregar = async () => {
    const e = validarProducto(valores)
    setErrores(e)
    if (Object.keys(e).length) return

    setGuardando(true)
    const { data, error } = await supabase.from('productos').insert([aPayload(valores)]).select()
    setGuardando(false)

    if (error) {
      console.error('Error al insertar:', error.message)
      onAviso?.(mensajeError(error.message), 'error')
      return
    }

    cerrar()
    onAviso?.(`Producto agregado: ${data[0].producto}`)
    onCreado?.(data[0])
  }

  if (!abierto) {
    return (
      <View style={s.barra}>
        <Boton titulo="+ Nuevo producto" onPress={() => setAbierto(true)} style={s.completo} />
      </View>
    )
  }

  return (
    <View style={s.panel}>
      <Text style={s.titulo}>Nuevo producto</Text>
      <CamposProducto valores={valores} errores={errores} onCambiar={cambiar} autoFocus />
      <View style={s.acciones}>
        <Boton titulo="Cancelar" variante="secundario" onPress={cerrar} style={s.mitad} />
        <Boton
          titulo={guardando ? 'Agregando…' : 'Agregar producto'}
          onPress={agregar}
          disabled={guardando}
          style={s.mitad}
        />
      </View>
    </View>
  )
}

const s = StyleSheet.create({
  barra: { paddingHorizontal: 16, paddingBottom: 8 },
  completo: { alignSelf: 'stretch' },
  panel: {
    marginHorizontal: 16,
    marginBottom: 8,
    padding: 20,
    gap: 18,
    backgroundColor: colores.superficie,
    borderWidth: 1,
    borderColor: colores.linea,
    borderRadius: 14,
  },
  titulo: { fontSize: 20, fontWeight: '700', color: colores.tinta },
  acciones: { flexDirection: 'row', gap: 10 },
  mitad: { flex: 1 },
})