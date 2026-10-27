import { useState } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import InsertarProductos from './components/InsertarProductos'
import ListaProductos from './components/LeerProductos'
import Aviso from './components/Aviso'
import { colores } from './components/tema'

export default function App() {
  const [version, setVersion] = useState(0)
  const [aviso, setAviso] = useState(null)

  const avisar = (texto, tipo = 'ok') => setAviso({ texto, tipo, id: Date.now() })

  return (
    <View style={s.raiz}>
      <View style={s.marco}>
        <View style={s.encabezado}>
          <Text style={s.titulo}>Catálogo</Text>
          <Text style={s.subtitulo}>Productos y precios de tu tienda</Text>
        </View>

        <InsertarProductos onCreado={() => setVersion((v) => v + 1)} onAviso={avisar} />

        <View style={s.lista}>
          <ListaProductos refrescar={version} onAviso={avisar} />
        </View>

        <Aviso aviso={aviso} onOcultar={() => setAviso(null)} />
      </View>
    </View>
  )
}

const s = StyleSheet.create({
  raiz: { flex: 1, backgroundColor: colores.papel },
  marco: { flex: 1, width: '100%', maxWidth: 960, alignSelf: 'center' },
  encabezado: { paddingHorizontal: 20, paddingTop: 56, paddingBottom: 12 },
  titulo: { fontSize: 32, fontWeight: '700', color: colores.tinta, letterSpacing: -0.5 },
  subtitulo: { fontSize: 15, color: colores.tenue, marginTop: 4 },
  lista: { flex: 1, paddingTop: 8 },
})