import React, { useEffect, useState } from 'react';

import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';

import {
  CameraView,
  useCameraPermissions,
} from 'expo-camera';

import * as MediaLibrary from 'expo-media-library/legacy';

import * as ImageManipulator from 'expo-image-manipulator';

import jpeg from 'jpeg-js';

import {
  loadTensorflowModel,
} from 'react-native-fast-tflite';


const MODEL_INPUT_SIZE = 128;

const MIN_SCORE = 0.5;

const MIN_SUPPRESSION_THRESHOLD = 0.3;


// ---------------------------------------------------------
// GENERAR LOS 896 ANCHORS DE BLAZEFACE
// ---------------------------------------------------------

function generateAnchors() {
  const anchors = [];

  const inputSize = 128;

  const strides = [8, 16, 16, 16];

  const numLayers = 4;

  let layerId = 0;

  while (layerId < numLayers) {

    let lastSameStrideLayer = layerId;

    let repeats = 0;

    while (
      lastSameStrideLayer < numLayers &&
      strides[lastSameStrideLayer] === strides[layerId]
    ) {
      lastSameStrideLayer++;
      repeats += 2;
    }

    const stride = strides[layerId];

    const featureMapHeight = inputSize / stride;
    const featureMapWidth = inputSize / stride;

    for (let y = 0; y < featureMapHeight; y++) {

      for (let x = 0; x < featureMapWidth; x++) {

        const xCenter =
          (x + 0.5) / featureMapWidth;

        const yCenter =
          (y + 0.5) / featureMapHeight;

        for (let i = 0; i < repeats; i++) {

          anchors.push([
            xCenter,
            yCenter,
          ]);

        }
      }
    }

    layerId = lastSameStrideLayer;
  }

  return anchors;
}


const ANCHORS = generateAnchors();


// ---------------------------------------------------------
// SIGMOID
// ---------------------------------------------------------

function sigmoid(value) {

  return 1 / (1 + Math.exp(-value));

}


// ---------------------------------------------------------
// IOU
// ---------------------------------------------------------

function calculateIoU(a, b) {

  const x1 = Math.max(a.x, b.x);

  const y1 = Math.max(a.y, b.y);

  const x2 = Math.min(
    a.x + a.width,
    b.x + b.width
  );

  const y2 = Math.min(
    a.y + a.height,
    b.y + b.height
  );

  const intersectionWidth =
    Math.max(0, x2 - x1);

  const intersectionHeight =
    Math.max(0, y2 - y1);

  const intersection =
    intersectionWidth *
    intersectionHeight;

  const areaA =
    a.width *
    a.height;

  const areaB =
    b.width *
    b.height;

  const union =
    areaA +
    areaB -
    intersection;

  if (union <= 0) {
    return 0;
  }

  return intersection / union;
}


// ---------------------------------------------------------
// NON MAXIMUM SUPPRESSION
// ---------------------------------------------------------

function nonMaximumSuppression(detections) {

  const sorted =
    [...detections]
      .sort((a, b) => b.score - a.score);

  const result = [];

  while (sorted.length > 0) {

    const current = sorted.shift();

    result.push(current);

    for (
      let i = sorted.length - 1;
      i >= 0;
      i--
    ) {

      const iou =
        calculateIoU(
          current.box,
          sorted[i].box
        );

      if (
        iou >
        MIN_SUPPRESSION_THRESHOLD
      ) {

        sorted.splice(i, 1);

      }
    }
  }

  return result;
}


// ---------------------------------------------------------
// DECODIFICAR SALIDA DE BLAZEFACE
// ---------------------------------------------------------

