---
name: deploy-production
description: Procedimiento de verificación, compilación y despliegue a producción de la aplicación Casa de las Leyendas en Firebase Hosting.
---

# Runbook de Despliegue a Producción

Este skill define los pasos exactos para compilar y publicar la aplicación web de La Casa de las Leyendas en producción.

## 1. Verificación Previa

Antes de compilar, valida que no existan errores de tipos o sintaxis en TypeScript:

```bash
npm run lint
```

## 2. Compilación del Bundle de Producción

Ejecuta el build de Vite:

```bash
npm run build
```

Esto generará la carpeta optimizada `dist/` con todos los assets minificados.

## 3. Verificación Local del Build

Para probar el comportamiento idéntico a producción localmente:

```bash
npm run preview
```

## 4. Despliegue a Firebase Hosting

Si tienes la CLI de Firebase autenticada (`firebase-tools`), ejecuta:

```bash
firebase deploy --only hosting
```

O para desplegar también las reglas de seguridad de Firestore:

```bash
firebase deploy
```
