import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Modal,
  TextInput,
  Pressable,
  StyleSheet,
  Animated,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { Ionicons } from '@expo/vector-icons';
import { Pedometer } from 'expo-sensors';
import { colores, formatear } from './tema';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);
const TAM = 250;
const GROSOR = 16;
const RADIO = (TAM - GROSOR) / 2;
const CIRCUNFERENCIA = 2 * Math.PI * RADIO;

function Dato({ etiqueta, valor }) {
  return (
    <View style={styles.dato}>
      <Text style={styles.datoEtiqueta}>{etiqueta}</Text>
      <Text style={styles.datoValor}>{valor}</Text>
    </View>
  );
}

export default function Pasos() {
  const [disponible, setDisponible] = useState(null); // null = comprobando
  const [pasosSensor, setPasosSensor] = useState(0);
  const [pasosExtra, setPasosExtra] = useState(0); // pasos de prueba
  const [meta, setMeta] = useState(8000);
  const [modalMeta, setModalMeta] = useState(false);
  const [metaTemp, setMetaTemp] = useState('');

  const progreso = useRef(new Animated.Value(0)).current;

  const total = pasosSensor + pasosExtra;
  const porcentaje = Math.min(total / meta, 1);
  const cumplida = total >= meta;
  const km = (total * 0.00075).toFixed(2);
  const kcal = Math.round(total * 0.04);
  const faltan = Math.max(meta - total, 0);
  const metaValida = Number(metaTemp) > 0;

  // Sensor: podómetro
  useEffect(() => {
    let suscripcion;

    const iniciar = async () => {
      try {
        const ok = await Pedometer.isAvailableAsync();
        if (!ok) {
          setDisponible(false);
          return;
        }
        const permiso = await Pedometer.requestPermissionsAsync();
        if (!permiso.granted) {
          setDisponible(false);
          return;
        }
        setDisponible(true);
        suscripcion = Pedometer.watchStepCount((r) => setPasosSensor(r.steps));
      } catch (e) {
        setDisponible(false);
      }
    };

    iniciar();
    return () => suscripcion && suscripcion.remove();
  }, []);

  // El anillo se llena hacia el porcentaje actual
  useEffect(() => {
    Animated.timing(progreso, {
      toValue: porcentaje,
      duration: 600,
      useNativeDriver: false, // strokeDashoffset no soporta native driver
    }).start();
  }, [porcentaje]);

  const offset = progreso.interpolate({
    inputRange: [0, 1],
    outputRange: [CIRCUNFERENCIA, 0],
  });

  const abrirModalMeta = () => {
    setMetaTemp(String(meta));
    setModalMeta(true);
  };

  const guardarMeta = () => {
    if (!metaValida) return;
    setMeta(Number(metaTemp));
    setModalMeta(false);
  };

  return (
    <ScrollView
      style={styles.pantalla}
      contentContainerStyle={styles.contenido}
    >
      {/* Anillo de progreso */}
      <View style={{ width: TAM, height: TAM }}>
        <Svg width={TAM} height={TAM}>
          <Circle
            cx={TAM / 2}
            cy={TAM / 2}
            r={RADIO}
            stroke={colores.linea}
            strokeWidth={GROSOR}
            fill="none"
          />
          <AnimatedCircle
            cx={TAM / 2}
            cy={TAM / 2}
            r={RADIO}
            stroke={cumplida ? colores.exito : colores.acento}
            strokeWidth={GROSOR}
            fill="none"
            strokeLinecap="round"
            strokeDasharray={CIRCUNFERENCIA}
            strokeDashoffset={offset}
            rotation={-90}
            origin={`${TAM / 2}, ${TAM / 2}`}
          />
        </Svg>
        <View style={[StyleSheet.absoluteFill, styles.centro]}>
          <Text style={styles.numero}>{formatear(total)}</Text>
          <Text style={styles.subtitulo}>
            {cumplida ? 'Meta cumplida' : `de ${formatear(meta)} pasos`}
          </Text>
        </View>
      </View>

      <TouchableOpacity style={styles.enlace} onPress={abrirModalMeta}>
        <Ionicons name="create-outline" size={18} color={colores.acento} />
        <Text style={styles.enlaceTexto}>Cambiar meta</Text>
      </TouchableOpacity>

      {/* Datos del día */}
      <View style={styles.datos}>
        <Dato etiqueta="Distancia" valor={`${km} km`} />
        <Dato etiqueta="Calorías" valor={`${kcal} kcal`} />
        <Dato
          etiqueta="Te faltan"
          valor={cumplida ? '0 pasos' : `${formatear(faltan)} pasos`}
        />
      </View>
      <Text style={styles.nota}>Distancia y calorías son estimaciones.</Text>

      {/* Estado del sensor */}
      <View style={styles.estado}>
        <View
          style={[
            styles.punto,
            {
              backgroundColor:
                disponible === true
                  ? colores.exito
                  : disponible === false
                  ? colores.peligro
                  : colores.textoSuave,
            },
          ]}
        />
        <Text style={styles.estadoTexto}>
          {disponible === null && 'Buscando el podómetro…'}
          {disponible === true && 'Podómetro activo, cuenta con la app abierta'}
          {disponible === false &&
            'Este dispositivo no tiene podómetro. Usa los pasos de prueba.'}
        </Text>
      </View>

      {/* Pasos de prueba */}
      <Text style={styles.etiquetaPrueba}>Sumar pasos de prueba</Text>
      <View style={styles.chips}>
        {[100, 500, 1000].map((n) => (
          <TouchableOpacity
            key={n}
            style={styles.chip}
            onPress={() => setPasosExtra((p) => p + n)}
          >
            <Text style={styles.chipTexto}>+{n}</Text>
          </TouchableOpacity>
        ))}
        <TouchableOpacity style={styles.chip} onPress={() => setPasosExtra(0)}>
          <Text style={styles.chipTexto}>Reiniciar</Text>
        </TouchableOpacity>
      </View>

      {/* Modal: cambiar meta */}
      <Modal
        visible={modalMeta}
        animationType="fade"
        transparent
        onRequestClose={() => setModalMeta(false)}
      >
        <KeyboardAvoidingView
          style={styles.fondoModal}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <Pressable
            style={StyleSheet.absoluteFill}
            onPress={() => setModalMeta(false)}
          />
          <View style={styles.modal}>
            <Text style={styles.modalTitulo}>Cambiar meta diaria</Text>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              placeholder="Pasos por día"
              placeholderTextColor={colores.textoSuave}
              value={metaTemp}
              onChangeText={setMetaTemp}
              selectTextOnFocus
              autoFocus
              returnKeyType="done"
              onSubmitEditing={guardarMeta}
            />
            <View style={styles.botones}>
              <TouchableOpacity
                style={[styles.boton, styles.botonSecundario]}
                onPress={() => setModalMeta(false)}
              >
                <Text style={styles.textoSecundario}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.boton, styles.botonPrimario, !metaValida && styles.desactivado]}
                onPress={guardarMeta}
                disabled={!metaValida}
              >
                <Text style={styles.textoPrimario}>Guardar meta</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  pantalla: { flex: 1, backgroundColor: colores.fondo },
  contenido: { alignItems: 'center', padding: 24, paddingBottom: 40 },
  centro: { alignItems: 'center', justifyContent: 'center' },
  numero: { fontSize: 58, fontWeight: '800', color: colores.texto },
  subtitulo: { fontSize: 15, color: colores.textoSuave, marginTop: 2 },

  enlace: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
    marginTop: 8,
  },
  enlaceTexto: { color: colores.acento, fontWeight: '600', marginLeft: 6, fontSize: 15 },

  datos: { width: '100%', marginTop: 8 },
  dato: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: colores.linea,
  },
  datoEtiqueta: { color: colores.textoSuave, fontSize: 16 },
  datoValor: { color: colores.texto, fontSize: 16, fontWeight: '700' },
  nota: { alignSelf: 'flex-start', color: colores.textoSuave, fontSize: 12, marginTop: 8 },

  estado: { flexDirection: 'row', alignItems: 'center', marginTop: 24, alignSelf: 'flex-start' },
  punto: { width: 10, height: 10, borderRadius: 5, marginRight: 8 },
  estadoTexto: { color: colores.textoSuave, fontSize: 13, flexShrink: 1 },

  etiquetaPrueba: { alignSelf: 'flex-start', color: colores.texto, fontWeight: '600', marginTop: 24 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', alignSelf: 'flex-start', marginTop: 10 },
  chip: {
    borderWidth: 1,
    borderColor: colores.linea,
    borderRadius: 999,
    paddingVertical: 10,
    paddingHorizontal: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  chipTexto: { color: colores.texto, fontWeight: '600' },

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
  input: {
    borderWidth: 1,
    borderColor: colores.linea,
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
    color: colores.texto,
    backgroundColor: colores.fondo,
  },
  botones: { flexDirection: 'row', justifyContent: 'flex-end', marginTop: 16 },
  boton: { paddingVertical: 12, paddingHorizontal: 18, borderRadius: 12, marginLeft: 10 },
  botonPrimario: { backgroundColor: colores.acento },
  botonSecundario: { backgroundColor: 'transparent' },
  textoPrimario: { color: colores.sobreAcento, fontWeight: '700' },
  textoSecundario: { color: colores.texto, fontWeight: '600' },
  desactivado: { opacity: 0.4 },
});