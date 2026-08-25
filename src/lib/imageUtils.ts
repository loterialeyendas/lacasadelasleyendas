/**
 * Utilidades para procesamiento, redimensionamiento y compresión de imágenes
 * en el navegador antes de almacenar en Firestore / LocalStorage.
 */

export interface ImageOptimizationOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number; // 0.1 a 1.0
  format?: 'image/webp' | 'image/jpeg' | 'image/png';
}

/**
 * Convierte un archivo File de imagen a un DataURL comprimido y optimizado.
 */
export async function optimizeImageFile(
  file: File,
  options: ImageOptimizationOptions = {}
): Promise<string> {
  const {
    maxWidth = 1200,
    maxHeight = 1200,
    quality = 0.85,
    format = 'image/webp'
  } = options;

  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        let { width, height } = img;

        // Calcular nuevas dimensiones conservando la relación de aspecto
        if (width > maxWidth || height > maxHeight) {
          const ratio = Math.min(maxWidth / width, maxHeight / height);
          width = Math.round(width * ratio);
          height = Math.round(height * ratio);
        }

        // Crear canvas para el redibujado y compresión
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(e.target?.result as string);
          return;
        }

        // Suavizado de imagen de alta calidad
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, width, height);

        // Exportar a WebP (con fallback a JPEG si el navegador no soporta webp export)
        try {
          const dataUrl = canvas.toDataURL(format, quality);
          resolve(dataUrl);
        } catch {
          try {
            const dataUrlJpeg = canvas.toDataURL('image/jpeg', quality);
            resolve(dataUrlJpeg);
          } catch (err) {
            resolve(e.target?.result as string);
          }
        }
      };

      img.onerror = () => {
        reject(new Error('No se pudo procesar la imagen seleccionada.'));
      };

      img.src = e.target?.result as string;
    };

    reader.onerror = () => {
      reject(new Error('Error al leer el archivo de imagen.'));
    };

    reader.readAsDataURL(file);
  });
}
