import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Modal,
  TextInput,
  Pressable,
  StyleSheet,
  Animated,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colores, formatear } from './tema';

const TIPOS = [
  { id: 'caminata', nombre: 'Caminata', icono: 'walk' },
  { id: 'carrera', nombre: 'Carrera', icono: 'fitness' },
  { id: 'bici', nombre: 'Bicicleta', icono: 'bicycle' },
  { id: 'otra', nombre: 'Otra', icono: 'barbell' },
];
const tipoDe = (id) => TIPOS.find((t) => t.id === id) || TIPOS[3];

// Cada fila entra con un fade + slide corto al agregarse
function ActividadItem({ item, onBorrar }) {
  const opacidad = useRef(new Animated.Value(0)).current;
  const desplazamiento = useRef(new Animated.Value(12)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacidad, { toValue: 1, duration: 300, useNativeDriver: true }),
      Animated.timing(desplazamiento, { toValue: 0, duration: 300, useNativeDriver: true }),
    ]).start();
  }, []);

  const tipo = tipoDe(item.tipo);
  const detalle =
    item.pasos > 0
      ? `${item.duracion} min, ${formatear(item.pasos)} pasos`
      : `${item.duracion} min`;

  return (
    <Animated.View
      style={[styles.fila, { opacity: opacidad, transform: [{ translateY: desplazamiento }] }]}
    >
      <View style={styles.icono}>
        <Ionicons name={tipo.icono} size={22} color={colores.acento} />
      </View>
      <View style={styles.info}>
        <Text style={styles.nombre}>{item.nombre}</Text>
        <Text style={styles.detalle}>{detalle}</Text>
      </View>
      <TouchableOpacity
        onPress={() => onBorrar(item.id)}
        hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
        accessibilityLabel={`Borrar ${item.nombre}`}
      >
        <Ionicons name="trash-outline" size={22} color={colores.textoSuave} />
      </TouchableOpacity>
    </Animated.View>
  );
}

