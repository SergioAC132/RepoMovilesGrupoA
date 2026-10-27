import { useEffect, useState } from 'react'
import { KeyboardAvoidingView, Modal, Platform, Pressable, StyleSheet, Text, View } from 'react-native'
import { supabase } from '../lib/supabaseClient'
import CamposProducto, { validarProducto, aPayload } from './CamposProducto'
import { Boton, colores, mensajeError } from './tema'

export default function EditarProducto({ producto, onCerrar, onActualizado, onAviso }) {
  const [valores, setValores] = useState(null)
  const [errores, setErrores] = useState({})
  const [guardando, setGuardando] = useState(false)

  useEffect(() => {
    if (producto) {
      setValores({
        producto: producto.producto ?? '',
        descripcion: producto.descripcion ?? '',
        precio: String(producto.precio ?? ''),
      })
      setErrores({})
    }
  }, [producto])

  const cambiar = (campo, texto) => {
    setValores((v) => ({ ...v, [campo]: texto }))
    setErrores((e) => ({ ...e, [campo]: undefined }))
  }

  const guardar = async () => {
    const e = validarProducto(valores)
    setErrores(e)
    if (Object.keys(e).length) return

    setGuardando(true)
    const { data, error } = await supabase
      .from('productos')
      .update(aPayload(valores))
      .eq('id', producto.id)
      .select()
    setGuardando(false)

    if (error) {
      console.error('Error al actualizar:', error.message)
      onAviso?.(mensajeError(error.message), 'error')
      return
    }

    onActualizado?.(data[0])
    onAviso?.('Cambios guardados')
    onCerrar()
  }

  return (
    <Modal visible={!!producto} animationType="slide" transparent onRequestClose={onCerrar}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={s.fondo}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onCerrar} />
        <View style={s.hoja}>
          <Text style={s.titulo}>Editar producto</Text>
          {valores && <CamposProducto valores={valores} errores={errores} onCambiar={cambiar} />}
          <View style={s.acciones}>
            <Boton titulo="Cancelar" variante="secundario" onPress={onCerrar} style={s.mitad} />
            <Boton
              titulo={guardando ? 'Guardando…' : 'Guardar cambios'}
              onPress={guardar}
              disabled={guardando}
              style={s.mitad}
            />
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  )
}

const s = StyleSheet.create({
  fondo: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(28,26,23,0.4)' },
  hoja: {
    width: '100%',
    maxWidth: 560,
    alignSelf: 'center',
    backgroundColor: colores.superficie,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 24,
    paddingBottom: 36,
    gap: 20,
  },
  titulo: { fontSize: 20, fontWeight: '700', color: colores.tinta },
  acciones: { flexDirection: 'row', gap: 10 },
  mitad: { flex: 1 },
})