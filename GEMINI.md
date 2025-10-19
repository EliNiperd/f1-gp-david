# Contexto del Proyecto F1-GP-David

Este documento resume el contexto y las funcionalidades clave de la aplicación `f1-gp-david`, así como los cambios y mejoras implementados con la ayuda de Gemini.

## Propósito de la Aplicación

La aplicación `f1-gp-david` es una herramienta interactiva para visualizar y simular carreras de Fórmula 1. Permite a los usuarios seleccionar sesiones de carrera de la API de OpenF1, ver un listado de pilotos, y simular el progreso de la carrera con actualizaciones de posición, tipo de neumático y diferencias de tiempo.

## Tecnologías Clave

*   **Framework:** Next.js (React)
*   **Estilos:** Tailwind CSS
*   **Drag and Drop:** `@dnd-kit`
*   **API de Datos:** OpenF1 API (para datos de carreras, pilotos, vueltas, posiciones y stints)
*   **Gestión de Estado:** React Hooks (`useState`, `useEffect`, `useCallback`, `useMemo`)

## Funcionalidades Implementadas

### 1. Listado y Reordenamiento de Pilotos

*   **Visualización:** Los pilotos se muestran en un listado dividido en dos columnas (1-10 en la primera, 11-20 en la segunda).
*   **Drag and Drop:** Se implementó la funcionalidad de arrastrar y soltar (`@dnd-kit`) para permitir a los usuarios reordenar a los pilotos.
    *   **Comportamiento:** Al arrastrar un piloto, su posición numérica se actualiza dinámicamente para reflejar su nuevo lugar en la lista, manteniendo las posiciones fijas y solo moviendo el identificador del piloto (imagen).
    *   **Estrategia de Ordenamiento:** Se utiliza `rectSortingStrategy` de `@dnd-kit/sortable` para un manejo fluido del arrastre entre columnas.

### 2. Interfaz de Usuario Optimizada

*   **Encabezado Colapsable:** El encabezado de la aplicación se hizo colapsable para maximizar el espacio vertical disponible, especialmente útil en pantallas de escritorio para visualizar el listado completo de pilotos.
*   **Espaciado Ajustado:** Se redujeron los márgenes y paddings para optimizar el uso del espacio en pantalla.
*   **Mensaje de Pantalla Completa:** Se añadió un mensaje de ayuda sugiriendo el uso del modo de pantalla completa (con atajos para Windows y Mac) para una mejor experiencia de usuario.

### 3. Simulación de Carrera con Datos Dinámicos

*   **Selección de Sesión:** Los usuarios pueden seleccionar el año, la carrera y la sesión para cargar datos de la API de OpenF1.
*   **Actualización de Posiciones:** Durante la simulación, las posiciones de los pilotos se actualizan dinámicamente cada 10 segundos, reflejando los datos de la API.
*   **Visualización de Compuesto de Neumático:**
    *   Se integra el tipo de compuesto de neumático (SOFT, MEDIUM, HARD, INTERMEDIATE, WET) que utiliza cada piloto por vuelta.
    *   Se muestra como un **componente SVG dinámico** (ej. `TyreC4Soft`, `TyreC1Hard`) en lugar de un círculo de color, con un tamaño ajustado para el diseño.
    *   Se muestra el número de vueltas que se ha utilizado el compuesto entre paréntesis al lado del icono.
    *   **Lógica de Fallback:** Si no se encuentra el compuesto de neumático para una vuelta específica, se utiliza el último compuesto conocido para ese piloto.
*   **Visualización de Tiempos de Vuelta/Diferencias:**
    *   Para el piloto en primera posición, se muestra su tiempo de vuelta actual.
    *   Para los demás pilotos, se muestra la diferencia de tiempo entre su tiempo de vuelta actual y el tiempo de vuelta del piloto inmediatamente superior.
    *   **Formato:** Los tiempos se formatean como `MM:SS.mmm`, incluyendo un signo `+` o `-` para las diferencias.

## Problemas Resueltos Durante el Desarrollo

*   **Error 429 (Too Many Requests):** Se mitigó el límite de velocidad de la API de OpenF1 añadiendo pequeños retrasos entre las llamadas `fetch`.
*   **Error de Imagen `src`:** Se añadió una URL de imagen de fallback para `piloto.imagen` para evitar errores del componente `Image` de Next.js cuando la URL de la imagen del piloto está vacía.
*   **Errores de Compilación y Tipado:**
    *   Se corrigieron errores de compilación relacionados con la definición de tipos (`disabled is not defined`, `React is not defined`).
    *   Se resolvió el error `Export useOpenF1 doesn't exist` y la incompatibilidad de tipos `Type 'UniqueIdentifier' is not assignable to type 'number'` moviendo el hook `useOpenF1` y sus interfaces relacionadas a un archivo `lib/hooks.ts` separado.
    *   Se actualizó la interfaz `TyreData` para reflejar la estructura correcta de los datos de la API (`lap_start`, `lap_end` en lugar de `lap_number`).
*   **Consistencia de Posiciones:** Se aseguró que las posiciones de los pilotos fueran únicas y secuenciales durante la simulación, incluso si los datos de la API contenían posiciones duplicadas.
*   **Bucle Infinito de API Calls:** Se solucionó el problema de las llamadas excesivas a la API al inicio de la aplicación, memoizando las funciones del hook `useOpenF1` con `useCallback` y el objeto `api` con `useMemo` para asegurar su estabilidad entre renders.

## Problemas Actuales y Próximos Pasos

### 1. Comportamiento Incorrecto de la Simulación

*   **Posiciones Extrañas:** La simulación muestra posiciones de pilotos que no se corresponden con la lógica esperada, a menudo asignando valores inesperados.
*   **DNFs Prematuros:** Demasiados pilotos son marcados como "DNF" (Did Not Finish) al inicio de la simulación, dejando solo un pequeño subconjunto de pilotos activos (aproximadamente 3). Esto sugiere un problema en la lógica de determinación del estado del piloto o en la forma en que se procesan los datos de posición y vuelta.

**Plan de Acción:**
1.  **Revisar `useEffect` de Actualización de Posiciones:** Analizar la lógica dentro del `useEffect` que se encarga de actualizar las posiciones de los pilotos, prestando especial atención a:
    *   La determinación de `relevantPositions` y `latestPastTime` para asegurar que se están obteniendo los datos de posición correctos para cada `nextLapNumber`.
    *   La condición para marcar a un piloto como `DNF` (`!isStillLapping && !isStillInPositions`). Es probable que esta condición sea demasiado restrictiva o que las variables `isStillLapping` y `isStillInPositions` no se estén calculando correctamente.
    *   La lógica de ordenamiento final de los pilotos para asegurar que los pilotos activos y no eliminados se muestren correctamente.

## Próximos Pasos Potenciales

*   Implementar un mecanismo de caché más robusto para los datos de la API para reducir las llamadas y mejorar el rendimiento.
*   Añadir más detalles visuales o telemetría a la simulación.
*   Mejorar la gestión de errores y la retroalimentación al usuario.

---
Este archivo `GEMINI.md` sirve como un punto de referencia para el estado actual y la funcionalidad de la aplicación.