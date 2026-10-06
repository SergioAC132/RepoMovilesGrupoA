import { StyleSheet, Text, View, Modal, Button } from 'react-native';
import { useState } from 'react';

export default function App() {
  const [modal, setModal] =useState(false)
  
  return (
    <View style={styles.container}>
      <Modal
        animationType= 'slide'
        transparent = {true}
        visible = {modal}
      >
        <View style= {styles.center}>
          <View style = {styles.contenido}>
            <Text>Esto es un modal</Text>
            <Button
              title= "Close Modal"
              onPress= {()=> setModal(!modal)}
            />
          </View>
        </View>
      </Modal>
      <Text>Este texto esta fuera del modal</Text>
      <Button
        title = "Mostrar modal"
        onPress = {() => setModal(!modal)}
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
  center: {
    flex: 1,
    alignItems: 'stretch',
    justifyContent: 'center',
    backgroundColor: "#3ae4cd50"
  },
  contenido: {
    flex:1,
    backgroundColor: "rgba(73,156,200,1)",
    alignItems: 'center',
    justifyContent: 'center',
    margin: (200, 20, 200 ,20),
  }
});
