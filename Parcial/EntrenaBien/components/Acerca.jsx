import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const funciones = [
  { icono: 'walk', texto: 'Contador de pasos con el podómetro del teléfono' },
  { icono: 'list', texto: 'Registro de actividades físicas' },
  { icono: 'flag', texto: 'Meta diaria personalizable' },
  { icono: 'person', texto: 'Perfil editable' },
];

export default function Acerca() {
  const opacidad = useRef(new Animated.Value(0)).current;
  const subida = useRef(new Animated.Value(30)).current;
  const items = useRef(funciones.map(() => new Animated.Value(0))).current;

  useEffect(() => {
    // Primero entra la tarjeta, luego las funciones una por una
    Animated.parallel([
      Animated.timing(opacidad, { toValue: 1, duration: 400, useNativeDriver: true }),
      Animated.timing(subida, { toValue: 0, duration: 400, useNativeDriver: true }),
    ]).start(() => {
      Animated.stagger(
        150,
        items.map((valor) =>
          Animated.timing(valor, { toValue: 1, duration: 300, useNativeDriver: true })
        )
      ).start();
    });
  }, []);

  return (
    <View style={styles.contenedor}>
      <Animated.View
        style={[
          styles.tarjeta,
          { opacity: opacidad, transform: [{ translateY: subida }] },
        ]}
      >
        <Ionicons name="walk" size={56} color="#1e88e5" />
        <Text style={styles.nombre}>PasosApp</Text>
        <Text style={styles.version}>Versión 1.0.0</Text>
        <Text style={styles.descripcion}>
          App para llevar el control de tus pasos y actividades físicas del día.
        </Text>
      </Animated.View>

      <View style={styles.lista}>
        {funciones.map((f, i) => (
          <Animated.View
            key={f.texto}
            style={[
              styles.fila,
              {
                opacity: items[i],
                transform: [
                  {
                    translateX: items[i].interpolate({
                      inputRange: [0, 1],
                      outputRange: [-20, 0],
                    }),
                  },
                ],
              },
            ]}
          >
            <Ionicons name={f.icono} size={22} color="#43a047" />
            <Text style={styles.textoFila}>{f.texto}</Text>
          </Animated.View>
        ))}
      </View>
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
  tarjeta: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    elevation: 3,
    marginBottom: 20,
  },
  nombre: { fontSize: 26, fontWeight: '800', marginTop: 8 },
  version: { color: '#888', marginBottom: 12 },
  descripcion: { textAlign: 'center', color: '#555', fontSize: 16 },

  lista: { width: '100%' },
  fila: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
    elevation: 1,
  },
  textoFila: { marginLeft: 12, flex: 1, fontSize: 15 },
});