function decodeDetections(
  rawBoxes,
  rawScores,
  originalWidth,
  originalHeight
) {

  const detections = [];

  /*
   * BlazeFace short range:
   *
   * 896 anchors
   * 16 valores por anchor
   *
   * Los primeros 4:
   *   xCenter
   *   yCenter
   *   width
   *   height
   *
   * El resto son keypoints.
   */

  for (
    let i = 0;
    i < ANCHORS.length;
    i++
  ) {

    const score =
      sigmoid(
        Math.max(
          -80,
          Math.min(
            80,
            rawScores[i]
          )
        )
      );

    if (score < MIN_SCORE) {
      continue;
    }

    const anchor =
      ANCHORS[i];

    const offset =
      i * 16;

    const xCenter =
      rawBoxes[offset] / 128 +
      anchor[0];

    const yCenter =
      rawBoxes[offset + 1] / 128 +
      anchor[1];

    const width =
      rawBoxes[offset + 2] / 128;

    const height =
      rawBoxes[offset + 3] / 128;


    const x =
      xCenter - width / 2;

    const y =
      yCenter - height / 2;


    const box = {

      x: Math.max(0, x),

      y: Math.max(0, y),

      width: Math.min(
        width,
        1 - Math.max(0, x)
      ),

      height: Math.min(
        height,
        1 - Math.max(0, y)
      ),

    };


    if (
      box.width <= 0 ||
      box.height <= 0
    ) {
      continue;
    }


    detections.push({

      score,

      box,

    });

  }


  const filtered =
    nonMaximumSuppression(
      detections
    );


  return filtered.map(
    (detection) => ({

      score: detection.score,

      box: {

        x:
          detection.box.x *
          originalWidth,

        y:
          detection.box.y *
          originalHeight,

        width:
          detection.box.width *
          originalWidth,

        height:
          detection.box.height *
          originalHeight,

      },

    })
  );

}


// ---------------------------------------------------------
// APP
// ---------------------------------------------------------

