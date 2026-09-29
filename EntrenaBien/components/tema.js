export const colores = {
  fondo: '#0F2B26', // pino
  superficie: '#17403A', // bosque
  linea: '#2A5A52',
  texto: '#F4EBD9', // arena
  textoSuave: '#9DB8AE',
  acento: '#FF6B4A', // brasa
  sobreAcento: '#0F2B26',
  exito: '#8FD3A0',
  peligro: '#FF8A80',
};

// 4200 -> "4,200"
export const formatear = (n) => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ',');