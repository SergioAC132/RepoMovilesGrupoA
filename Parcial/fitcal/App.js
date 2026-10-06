import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TextInput, Button, SafeAreaView, Dimensions} from 'react-native';

import CustomModal from "./componentes/CustomModal";
import {useState} from 'react';



export default function App() {

  const [modalVisible, setModalVisible] = useState(false);
  const [peso, setPeso] = useState()
  const [altura, setAltura] = useState()
  

  return (
    <View style={styles.container}>
      <View>
        <Text>Peso (kg)</Text>
        <TextInput 
          style={styles.input}
          onChangeText={t=>setPeso(t)}
          value={peso}
        >
        </TextInput>
      </View>
      <View>
        <Text>Altura (m)</Text>
        <TextInput 
          style={styles.input}
          onChangeText={t=>setAltura(t)}
          value= {altura}
        >
        </TextInput>
      </View>
      <Button
        title= "Calcular IMC"
        onPress= {() => setModalVisible(true)}    
      />
      <CustomModal peso= {peso} altura= {altura}
        visible= {modalVisible}
        onClose= {() => setModalVisible(false)}
      />
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
  input: {
    height: 40,
    width: Dimensions.get('window').width,
    margin: 12,
    borderWidth: 1,
    padding: 10,

  },
});
