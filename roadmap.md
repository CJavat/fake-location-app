# 🗺️ Roadmap de Producción: Fake GPS App (Expo + TypeScript + Mapbox)

Este documento detalla la planificación, arquitectura, objetivos técnicos y fechas límite para el desarrollo de la aplicación de simulación de ubicación en Android.

---

## 📦 Stack Tecnológico y Dependencias

| Componente       | Tecnología / Paquete             | Propósito                                                       |
| :--------------- | :------------------------------- | :-------------------------------------------------------------- |
| **Framework**    | Expo (SDK 51+)                   | Desarrollo rápido con flujos nativos dinámicos (`Prebuild`).    |
| **Lenguaje**     | TypeScript                       | Tipado estricto para coordenadas, respuestas de API y estados.  |
| **Mapas**        | `@rnmapbox/maps`                 | Interfaz de mapa interactiva (Vectorial, fluida y moderna).     |
| **Mock Engine**  | Custom Native Module / Plugin    | Inyección nativa en el `LocationManager` de Android.            |
| **Background**   | `expo-task-manager` / Foreground | Mantener el envío constante de coordenadas en segundo plano.    |
| **Persistencia** | `react-native-mmkv`              | Almacenamiento ultra rápido de coordenadas favoritas y estados. |

---

## 📅 Cronograma y Entregables Técnicos

### 📌 Hito 1: Cimientos de la App y Configuración Nativa _(TERMINADO)_

> **Fecha Límite:** 20 de julio de 2026

- **Inicialización limpia:** Crear el proyecto utilizando la plantilla base de TypeScript de Expo.
- **Configuración de Mapbox:**
  - Crear el archivo `.npmrc` en la raíz con el `MAPBOX_DOWNLOADS_TOKEN` para permitir la descarga del SDK nativo.
  - Configurar el Config Plugin de `@rnmapbox/maps` en `app.json`.
- **Inyección de Permisos (AndroidManifest):** Configurar los plugins en `app.json` para inyectar permisos clave:
  - `android.permission.ACCESS_MOCK_LOCATION` (Crucial para simular).
  - `android.permission.ACCESS_FINE_LOCATION` y `ACCESS_COARSE_LOCATION` (Lectura del mapa).
  - `android.permission.FOREGROUND_SERVICE` y `android.permission.FOREGROUND_SERVICE_LOCATION` (Requisito de Android 14+).
- **Compilación Inicial:** Generar de forma exitosa la primera build nativa local usando `npx expo run:android`.

---

### 📌 Hito 2: UI Profesional de Mapa y Búsqueda

> **Fecha Límite:** 25 de julio de 2026

- **Renderizado de Mapbox:** Integrar la vista de mapa optimizada para evitar fugas de memoria al mover la cámara.
- **Precisión de Selección:**
  - Implementar una "Mira" (_Crosshair_) fija en el centro del mapa. Las coordenadas se leerán del centro de la cámara en cada movimiento.
  - Crear un marcador dinámico en las coordenadas elegidas.
- **Buscador de Direcciones:** Integrar la API de Geocoding de Mapbox para buscar ubicaciones por texto (ej. "Torre Eiffel") y trasladar el mapa automáticamente.
- **Almacenamiento Local:** Integrar `react-native-mmkv` para guardar el historial de ubicaciones simuladas e iniciar la app siempre en el último punto configurado.
- **Implementación de Axios:** Implementar Axios para el manejo de las peticiones a _Mapbox_.

---

### 📌 Hito 3: El Núcleo del "Engaño" (Servicio Persistente)

> **Fecha Límite:** 30 de julio de 2026

- **Módulo Nativo de Simulación:** Implementar o adaptar el puente nativo Java/Kotlin que interactúa con el `LocationManager` para simular el proveedor de GPS (`GPS_PROVIDER`).
- **Bucle de Fondo Anti-Rebote:**
  - Configurar un servicio en primer plano (_Foreground Service_) que mantenga un hilo de ejecución continuo.
  - Programar el envío constante de coordenadas cada **500ms** para neutralizar el GPS real del teléfono y evitar saltos de ubicación en WhatsApp.
- **Notificación Persistente:** Diseñar la notificación obligatoria en el sistema Android que muestre que el servicio está activo e incluya un botón físico de "Detener".

---

### 📌 Hito 4: Pruebas de Estrés y Build de Producción

> **Fecha Límite:** 3 de agosto de 2026

- **Prueba de Integración Extrema:** Testear el comportamiento con WhatsApp (Ubicación en tiempo real por 15 y 60 minutos), Google Maps y Life360 para certificar que el bypass sea 100% efectivo.
- **Pantalla de Diagnóstico:** Diseñar una interfaz que valide si el usuario tiene:
  1.  Las Opciones de Desarrollador activadas.
  2.  Nuestra app seleccionada como la aplicación de ubicación simulada oficial.
- **Compilación Final (AAB):** Generar el paquete optimizado para tiendas (`.aab`) firmado y listo para producción mediante:
  ```bash
  npx expo run:android --variant release
  ```

---

## 🛠️ Arquitectura de Carpetas Propuesta

Para mantener el proyecto escalable y limpio, estructuraremos el código de la siguiente manera:

```text
/src
├── /components       # Botones, Mapa, Buscador, Modales
├── /hooks            # useMockLocation, useMapboxSearch
├── /services         # Lógica del Foreground Service y TaskManager
├── /store            # Estado global de la app (coordenadas, historial)
├── /types            # Definiciones estrictas de TypeScript (.d.ts)
└── /utils            # Formateadores de coordenadas, cálculos de distancia
```

---

## Funcionalidades por estructurar

1. Icono de buscador (mandar a otra screen o en la misma poder escribir la dirección)
2. Botón de favoritos
3. Pantalla de ubicaciones favoritas.
4. Botón de recientes (Ver las ubicaciones que recientemente se han buscado - Máximo 10 ubicaciones)
5. Pantalla de ayuda
6. Pantalla principal tendría estas cosas.
   - Header
     - Botón - para eliminar anuncios (Llevará a página de suscripción)
     - Botón - Chat de ayuda
     - Botón - Screen de tutorial
   - Main ()
     - Botón para ir a la screen de cambiar ubicación
     - Botón para ir a ubicaciones recientes
     - Botón para ir a ubicaciones favoritas
7. Joystick (para poder simular que el usuario va caminando).
8. Agregar simulador de caminata. Agregar _PuntoA_ al _PuntoB_ y se vaya moviendo el puntero.
