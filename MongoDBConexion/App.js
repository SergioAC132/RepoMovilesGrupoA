import React, { useState } from 'react';

import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Image,
  ActivityIndicator,
  TextInput,
  TouchableOpacity,
  Modal,
  ScrollView,
} from 'react-native';

import { StatusBar } from 'expo-status-bar';

const API_URL = 'http://localhost:4000';

export default function App() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loggedIn, setLoggedIn] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState('');

  const [movies, setMovies] = useState([]);
  const [loadingMovies, setLoadingMovies] = useState(false);

  const [selectedMovie, setSelectedMovie] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const handleLogin = async () => {
    setLoginError('');

    if (!username || !password) {
      setLoginError('Ingresa usuario y contraseña');
      return;
    }

    setLoginLoading(true);

    try {
      const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.mensaje || 'Error iniciando sesión'
        );
      }

      if (data.success) {
        setLoggedIn(true);
        await loadMovies();
      } else {
        setLoginError(
          data.mensaje || 'Error iniciando sesión'
        );
      }
    } catch (error) {
      console.log('Error en login:', error);

      setLoginError(
        error.message || 'No se pudo conectar con el servidor'
      );
    } finally {
      setLoginLoading(false);
    }
  };

  const loadMovies = async () => {
    setLoadingMovies(true);

    try {
      const response = await fetch(`${API_URL}/movies`);

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.mensaje || 'Error obteniendo películas'
        );
      }

      setMovies(data);
    } catch (error) {
      console.log(
        'Error obteniendo películas:',
        error
      );
    } finally {
      setLoadingMovies(false);
    }
  };

  const openMovie = (movie) => {
    setSelectedMovie(movie);
    setModalVisible(true);
  };

  const closeMovie = () => {
    setModalVisible(false);
    setSelectedMovie(null);
  };

  if (!loggedIn) {
    return (
      <View style={styles.loginContainer}>
        <StatusBar style="dark" />

        <Text style={styles.loginTitle}>
          🎬 Movie App
        </Text>

        <Text style={styles.loginSubtitle}>
          Inicia sesión para ver las películas
        </Text>

        <TextInput
          style={styles.input}
          placeholder="Usuario"
          value={username}
          onChangeText={setUsername}
          autoCapitalize="none"
          autoCorrect={false}
          editable={!loginLoading}
        />

        <TextInput
          style={styles.input}
          placeholder="Contraseña"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          editable={!loginLoading}
          onSubmitEditing={handleLogin}
        />

        {loginError ? (
          <Text style={styles.error}>
            {loginError}
          </Text>
        ) : null}

        <TouchableOpacity
          style={styles.loginButton}
          onPress={handleLogin}
          disabled={loginLoading}
        >
          {loginLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.loginButtonText}>
              Iniciar sesión
            </Text>
          )}
        </TouchableOpacity>
      </View>
    );
  }

  if (loadingMovies) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator
          size="large"
          color="#007AFF"
        />

        <Text style={styles.loadingText}>
          Cargando películas...
        </Text>
      </View>
    );
  }

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => openMovie(item)}
      activeOpacity={0.8}
    >
      {item.poster ? (
        <Image
          source={{ uri: item.poster }}
          style={styles.poster}
        />
      ) : (
        <View style={styles.noPoster}>
          <Text>Sin imagen</Text>
        </View>
      )}

      <View style={styles.info}>
        <Text
          style={styles.title}
          numberOfLines={2}
        >
          {item.title || 'Sin título'}
        </Text>

        {item.year ? (
          <Text style={styles.year}>
            {item.year}
          </Text>
        ) : null}

        {item.genres?.length > 0 ? (
          <Text
            style={styles.genres}
            numberOfLines={1}
          >
            {item.genres.join(', ')}
          </Text>
        ) : null}

        <Text
          style={styles.plot}
          numberOfLines={4}
        >
          {item.fullplot ||
            item.plot ||
            'Sin descripción'}
        </Text>

        <Text style={styles.more}>
          Toca para ver detalles →
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />

      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>
            🎬 Películas
          </Text>

          <Text style={styles.headerSubtitle}>
            {movies.length} películas
          </Text>
        </View>

        <TouchableOpacity
          style={styles.logoutButton}
          onPress={() => {
            setLoggedIn(false);
            setMovies([]);
            setUsername('');
            setPassword('');
          }}
        >
          <Text style={styles.logoutText}>
            Salir
          </Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={movies}
        keyExtractor={(item, index) =>
          item._id?.toString() ||
          index.toString()
        }
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />

      <Modal
        visible={modalVisible}
        animationType="slide"
        onRequestClose={closeMovie}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text
              style={styles.modalHeaderTitle}
              numberOfLines={1}
            >
              Detalles de la película
            </Text>

            <TouchableOpacity
              onPress={closeMovie}
            >
              <Text style={styles.closeButton}>
                ✕
              </Text>
            </TouchableOpacity>
          </View>

          {selectedMovie && (
            <ScrollView
              contentContainerStyle={
                styles.modalContent
              }
              showsVerticalScrollIndicator={false}
            >
              {selectedMovie.poster ? (
                <Image
                  source={{
                    uri: selectedMovie.poster,
                  }}
                  style={styles.largePoster}
                />
              ) : (
                <View
                  style={styles.largeNoPoster}
                >
                  <Text>
                    Sin imagen
                  </Text>
                </View>
              )}

              <Text style={styles.modalTitle}>
                {selectedMovie.title ||
                  'Sin título'}
              </Text>

              {selectedMovie.year ? (
                <Text style={styles.detail}>
                  <Text style={styles.label}>
                    Año:{' '}
                  </Text>
                  {selectedMovie.year}
                </Text>
              ) : null}

              {selectedMovie.runtime ? (
                <Text style={styles.detail}>
                  <Text style={styles.label}>
                    Duración:{' '}
                  </Text>
                  {selectedMovie.runtime} minutos
                </Text>
              ) : null}

              {selectedMovie.rated ? (
                <Text style={styles.detail}>
                  <Text style={styles.label}>
                    Clasificación:{' '}
                  </Text>
                  {selectedMovie.rated}
                </Text>
              ) : null}

              {selectedMovie.genres?.length > 0 ? (
                <Text style={styles.detail}>
                  <Text style={styles.label}>
                    Géneros:{' '}
                  </Text>
                  {selectedMovie.genres.join(', ')}
                </Text>
              ) : null}

              {selectedMovie.directors?.length > 0 ? (
                <Text style={styles.detail}>
                  <Text style={styles.label}>
                    Director:{' '}
                  </Text>
                  {selectedMovie.directors.join(', ')}
                </Text>
              ) : null}

              {selectedMovie.cast?.length > 0 ? (
                <Text style={styles.detail}>
                  <Text style={styles.label}>
                    Reparto:{' '}
                  </Text>
                  {selectedMovie.cast.join(', ')}
                </Text>
              ) : null}

              {selectedMovie.imdb ? (
                <View style={styles.ratingBox}>
                  <Text style={styles.ratingTitle}>
                    IMDb
                  </Text>

                  <Text style={styles.rating}>
                    ⭐ {selectedMovie.imdb.rating ?? 'N/A'}
                  </Text>

                  <Text>
                    Votos:{' '}
                    {selectedMovie.imdb.votes ?? 'N/A'}
                  </Text>
                </View>
              ) : null}

              <Text style={styles.sectionTitle}>
                Sinopsis
              </Text>

              <Text style={styles.fullPlot}>
                {selectedMovie.fullplot ||
                  selectedMovie.plot ||
                  'Sin descripción disponible.'}
              </Text>

              {selectedMovie.languages?.length > 0 ? (
                <>
                  <Text style={styles.sectionTitle}>
                    Idiomas
                  </Text>

                  <Text style={styles.fullPlot}>
                    {selectedMovie.languages.join(', ')}
                  </Text>
                </>
              ) : null}

              {selectedMovie.countries?.length > 0 ? (
                <>
                  <Text style={styles.sectionTitle}>
                    Países
                  </Text>

                  <Text style={styles.fullPlot}>
                    {selectedMovie.countries.join(', ')}
                  </Text>
                </>
              ) : null}

              {selectedMovie.writers?.length > 0 ? (
                <>
                  <Text style={styles.sectionTitle}>
                    Escritores
                  </Text>

                  <Text style={styles.fullPlot}>
                    {selectedMovie.writers.join(', ')}
                  </Text>
                </>
              ) : null}

              {selectedMovie.awards ? (
                <>
                  <Text style={styles.sectionTitle}>
                    Premios
                  </Text>

                  <Text style={styles.fullPlot}>
                    {selectedMovie.awards.text ||
                      JSON.stringify(
                        selectedMovie.awards
                      )}
                  </Text>
                </>
              ) : null}
            </ScrollView>
          )}
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },

  list: {
    paddingVertical: 10,
    paddingBottom: 30,
  },

  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },

  loadingText: {
    marginTop: 12,
    color: '#555',
  },

  loginContainer: {
    flex: 1,
    justifyContent: 'center',
    padding: 25,
    backgroundColor: '#fff',
  },

  loginTitle: {
    fontSize: 34,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },

  loginSubtitle: {
    textAlign: 'center',
    color: '#777',
    fontSize: 16,
    marginBottom: 30,
  },

  input: {
    height: 52,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 15,
    fontSize: 16,
    backgroundColor: '#fafafa',
  },

  loginButton: {
    height: 52,
    backgroundColor: '#007AFF',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 5,
  },

  loginButtonText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: 'bold',
  },

  error: {
    color: '#d00',
    textAlign: 'center',
    marginBottom: 15,
  },

  header: {
    paddingHorizontal: 15,
    paddingTop: 15,
    paddingBottom: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
  },

  headerSubtitle: {
    color: '#777',
    marginTop: 3,
  },

  logoutButton: {
    backgroundColor: '#f2f2f2',
    paddingHorizontal: 15,
    paddingVertical: 9,
    borderRadius: 8,
  },

  logoutText: {
    color: '#d00000',
    fontWeight: 'bold',
  },

  card: {
    flexDirection: 'row',
    padding: 10,
    marginHorizontal: 10,
    marginVertical: 6,
    backgroundColor: '#f9f9f9',
    borderRadius: 12,
    elevation: 2,
  },

  poster: {
    width: 80,
    height: 120,
    borderRadius: 10,
    backgroundColor: '#ddd',
  },

  noPoster: {
    width: 80,
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ddd',
    borderRadius: 10,
  },

  info: {
    flex: 1,
    marginLeft: 12,
  },

  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },

  year: {
    color: '#007AFF',
    fontWeight: 'bold',
    marginBottom: 5,
  },

  genres: {
    color: '#777',
    fontSize: 12,
    marginBottom: 5,
  },

  plot: {
    fontSize: 13,
    lineHeight: 18,
    color: '#555',
  },

  more: {
    marginTop: 8,
    color: '#007AFF',
    fontSize: 12,
    fontWeight: 'bold',
  },

  modalContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },

  modalHeader: {
    height: 65,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },

  modalHeaderTitle: {
    fontSize: 19,
    fontWeight: 'bold',
    flex: 1,
  },

  closeButton: {
    fontSize: 28,
    color: '#333',
    padding: 5,
  },

  modalContent: {
    padding: 20,
    paddingBottom: 50,
  },

  largePoster: {
    width: '100%',
    height: 430,
    resizeMode: 'contain',
    borderRadius: 12,
    marginBottom: 20,
    backgroundColor: '#eee',
  },

  largeNoPoster: {
    width: '100%',
    height: 300,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ddd',
    borderRadius: 12,
    marginBottom: 20,
  },

  modalTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 15,
  },

  detail: {
    fontSize: 15,
    marginBottom: 9,
    color: '#444',
  },

  label: {
    fontWeight: 'bold',
    color: '#111',
  },

  ratingBox: {
    backgroundColor: '#f5f5f5',
    padding: 15,
    borderRadius: 10,
    marginTop: 10,
  },

  ratingTitle: {
    color: '#777',
    fontSize: 14,
  },

  rating: {
    fontSize: 25,
    fontWeight: 'bold',
    marginVertical: 5,
  },

  sectionTitle: {
    fontSize: 21,
    fontWeight: 'bold',
    marginTop: 22,
    marginBottom: 8,
  },

  fullPlot: {
    fontSize: 16,
    lineHeight: 25,
    color: '#444',
  },
});
