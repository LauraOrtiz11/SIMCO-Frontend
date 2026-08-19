import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

//  Instancia principal
export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: false,
  timeout: 10000,
});

// ==============================
//  INTERCEPTORS
// ==============================

api.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => Promise.reject(error),
);

//  Response (manejo global de errores)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    //  Error sin respuesta
    if (!error.response) {
      console.error(' Error de red o servidor no disponible');
      return Promise.reject({
        message: 'Error de conexión con el servidor',
      });
    }
    const { data } = error.response;
    return Promise.reject(data);
  },
);
