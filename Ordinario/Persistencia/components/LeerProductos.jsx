import { useCallback, useEffect, useState } from 'react'
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native'
import { supabase } from '../lib/supabaseClient'
import EditarProducto from './EditarProducto'
import EliminarProducto from './EliminarProducto'
import { Boton, colores, mensajeError, mono, precio } from './tema'

export default function ListaProductos({ refrescar, onAviso }) {
  const { width } = useWindowDimensions()
  const columnas = width >= 760 ? 2 : 1

  const [productos, setProductos] = useState([])
  const [cargando, setCargando] = useState(true)
  const [recargando, setRecargando] = useState(false)
  const [error, setError] = useState(null)
  const [enEdicion, setEnEdicion] = useState(null)
  const [aEliminar, setAEliminar] = useState(null)

  const cargar = useCallback(async () => {
    setError(null)
    const { data, error } = await supabase
      .from('productos')
      .select('*')
      .order('id', { ascending: false })

    if (error) {
      console.error('Error al leer productos:', error.message)
      setError(mensajeError(error.message))
    } else {
      setProductos(data)
    }
    setCargando(false)
    setRecargando(false)
  }, [])

  useEffect(() => {
    cargar()
  }, [cargar, refrescar])

  const actualizarLocal = (p) => setProductos((l) => l.map((x) => (x.id === p.id ? p : x)))
  const eliminarLocal = (id) => setProductos((l) => l.filter((x) => x.id !== id))

  if (cargando) {
    return (
      <View style={s.centro}>
        <ActivityIndicator color={colores.etiqueta} />
        <Text style={s.tenue}>Cargando precios…</Text>
      </View>
    )
  }

  if (error) {
    return (
      <View style={s.centro}>
        <Text style={s.errorTitulo}>No se pudieron cargar los productos</Text>
        <Text style={s.tenue}>{error}</Text>
        <Boton
          titulo="Reintentar"
          variante="secundario"
          onPress={() => {
            setCargando(true)
            cargar()
          }}
        />
      </View>
    )
  }

  return (
    <>
      <FlatList
        key={columnas}
        numColumns={columnas}
        data={productos}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={s.lista}
        columnWrapperStyle={columnas > 1 ? s.fila : undefined}
        ListHeaderComponent={
          <View style={s.cabecera}>
            <Text style={s.conteo}>
              {productos.length} {productos.length === 1 ? 'producto' : 'productos'}
            </Text>
          </View>
        }
        ListEmptyComponent={
          <View style={s.vacio}>
            <Text style={s.vacioTitulo}>Aún no hay productos</Text>
            <Text style={s.tenue}>Agrega el primero con el botón de arriba.</Text>
          </View>
        }
        refreshControl={
          <RefreshControl
            refreshing={recargando}
            onRefresh={() => {
              setRecargando(true)
              cargar()
            }}
            tintColor={colores.etiqueta}
          />
        }
        renderItem={({ item }) => (
          <View style={[s.item, columnas > 1 && s.itemDoble]}>
            <View style={s.filaSuperior}>
              <View style={s.info}>
                <Text style={s.nombre} numberOfLines={1}>{item.producto}</Text>
                {item.descripcion ? (
                  <Text style={s.descripcion} numberOfLines={2}>{item.descripcion}</Text>
                ) : null}
              </View>
              <Text style={s.precio}>{precio(item.precio)}</Text>
            </View>

            <View style={s.acciones}>
              <Boton titulo="Editar" variante="texto" onPress={() => setEnEdicion(item)} />
              <Boton titulo="Eliminar" variante="textoPeligro" onPress={() => setAEliminar(item)} />
            </View>
          </View>
        )}
      />

      <EditarProducto
        producto={enEdicion}
        onCerrar={() => setEnEdicion(null)}
        onActualizado={actualizarLocal}
        onAviso={onAviso}
      />
      <EliminarProducto
        producto={aEliminar}
        onCerrar={() => setAEliminar(null)}
        onEliminado={eliminarLocal}
        onAviso={onAviso}
      />
    </>
  )
}

const s = StyleSheet.create({
  lista: { paddingHorizontal: 16, paddingBottom: 120 },
  fila: { gap: 12 },
  cabecera: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 4,
  },
  conteo: { fontFamily: mono, color: colores.tenue, fontSize: 14 },
  item: {
    backgroundColor: colores.superficie,
    borderWidth: 1,
    borderColor: colores.linea,
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
  },
  itemDoble: { flex: 1 },
  filaSuperior: { flexDirection: 'row', justifyContent: 'space-between', gap: 12 },
  info: { flex: 1 },
  nombre: { fontSize: 17, fontWeight: '600', color: colores.tinta },
  descripcion: { fontSize: 14, color: colores.tenue, marginTop: 4, lineHeight: 20 },
  precio: { fontFamily: mono, fontSize: 17, fontWeight: '600', color: colores.tinta },
  acciones: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 4,
    marginTop: 12,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: colores.linea,
  },
  centro: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12, padding: 24 },
  tenue: { color: colores.tenue, fontSize: 14, textAlign: 'center' },
  errorTitulo: { color: colores.peligro, fontSize: 16, fontWeight: '600', textAlign: 'center' },
  vacio: { alignItems: 'center', marginTop: 48, gap: 6 },
  vacioTitulo: { fontSize: 18, fontWeight: '600', color: colores.tinta },
})