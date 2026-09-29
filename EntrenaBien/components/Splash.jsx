import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as SplashScreen from 'expo-splash-screen';
import { colores } from './tema';

export default function Splash({ onFinish }) {
  const escala = useRef(new Animated.Value(0.3)).current;
  const opacidad = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.parallel([
        Animated.spring(escala, { toValue: 1, friction: 5, useNativeDriver: true }),
        Animated.timing(opacidad, { toValue: 1, duration: 600, useNativeDriver: true }),
      ]),
      Animated.delay(800),
      Animated.timing(opacidad, { toValue: 0, duration: 400, useNativeDriver: true }),
    ]).start(() => onFinish());
  }, []);

  return (
    <View style={styles.contenedor} onLayout={() => SplashScreen.hideAsync()}>
      <Animated.View
        style={{ alignItems: 'center', opacity: opacidad, transform: [{ scale: escala }] }}
      >
        <View style={styles.circulo}>
          <Ionicons name="walk" size={72} color={colores.sobreAcento} />
        </View>
        <Text style={styles.nombre}>PasosApp</Text>
        <Text style={styles.lema}>Un paso a la vez</Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  contenedor: {
    flex: 1,
    backgroundColor: colores.fondo,
    alignItems: 'center',
    justifyContent: 'center',
  },
  circulo: {
    width: 130,
    height: 130,
    borderRadius: 65,
    backgroundColor: colores.acento,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  nombre: { fontSize: 34, fontWeight: '800', color: colores.texto },
  lema: { fontSize: 16, color: colores.textoSuave, marginTop: 4 },
});