export default function App() {

  const [
    cameraPermission,
    requestCameraPermission,
  ] =
    useCameraPermissions();


  const [
    mediaPermission,
    requestMediaPermission,
  ] =
    MediaLibrary.usePermissions();


  const [
    camera,
    setCamera,
  ] =
    useState(null);


  const [
    cameraReady,
    setCameraReady,
  ] =
    useState(false);


  const [
    photo,
    setPhoto,
  ] =
    useState(null);


  const [
    model,
    setModel,
  ] =
    useState(null);


  const [
    modelLoading,
    setModelLoading,
  ] =
    useState(true);


  const [
    processing,
    setProcessing,
  ] =
    useState(false);


  const [
    faces,
    setFaces,
  ] =
    useState([]);


  const [
    error,
    setError,
  ] =
    useState(null);


  // -------------------------------------------------------
  // PERMISOS
  // -------------------------------------------------------

  useEffect(() => {

    requestCameraPermission();

    if (!mediaPermission?.granted) {
      requestMediaPermission();
    }

  }, []);


  // -------------------------------------------------------
  // CARGAR TFLITE
  // -------------------------------------------------------

  useEffect(() => {

    cargarModelo();

  }, []);


  const cargarModelo = async () => {

    try {

      setModelLoading(true);

      setError(null);


      const loadedModel =
        await loadTensorflowModel(
          require(
            './assets/models/face_detection_short_range.tflite'
          ),
          []
        );


      console.log(
        'TFLITE CARGADO'
      );


      console.log(
        'INPUTS:',
        loadedModel.inputs
      );


      console.log(
        'OUTPUTS:',
        loadedModel.outputs
      );


      setModel(
        loadedModel
      );


    } catch (e) {

      console.error(
        'ERROR TFLITE:',
        e
      );

      setError(
        'No se pudo cargar el modelo TFLite.'
      );

    } finally {

      setModelLoading(false);

    }

  };


  // -------------------------------------------------------
  // TOMAR FOTO
  // -------------------------------------------------------

  const tomarFoto = async () => {

    if (
      !camera ||
      !cameraReady ||
      !model ||
      processing
    ) {
      return;
    }


    try {

      setProcessing(true);

      setError(null);

      setFaces([]);


      const result =
        await camera.takePictureAsync({

          quality: 1,

        });


      if (!result?.uri) {

        throw new Error(
          'No se obtuvo la fotografía.'
        );

      }


      setPhoto(
        result.uri
      );


      // ---------------------------------------------------
      // REDIMENSIONAR FOTO A 128x128
      // ---------------------------------------------------

      const resized =
        await ImageManipulator.manipulateAsync(

          result.uri,

          [
            {
              resize: {
                width:
                  MODEL_INPUT_SIZE,

                height:
                  MODEL_INPUT_SIZE,
              },
            },
          ],

          {
            compress: 1,

            format:
              ImageManipulator.SaveFormat.JPEG,
          }

        );


      // ---------------------------------------------------
      // LEER JPEG
      // ---------------------------------------------------

      const response =
        await fetch(
          resized.uri
        );


      const buffer =
        await response.arrayBuffer();


      const rawImage =
        jpeg.decode(
          new Uint8Array(buffer),
          {
            useTArray: true,
          }
        );


      // ---------------------------------------------------
      // CONVERTIR RGB → FLOAT32 [-1,1]
      // ---------------------------------------------------

      const input =
        new Float32Array(
          MODEL_INPUT_SIZE *
          MODEL_INPUT_SIZE *
          3
        );


      let index = 0;


      for (
        let i = 0;
        i < rawImage.data.length;
        i += 4
      ) {

        const r =
          rawImage.data[i];

        const g =
          rawImage.data[i + 1];

        const b =
          rawImage.data[i + 2];


        input[index++] =
          (r / 127.5) - 1;


        input[index++] =
          (g / 127.5) - 1;


        input[index++] =
          (b / 127.5) - 1;

      }


      // ---------------------------------------------------
      // TFLITE
      // ---------------------------------------------------

      const outputs =
        await model.run([

          input.buffer,

        ]);


      console.log(
        'SALIDAS TFLITE:',
        outputs
      );


      // ---------------------------------------------------
      // LEER OUTPUTS
      // ---------------------------------------------------

      const rawBoxes =
        new Float32Array(
          outputs[0]
        );


      const rawScores =
        new Float32Array(
          outputs[1]
        );


      // ---------------------------------------------------
      // DECODIFICAR
      // ---------------------------------------------------

      const detections =
        decodeDetections(

          rawBoxes,

          rawScores,

          result.width,

          result.height

        );


      console.log(
        'ROSTROS:',
        detections
      );


      setFaces(
        detections
      );


      // ---------------------------------------------------
      // GUARDAR EN GALERÍA
      // ---------------------------------------------------

      if (
        mediaPermission?.granted
      ) {

        await MediaLibrary.saveToLibraryAsync(
          result.uri
        );

      }

    } catch (e) {

      console.error(
        'ERROR DETECTANDO:',
        e
      );


      setError(
        'Error procesando la fotografía.'
      );

    } finally {

      setProcessing(false);

    }

  };


  // -------------------------------------------------------
  // PERMISOS
  // -------------------------------------------------------

  if (
    !cameraPermission?.granted
  ) {

    return (

      <View style={styles.center}>

        <Text style={styles.text}>
          Se necesita permiso para usar la cámara.
        </Text>

      </View>

    );

  }


  // -------------------------------------------------------
  // UI
  // -------------------------------------------------------

  return (

    <View style={styles.container}>

      {!photo ? (

        <CameraView

          ref={(ref) =>
            setCamera(ref)
          }

          style={styles.camera}

          facing="back"

          onCameraReady={() =>
            setCameraReady(true)
          }

        />

      ) : (

        <View style={styles.imageContainer}>

          <Image
            source={{ uri: photo }}
            style={styles.image}
          />


          {faces.map(
            (face, index) => (

              <View
                key={index}

                style={[
                  styles.faceBox,

                  {
                    left:
                      face.box.x,

                    top:
                      face.box.y,

                    width:
                      face.box.width,

                    height:
                      face.box.height,
                  },
                ]}
              />

            )
          )}

        </View>

      )}


      <View style={styles.bottom}>

        {modelLoading ? (

          <>
            <ActivityIndicator
              size="large"
              color="white"
            />

            <Text style={styles.text}>
              Cargando modelo TFLite...
            </Text>
          </>

        ) : model ? (

          <Text style={styles.ready}>
            TFLite listo
          </Text>

        ) : (

          <Text style={styles.error}>
            Error cargando TFLite
          </Text>

        )}


        {photo && !processing && (

          <Text style={styles.result}>

            {faces.length > 0

              ? `Rostro detectado: ${Math.round(
                  faces[0].score * 100
                )}%`

              : 'No se detectó ningún rostro'}

          </Text>

        )}


        {error && (

          <Text style={styles.error}>
            {error}
          </Text>

        )}


        <TouchableOpacity

          style={[
            styles.button,

            (
              !cameraReady ||
              !model ||
              processing
            ) &&
              styles.buttonDisabled,

          ]}

          disabled={
            !cameraReady ||
            !model ||
            processing
          }

          onPress={
            tomarFoto
          }

        >

          {processing ? (

            <ActivityIndicator
              color="white"
            />

          ) : (

            <Text
              style={styles.buttonText}
            >
              TOMAR FOTO
            </Text>

          )}

        </TouchableOpacity>


        {photo && !processing && (

          <TouchableOpacity

            style={styles.secondaryButton}

            onPress={() => {

              setPhoto(null);

              setFaces([]);

              setError(null);

            }}

          >

            <Text
              style={styles.buttonText}
            >
              TOMAR OTRA
            </Text>

          </TouchableOpacity>

        )}

      </View>

    </View>

  );

}


