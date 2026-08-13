
import { StyleSheet, Text, View } from 'react-native';

export default function Mensaje(props){
    const variableMensaje="Esto es mi mensaje"
    const num= 1000

    const double = n => n*2;
    
    return(
        <View>
            <Text style={styles.texto_verde}>{props.msg}</Text>
            <Text style={styles.texto_azul}>{double(props.num)}</Text>
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
    backgroundColor: 'orange',
  },
  texto_verde: {
    color: 'green',
    backgroundColor: 'purple',
  }
});