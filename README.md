# NeuroSync

**Sincroniza tu mente, fortalece tus recuerdos.**

Aplicación web bilingüe de tarjetas de memoria (español / inglés), con repetición espaciada, accesibilidad, traducción y generación de mazos mediante IA.

## Arquitectura

- `index.html`: interfaz de usuario.
- `config.js`: configuración pública de Firebase Web y, opcionalmente, URL de la API.
- `server.js`: API Express; mantiene la clave privada de Anthropic fuera del navegador y verifica tokens Firebase si `FIREBASE_PROJECT_ID` está configurado.
- El servidor Express también sirve el frontend. En este despliegue `AI_API_BASE` queda vacío y la interfaz llama automáticamente a `/api/...` en el mismo dominio.

## Requisitos

- Node.js 20 o superior.
- Proyecto Firebase con una aplicación Web.
- Proveedor de inicio de sesión Google habilitado en Firebase Authentication.
- Clave API de Anthropic y acceso a un modelo disponible en tu cuenta.

## Configuración local

1. Instala Node.js 20+.
2. Copia `.env.example` a `.env`.
3. En [Firebase Console](https://console.firebase.google.com/):
   - Crea o selecciona un proyecto.
   - Registra una aplicación Web y copia `apiKey`, `authDomain`, `projectId` y `appId` en `config.js`.
   - En **Authentication → Sign-in method**, habilita **Google**.
   - En **Authentication → Settings → Authorized domains**, agrega `localhost` para pruebas y el dominio final al desplegar.
4. En `.env`, define `ANTHROPIC_API_KEY` y `FIREBASE_PROJECT_ID` con los valores reales. `FIREBASE_PROJECT_ID` debe coincidir con el proyecto Firebase.
5. Instala dependencias y ejecuta:

   ```bash
   npm install
   npm start
   ```

6. Abre `http://localhost:3000`. No abras `index.html` directamente como `file://`; Firebase Auth y las llamadas API requieren un servidor web.
7. Comprueba `http://localhost:3000/health`: debe responder `{"ok":true,"service":"neurosync-api"}`.

## Despliegue recomendado: Render

1. Sube este proyecto a un repositorio de GitHub.
2. En [Render](https://render.com/), crea un **Web Service** y conecta el repositorio.
3. Configura:
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
4. En las variables de entorno del servicio, configura:
   - `ANTHROPIC_API_KEY`: tu clave privada.
   - `FIREBASE_PROJECT_ID`: ID real de tu proyecto Firebase.
   - `CLAUDE_MODEL`: un ID de modelo actualmente disponible en tu cuenta de Anthropic.
   - `NODE_ENV=production` (opcional).
5. Despliega y abre la URL HTTPS que Render asigne.
6. Agrega ese dominio en Firebase Authentication → Authorized domains.
7. Prueba inicio de sesión, traducción, generación por tema y generación desde PDF/DOCX/TXT.

El plan gratuito y sus condiciones pueden cambiar; verifica los límites de Render y Anthropic antes de publicar para usuarios reales.

## Subir a GitHub paso a paso

1. Crea un repositorio nuevo en GitHub, por ejemplo `neurosync-memory-app`.
2. No subas `.env`, claves privadas, tokens ni credenciales de cuenta de servicio.
3. Desde una terminal dentro de esta carpeta:

   ```bash
   git init
   git add .
   git commit -m "Prepare NeuroSync app for deployment"
   git branch -M main
   git remote add origin https://github.com/TU_USUARIO/neurosync-memory-app.git
   git push -u origin main
   ```

4. En GitHub verifica que `.env` no esté en los archivos. `.gitignore` excluye este archivo.
5. Conecta el repo a Render siguiendo los pasos de arriba.

## Seguridad y limitaciones importantes

- `config.js` contiene la configuración de Firebase Web, que es pública por diseño; restringe los dominios y revisa cuotas/controles de abuso en Google Cloud.
- La clave de Anthropic solo debe existir en las variables de entorno del backend.
- Configurar `FIREBASE_PROJECT_ID` es importante: activa la validación de tokens para las rutas de IA. Sin esa variable, la API acepta solicitudes sin sesión.
- El progreso de los mazos sigue guardándose en `localStorage` por navegador/dispositivo; **todavía no se sincroniza entre dispositivos ni se almacena en la nube**. Google login no implica sincronización de datos. Para eso habría que integrar Firestore y reglas de seguridad.
- Los invitados pueden usar el contenido local; con la configuración segura recomendada, las rutas de IA exigen inicio de sesión Google.
- La generación de PDF se limita por el tamaño del archivo y los límites del proveedor. Los PDF escaneados pueden requerir OCR, que no está implementado.
- El nombre de modelo de Anthropic debe verificarse con los modelos habilitados en tu cuenta; si el modelo predeterminado no está disponible, define `CLAUDE_MODEL` con un ID válido.
- Antes de un lanzamiento público, añade pruebas funcionales, política de privacidad y condiciones de uso adecuadas para tu audiencia.

## Verificación básica

```bash
npm run check
```

La validación sintáctica no sustituye las pruebas de inicio de sesión y llamadas reales a la API con credenciales configuradas.
