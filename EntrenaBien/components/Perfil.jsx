import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  TextInput,
  StyleSheet,
  Animated,
} from 'react-native';

export default function Perfil() {
  const [nombre, setNombre] = useState('Tu nombre');
  const [objetivo, setObjetivo] = useState('Caminar más cada día');

  const [modal, setModal] = useState(false);
  const [nombreTemp, setNombreTemp] = useState('');
  const [objetivoTemp, setObjetivoTemp] = useState('');
  const [error, setError] = useState('');

  const escala = useRef(new Animated.Value(0)).current;

  const rebotar = (inicio) => {
    escala.setValue(inicio);
    Animated.spring(escala, {
      toValue: 1,
      friction: 4,
      useNativeDriver: true,
    }).start();
  };

  // Entrada del avatar al abrir la pantalla
  useEffect(() => {
    rebotar(0);
  }, []);

  const inicial = nombre.trim().charAt(0).toUpperCase() || '?';

  const abrirModal = () => {
    setNombreTemp(nombre);
    setObjetivoTemp(objetivo);
    setError('');
    setModal(true);
  };

  const guardar = () => {
    if (!nombreTemp.trim()) {
      setError('El nombre no puede estar vacío');
      return;
    }
    setNombre(nombreTemp.trim());
    setObjetivo(objetivoTemp.trim() || 'Sin objetivo definido');
    setModal(false);
    rebotar(0.6);
  };

  return (
    <View style={styles.contenedor}>
      <Animated.View style={[styles.avatar, { transform: [{ scale: escala }] }]}>
        <Text style={styles.inicial}>{inicial}</Text>
      </Animated.View>

      <Text style={styles.nombre}>{nombre}</Text>

      <View style={styles.tarjeta}>
        <Text style={styles.etiqueta}>Mi objetivo</Text>
        <Text style={styles.objetivo}>{objetivo}</Text>
      </View>

      <TouchableOpacity style={[styles.boton, styles.botonAzul]} onPress={abrirModal}>
        <Text style={styles.textoBoton}>Editar perfil</Text>
      </TouchableOpacity>

      <Modal
        visible={modal}
        animationType="slide"
        transparent
        onRequestClose={() => setModal(false)}
      >
        <View style={styles.fondoModal}>
          <View style={styles.modal}>
            <Text style={styles.modalTitulo}>Editar perfil</Text>

            <TextInput
              style={styles.input}
              placeholder="Nombre"
              value={nombreTemp}
              onChangeText={setNombreTemp}
            />
            <TextInput
              style={styles.input}
              placeholder="Objetivo (ej. Caminar 8000 pasos)"
              value={objetivoTemp}
              onChangeText={setObjetivoTemp}
            />

            {error ? <Text style={styles.error}>{error}</Text> : null}

            <View style={styles.filaModal}>
              <TouchableOpacity
                style={[styles.boton, styles.botonGris]}
                onPress={() => setModal(false)}
              >
                <Text style={styles.textoBotonGris}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.boton, styles.botonAzul]}
                onPress={guardar}
              >
                <Text style={styles.textoBoton}>Guardar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  contenedor: {
    flex: 1,
    backgroundColor: '#f4f6f8',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  avatar: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: '#1e88e5',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    elevation: 4,
  },
  inicial: { fontSize: 48, fontWeight: '800', color: '#fff' },
  nombre: { fontSize: 24, fontWeight: '700', marginBottom: 20 },

  tarjeta: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    elevation: 2,
  },
  etiqueta: { color: '#888', fontSize: 13, marginBottom: 4 },
  objetivo: { fontSize: 17 },

  boton: {
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 8,
    marginLeft: 10,
  },
  botonAzul: { backgroundColor: '#1e88e5' },
  botonGris: { backgroundColor: '#e0e0e0' },
  textoBoton: { color: '#fff', fontWeight: '600' },
  textoBotonGris: { color: '#333', fontWeight: '600' },

  fondoModal: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    padding: 24,
  },
  modal: { backgroundColor: '#fff', borderRadius: 16, padding: 20 },
  modalTitulo: { fontSize: 20, fontWeight: '700', marginBottom: 12 },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
  },
  error: { color: '#e53935', marginBottom: 8 },
  filaModal: { flexDirection: 'row', justifyContent: 'flex-end' },
});