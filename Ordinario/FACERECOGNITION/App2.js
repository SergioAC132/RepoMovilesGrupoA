import { useState } from 'react';
import { View, Text, Button, Image, StyleSheet } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as MediaLibrary from 'expo-media-library/legacy';

export default function App() {
  const [cameraPermission, requestCameraPermission] =
    useCameraPermissions();

  const [camera, setCamera] = useState(null);
  const [cameraReady, setCameraReady] = useState(false);
  const [photo, setPhoto] = useState(null);

  const [mediaPermission, requestMediaPermission] =
    MediaLibrary.usePermissions();

  const tomarFoto = async () => {
    if (!camera || !cameraReady) {
      return;
    }

    try {
      const result = await camera.takePictureAsync();

      if (result?.uri) {
        setPhoto(result.uri);

        // Guardar fotografía en la galería
        await MediaLibrary.saveToLibraryAsync(result.uri);

        console.log('Foto guardada:', result.uri);
      }
    } catch (error) {
      console.error('Error al tomar/guardar foto:', error);
    }
  };

  if (!cameraPermission || !mediaPermission) {
    return (
      <View style={styles.center}>
        <Text>Solicitando permisos...</Text>
      </View>
    );
  }

  if (!cameraPermission.granted) {
    return (
      <View style={styles.center}>
        <Text>
          Se necesita permiso para utilizar la cámara.
        </Text>

        <Button
          title="Dar permiso"
          onPress={requestCameraPermission}
        />
      </View>
    );
  }

  if (!mediaPermission.granted) {
    return (
      <View style={styles.center}>
        <Text>
          Se necesita permiso para guardar las fotografías.
        </Text>

        <Button
          title="Dar permiso"
          onPress={requestMediaPermission}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>

      <CameraView
        style={styles.camera}
        facing="back"
        ref={(ref) => setCamera(ref)}
        onCameraReady={() => setCameraReady(true)}
      />

      <View style={styles.controls}>
        <Button
          title={cameraReady ? '📷 Tomar foto' : 'Preparando cámara...'}
          onPress={tomarFoto}
          disabled={!cameraReady}
        />
      </View>

      {photo && (
        <Image
          source={{ uri: photo }}
          style={styles.preview}
        />
      )}

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  camera: {
    flex: 1,
  },

  controls: {
    padding: 20,
  },

  preview: {
    width: 200,
    height: 200,
    alignSelf: 'center',
    marginBottom: 20,
  },

  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
});
