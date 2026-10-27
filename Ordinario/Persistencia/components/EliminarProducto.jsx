import { useState } from 'react'
import { Modal, StyleSheet, Text, View } from 'react-native'
import { supabase } from '../lib/supabaseClient'
import { Boton, colores, mensajeError } from './tema'

export default function EliminarProducto({ producto, onCerrar, onEliminado, onAviso }) {
  const [borrando, setBorrando] = useState(false)

  const eliminar = async () => {
    setBorrando(true)
    const { error } = await supabase.from('productos').delete().eq('id', producto.id)
    setBorrando(false)

    if (error) {
      console.error('Error al eliminar:', error.message)
      onAviso?.(mensajeError(error.message), 'error')
      return
    }

    onEliminado?.(producto.id)
    onAviso?.(`Producto eliminado: ${producto.producto}`)
    onCerrar()
  }

  return (
    <Modal visible={!!producto} transparent animationType="fade" onRequestClose={onCerrar}>
      <View style={s.fondo}>
        <View style={s.caja}>
          <Text style={s.titulo}>¿Eliminar este producto?</Text>
          <Text style={s.texto}>
            «{producto?.producto}» se borrará del catálogo. Esta acción no se puede deshacer.
          </Text>
          <View style={s.acciones}>
            <Boton titulo="Cancelar" variante="secundario" onPress={onCerrar} disabled={borrando} style={s.mitad} />
            <Boton
              titulo={borrando ? 'Eliminando…' : 'Eliminar'}
              variante="peligro"
              onPress={eliminar}
              disabled={borrando}
              style={s.mitad}
            />
          </View>
        </View>
      </View>
    </Modal>
  )
}

const s = StyleSheet.create({
  fondo: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: 'rgba(28,26,23,0.4)',
  },
  caja: {
    width: '100%',
    maxWidth: 420,
    alignSelf: 'center',
    backgroundColor: colores.superficie,
    borderRadius: 16,
    padding: 24,
    gap: 12,
  },
  titulo: { fontSize: 19, fontWeight: '700', color: colores.tinta },
  texto: { fontSize: 15, color: colores.tenue, lineHeight: 22, marginBottom: 8 },
  acciones: { flexDirection: 'row', gap: 10 },
  mitad: { flex: 1 },
})