import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import Cat from './componentes/Cat.jsx';
import Mensaje from './componentes/Mensaje.jsx';

export default function App() {
  return (
    <View style={styles.container}>
      <Text style={styles.texto_rojo}>Open up App.js to start working on your app!</Text>
      <Text>Esto es otro componente de texto!</Text>
      <Cat/>
      <Mensaje msg="Mi mensaje como propiedad" num="3000"/>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  texto_rojo: {
    color: 'red',
  },
  texto_azul: {
    color: 'blue',
  },
  texto_verde: {
    color: 'verde',
  }
});
