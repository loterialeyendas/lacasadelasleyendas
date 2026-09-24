/**
 * Utilidades para procesamiento, redimensionamiento y compresión adaptativa de imágenes
 * en el navegador antes de almacenar en Firestore / LocalStorage.
 * 
 * Protege contra el límite estricto de 1,048,576 bytes por documento en Firestore.
 */

export interface ImageOptimizationOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number; // 0.1 a 1.0
  format?: 'image/webp' | 'image/jpeg' | 'image/png';
  maxSizeBytes?: number; // Límite máximo en bytes (ej: 120 KB para portadas, 60 KB para fichas)
}

/**
 * Estima el peso aproximado en bytes de una cadena DataURL / Base64.
 */
export function estimateDataUrlSizeBytes(dataUrl: string): number {
  if (!dataUrl) return 0;
  const base64Part = dataUrl.split(',')[1] || dataUrl;
  return Math.round((base64Part.length * 3) / 4);
}

/**
 * Formatea bytes en formato legible (KB, MB).
 */
export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

/**
 * Convierte un archivo File de imagen a un DataURL comprimido y optimizado,
 * aplicando compresión adaptativa si excede el tamaño máximo permitido.
 */
export async function optimizeImageFile(
  file: File,
  options: ImageOptimizationOptions = {}
): Promise<string> {
  const {
    maxWidth = 1000,
    maxHeight = 1000,
    quality = 0.8,
    format = 'image/webp',
    maxSizeBytes = 120 * 1024 // 120 KB por defecto para proteger el límite de Firestore
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

        const tryExport = (exportQuality: number): string => {
          try {
            return canvas.toDataURL(format, exportQuality);
          } catch {
            try {
              return canvas.toDataURL('image/jpeg', exportQuality);
            } catch {
              return (e.target?.result as string) || '';
            }
          }
        };

        let currentQuality = quality;
        let dataUrl = tryExport(currentQuality);
        let currentSize = estimateDataUrlSizeBytes(dataUrl);

        // Compresión adaptativa si excede el límite máximo de bytes
        let attempts = 0;
        while (currentSize > maxSizeBytes && attempts < 3) {
          attempts++;
          currentQuality = Math.max(0.45, currentQuality - 0.15);
          
          // Si con menor calidad aún no alcanza, reducir dimensiones un 20%
          if (attempts >= 2) {
            canvas.width = Math.round(canvas.width * 0.8);
            canvas.height = Math.round(canvas.height * 0.8);
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          }
          
          dataUrl = tryExport(currentQuality);
          currentSize = estimateDataUrlSizeBytes(dataUrl);
        }

        resolve(dataUrl);
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
