import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import DemoImagen from './componentes/DemoImagen';

export default function App() {
  return (
    <View style={styles.container}>
      <DemoImagen/>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#d31414',
    alignItems: 'center',
    justifyContent: 'center'
  },
  panel1: {
    flex: 1,
    backgroundColor: '#1eff009a'
  },
  panel2: {
    flex: 1,
    backgroundColor: '#fff'
  },
  panel3: {
    flex: 1,
    backgroundColor: '#ee0303ad'
  },
});
