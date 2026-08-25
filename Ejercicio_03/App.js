import React, { useState } from "react";
import { View, StyleSheet, Button, SafeAreaView} from 'react-native';

import CustomModal from "./componentes/CustomModal";

export default function App() {

    const [modalVisible, setModalVisible] = useState(false);
    const objetoContenido = {
        valor: "Juan Perez", 
    }

    return(
        <SafeAreaView style={styles.container}>
            <View style={styles.content}>
                <Button
                    title= "Ver mensaje"
                    onPress= {() => setModalVisible(true)}    
                />
                <CustomModal
                    visible= {modalVisible}
                    onClose= {() => setModalVisible(false)}
                    contenido = {objetoContenido}
                />
                
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container:{
        flex: 1,
        backgroundColor: "#d8bb19"
    },
    content: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },

});