// ---------------------------------------------------------
// ESTILOS
// ---------------------------------------------------------

const styles = StyleSheet.create({

  container: {

    flex: 1,

    backgroundColor: 'black',

  },


  camera: {

    flex: 1,

  },


  imageContainer: {

    flex: 1,

    position: 'relative',

  },


  image: {

    width: '100%',

    height: '100%',

    resizeMode: 'contain',

  },


  faceBox: {

    position: 'absolute',

    borderWidth: 3,

    borderColor: '#00ff00',

    backgroundColor:
      'rgba(0,255,0,0.08)',

  },


  bottom: {

    position: 'absolute',

    bottom: 0,

    left: 0,

    right: 0,

    alignItems: 'center',

    padding: 20,

    backgroundColor:
      'rgba(0,0,0,0.75)',

  },


  text: {

    color: 'white',

    fontSize: 17,

    textAlign: 'center',

    marginBottom: 10,

  },


  ready: {

    color: '#00ff00',

    fontSize: 18,

    fontWeight: 'bold',

    marginBottom: 10,

  },


  result: {

    color: 'white',

    fontSize: 20,

    fontWeight: 'bold',

    marginBottom: 15,

  },


  error: {

    color: '#ff5555',

    fontSize: 16,

    textAlign: 'center',

    marginBottom: 10,

  },


  button: {

    backgroundColor: '#2563eb',

    paddingVertical: 15,

    paddingHorizontal: 35,

    borderRadius: 10,

    minWidth: 200,

    alignItems: 'center',

  },


  buttonDisabled: {

    opacity: 0.4,

  },


  secondaryButton: {

    marginTop: 10,

    paddingVertical: 12,

    paddingHorizontal: 30,

    borderRadius: 10,

    backgroundColor: '#444',

  },


  buttonText: {

    color: 'white',

    fontSize: 17,

    fontWeight: 'bold',

  },


  center: {

    flex: 1,

    justifyContent: 'center',

    alignItems: 'center',

    padding: 20,

  },

});