export default function Actividades() {
  const [actividades, setActividades] = useState([]);
  const [modalAgregar, setModalAgregar] = useState(false);
  const [idBorrar, setIdBorrar] = useState(null);

  const [tipoSel, setTipoSel] = useState('caminata');
  const [duracion, setDuracion] = useState('');
  const [pasos, setPasos] = useState('');
  const [nombre, setNombre] = useState('');

  const pasosRef = useRef(null);
  const nombreRef = useRef(null);

  const valido = Number(duracion) > 0;
  const aBorrar = actividades.find((a) => a.id === idBorrar);

  const totalMin = actividades.reduce((s, a) => s + a.duracion, 0);
  const totalPasos = actividades.reduce((s, a) => s + a.pasos, 0);
  const n = actividades.length;

  const cerrarAgregar = () => {
    setModalAgregar(false);
    setTipoSel('caminata');
    setDuracion('');
    setPasos('');
    setNombre('');
  };

  const guardar = () => {
    if (!valido) return;
    const tipo = tipoDe(tipoSel);
    setActividades((prev) => [
      {
        id: Date.now().toString(),
        tipo: tipoSel,
        nombre: nombre.trim() || tipo.nombre,
        duracion: Number(duracion),
        pasos: Number(pasos) || 0,
      },
      ...prev,
    ]);
    cerrarAgregar();
  };

  const confirmarBorrado = () => {
    setActividades((prev) => prev.filter((a) => a.id !== idBorrar));
    setIdBorrar(null);
  };

  return (
    <View style={styles.pantalla}>
      <FlatList
        data={actividades}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <ActividadItem item={item} onBorrar={setIdBorrar} />}
        contentContainerStyle={styles.lista}
        ListHeaderComponent={
          n > 0 ? (
            <Text style={styles.resumen}>
              Llevas {n} {n === 1 ? 'actividad' : 'actividades'}: {totalMin} min
              y {formatear(totalPasos)} pasos.
            </Text>
          ) : null
        }
        ListEmptyComponent={
          <View style={styles.vacio}>
            <Ionicons name="footsteps-outline" size={64} color={colores.linea} />
            <Text style={styles.vacioTitulo}>Todavía no registras actividades</Text>
            <Text style={styles.vacioTexto}>
              Agrega tu primera caminata con el botón de abajo.
            </Text>
          </View>
        }
      />

      {/* Botón principal */}
      <TouchableOpacity style={styles.fab} onPress={() => setModalAgregar(true)}>
        <Ionicons name="add" size={24} color={colores.sobreAcento} />
        <Text style={styles.fabTexto}>Agregar actividad</Text>
      </TouchableOpacity>

      {/* Modal: agregar actividad */}
      <Modal
        visible={modalAgregar}
        animationType="slide"
        transparent
        onRequestClose={cerrarAgregar}
      >
        <KeyboardAvoidingView
          style={styles.fondoModal}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <Pressable style={StyleSheet.absoluteFill} onPress={cerrarAgregar} />
          <View style={styles.modal}>
            <Text style={styles.modalTitulo}>Agregar actividad</Text>

            <View style={styles.chips}>
              {TIPOS.map((t) => {
                const activo = t.id === tipoSel;
                return (
                  <TouchableOpacity
                    key={t.id}
                    style={[styles.chip, activo && styles.chipActivo]}
                    onPress={() => setTipoSel(t.id)}
                  >
                    <Ionicons
                      name={t.icono}
                      size={16}
                      color={activo ? colores.sobreAcento : colores.texto}
                    />
                    <Text style={[styles.chipTexto, activo && styles.chipTextoActivo]}>
                      {t.nombre}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            <TextInput
              style={styles.input}
              placeholder="Minutos"
              placeholderTextColor={colores.textoSuave}
              keyboardType="numeric"
              value={duracion}
              onChangeText={setDuracion}
              returnKeyType="next"
              onSubmitEditing={() => pasosRef.current?.focus()}
            />
            <TextInput
              ref={pasosRef}
              style={styles.input}
              placeholder="Pasos (opcional)"
              placeholderTextColor={colores.textoSuave}
              keyboardType="numeric"
              value={pasos}
              onChangeText={setPasos}
              returnKeyType="next"
              onSubmitEditing={() => nombreRef.current?.focus()}
            />
            <TextInput
              ref={nombreRef}
              style={styles.input}
              placeholder="Nombre (opcional)"
              placeholderTextColor={colores.textoSuave}
              value={nombre}
              onChangeText={setNombre}
              returnKeyType="done"
              onSubmitEditing={guardar}
            />

            <View style={styles.botones}>
              <TouchableOpacity
                style={[styles.boton, styles.botonSecundario]}
                onPress={cerrarAgregar}
              >
                <Text style={styles.textoSecundario}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.boton, styles.botonPrimario, !valido && styles.desactivado]}
                onPress={guardar}
                disabled={!valido}
              >
                <Text style={styles.textoPrimario}>Guardar actividad</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {/* Modal: confirmar borrado */}
      <Modal
        visible={idBorrar !== null}
        animationType="fade"
        transparent
        onRequestClose={() => setIdBorrar(null)}
      >
        <View style={styles.fondoModal}>
          <Pressable style={StyleSheet.absoluteFill} onPress={() => setIdBorrar(null)} />
          <View style={styles.modal}>
            <Text style={styles.modalTitulo}>¿Borrar esta actividad?</Text>
            <Text style={styles.modalTexto}>
              Se quitará "{aBorrar ? aBorrar.nombre : ''}" de tu registro.
            </Text>
            <View style={styles.botones}>
              <TouchableOpacity
                style={[styles.boton, styles.botonSecundario]}
                onPress={() => setIdBorrar(null)}
              >
                <Text style={styles.textoSecundario}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.boton, styles.botonPeligro]}
                onPress={confirmarBorrado}
              >
                <Text style={styles.textoPrimario}>Borrar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  pantalla: { flex: 1, backgroundColor: colores.fondo },
  lista: { padding: 20, paddingBottom: 110, flexGrow: 1 },
  resumen: { color: colores.textoSuave, fontSize: 15, marginBottom: 8 },

  fila: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: colores.linea,
  },
  icono: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: colores.superficie,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  info: { flex: 1 },
  nombre: { fontSize: 17, fontWeight: '700', color: colores.texto },
  detalle: { color: colores.textoSuave, marginTop: 2, fontSize: 14 },

  vacio: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingTop: 80 },
  vacioTitulo: { color: colores.texto, fontSize: 18, fontWeight: '700', marginTop: 16 },
  vacioTexto: { color: colores.textoSuave, textAlign: 'center', marginTop: 6, maxWidth: 260 },

  fab: {
    position: 'absolute',
    right: 20,
    bottom: 24,
    flexDirection: 'row',
    alignItems: 'center',
    height: 54,
    paddingHorizontal: 20,
    borderRadius: 999,
    backgroundColor: colores.acento,
    elevation: 6,
  },
  fabTexto: { color: colores.sobreAcento, fontWeight: '700', fontSize: 16, marginLeft: 6 },

  fondoModal: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    padding: 24,
  },
  modal: {
    backgroundColor: colores.superficie,
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: colores.linea,
  },
  modalTitulo: { fontSize: 20, fontWeight: '700', color: colores.texto, marginBottom: 14 },
  modalTexto: { color: colores.textoSuave, fontSize: 15 },

  chips: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 6 },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colores.linea,
    borderRadius: 999,
    paddingVertical: 8,
    paddingHorizontal: 14,
    marginRight: 8,
    marginBottom: 8,
  },
  chipActivo: { backgroundColor: colores.acento, borderColor: colores.acento },
  chipTexto: { color: colores.texto, fontWeight: '600', marginLeft: 6 },
  chipTextoActivo: { color: colores.sobreAcento },

  input: {
    borderWidth: 1,
    borderColor: colores.linea,
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
    marginBottom: 10,
    color: colores.texto,
    backgroundColor: colores.fondo,
  },

  botones: { flexDirection: 'row', justifyContent: 'flex-end', marginTop: 10 },
  boton: { paddingVertical: 12, paddingHorizontal: 18, borderRadius: 12, marginLeft: 10 },
  botonPrimario: { backgroundColor: colores.acento },
  botonPeligro: { backgroundColor: colores.peligro },
  botonSecundario: { backgroundColor: 'transparent' },
  textoPrimario: { color: colores.sobreAcento, fontWeight: '700' },
  textoSecundario: { color: colores.texto, fontWeight: '600' },
  desactivado: { opacity: 0.4 },
});