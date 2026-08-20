import { View, ImageBackground, StyleSheet, Dimensions, Image, Text } from "react-native";

const DemoImagen = () =>{
    return(
        <View style= {styles.container}>
            <ImageBackground
            style={styles.fondo}
                source={require('../assets/fondo.jpg')}
            >
                <View style= {styles.container}>
                <Text style= {styles.texto}>ESTÁS INVITADO!!</Text>
                <Image
                    style= {styles.foto}
                    source={{uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQxeoP8fxu9EBBbQLGiXbm4Yj5aFoMN5kC6DJ2bDVtypQ&s'}}
                />
                </View>

            </ImageBackground>
        </View>
    );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#d31414',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgb(0,0,0,0)'
  },
  fondo: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
  },
  foto: {
    width: 200,
    height: 400,
    borderRadius: 16,
    borderWidth: 10,
    borderColor: '#bd5',
    shadowColor: '#080808',
    shadowOffset: {width: 0, height: 10},
    shadowRadius: 10,
    elevation: 8,
  },
  texto: {
    fontSize: 45,
    color: '#e200f7', 
    borderColor: '#00ff00',
    backgroundColor: '#08f80086',
    width: Dimensions.get("window").width,
  }
  
});

export default DemoImagen;