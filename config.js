/*
 * Configuración pública del frontend.
 * Firebase Web config no es una contraseña; protege el proyecto con las
 * restricciones de dominios autorizados en Firebase/Google Cloud.
 */
window.NEUROSYNC_FIREBASE_CONFIG = {
  apiKey: "TU_API_KEY",
  authDomain: "TU_PROYECTO.firebaseapp.com",
  projectId: "TU_PROYECTO",
  appId: "TU_APP_ID"
};

// En despliegue recomendado (Express sirve también index.html), deja esto vacío.
// Si separas frontend y backend, coloca aquí la URL pública del backend, sin / final.
// window.NEUROSYNC_API_BASE = "https://tu-api.example.com";
