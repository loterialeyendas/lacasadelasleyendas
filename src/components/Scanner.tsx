import React, { useEffect, useRef, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { Camera, AlertCircle } from 'lucide-react';
import { Button } from './Theme';

interface ScannerProps {
  onScan: (data: string) => void;
  onCancel: () => void;
}

export const Scanner: React.FC<ScannerProps> = ({ onScan, onCancel }) => {
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const containerId = 'qr-reader-container';

  useEffect(() => {
    let isMounted = true;

    const startScanner = async () => {
      try {
        const html5QrCode = new Html5Qrcode(containerId);
        scannerRef.current = html5QrCode;

        const config = {
          fps: 12,
          qrbox: { width: 240, height: 240 },
          aspectRatio: 1.0
        };

        await html5QrCode.start(
          { facingMode: 'environment' },
          config,
          (decodedText) => {
            if (!isMounted) return;
            // Detener la cámara inmediatamente después del escaneo exitoso
            html5QrCode.stop().then(() => {
              onScan(decodedText);
            }).catch(() => {
              onScan(decodedText);
            });
          },
          () => {
            // Frame scan status ignorado para no saturar logs
          }
        );

        if (isMounted) {
          setIsInitializing(false);
        }
      } catch (err: any) {
        if (!isMounted) return;
        console.error('Error starting camera scanner:', err);
        setCameraError(
          'No se pudo acceder a la cámara. Por favor permite los permisos de cámara en tu navegador para escanear las tarjetas QR.'
        );
        setIsInitializing(false);
      }
    };

    startScanner();

    return () => {
      isMounted = false;
      if (scannerRef.current && scannerRef.current.isScanning) {
        scannerRef.current
          .stop()
          .catch((e) => console.warn('Scanner stop error:', e));
      }
    };
  }, [onScan]);

  return (
    <div className="w-full flex flex-col items-center bg-[#141210] rounded-2xl overflow-hidden border border-gold/30">
      {/* Contenedor del video */}
      <div className="relative w-full min-h-[300px] flex items-center justify-center bg-[#0d0b07]">
        <div id={containerId} className="w-full max-w-[320px]" />

        {isInitializing && !cameraError && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#0d0b07]/95 text-candle gap-2 z-10">
            <Camera size={32} className="text-gold animate-bounce" />
            <span className="text-xs font-display">Invocando el lente místico...</span>
          </div>
        )}

        {cameraError && (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center bg-[#0d0b07]/95 text-candle gap-3 z-10">
            <AlertCircle size={36} className="text-red-400" />
            <p className="text-xs text-candle/90 font-serif italic">{cameraError}</p>
          </div>
        )}
      </div>

      <div className="p-4 w-full flex justify-center bg-[#0d0b07] border-t border-gold/10">
        <Button variant="outline" size="sm" onClick={onCancel} className="text-xs">
          Cerrar Cámara
        </Button>
      </div>

      <style>{`
        #${containerId} video {
          border-radius: 12px;
          object-fit: cover !important;
        }
      `}</style>
    </div>
  );
};
