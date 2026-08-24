import { Stamp } from '../types/legend';
import { db } from '../lib/firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';

const PASSPORT_KEY = 'casa_leyendas_passport_v1';
const SCORE_KEY = 'casa_leyendas_score_v1';

export interface UserPassportData {
  stamps: Stamp[];
  totalScore: number;
  completedCount: number;
  lastUpdated: number;
}

export const loadLocalPassport = (): UserPassportData => {
  try {
    const raw = localStorage.getItem(PASSPORT_KEY);
    const scoreRaw = localStorage.getItem(SCORE_KEY);
    const stamps: Stamp[] = raw ? JSON.parse(raw) : [];
    const totalScore = scoreRaw ? parseInt(scoreRaw, 10) : 0;
    return {
      stamps,
      totalScore,
      completedCount: stamps.length,
      lastUpdated: Date.now()
    };
  } catch (e) {
    console.error('Error loading local passport:', e);
    return { stamps: [], totalScore: 0, completedCount: 0, lastUpdated: Date.now() };
  }
};

export const saveStamp = async (
  userId: string | null,
  stamp: Stamp
): Promise<UserPassportData> => {
  const current = loadLocalPassport();
  
  // Evitar duplicar sello de la misma leyenda
  const exists = current.stamps.some((s) => s.legendId === stamp.legendId);
  const updatedStamps = exists ? current.stamps : [...current.stamps, stamp];
  const updatedScore = exists ? current.totalScore : current.totalScore + stamp.pointsEarned;

  // Guardar en LocalStorage (Offline primero)
  localStorage.setItem(PASSPORT_KEY, JSON.stringify(updatedStamps));
  localStorage.setItem(SCORE_KEY, String(updatedScore));

  const result: UserPassportData = {
    stamps: updatedStamps,
    totalScore: updatedScore,
    completedCount: updatedStamps.length,
    lastUpdated: Date.now()
  };

  // Sincronizar en la nube si hay usuario conectado
  if (userId) {
    try {
      const userRef = doc(db, 'users', userId);
      await setDoc(userRef, {
        stamps: updatedStamps,
        totalScore: updatedScore,
        lastUpdated: Date.now()
      }, { merge: true });
    } catch (err) {
      console.warn('No se pudo sincronizar el pasaporte en la nube (modo offline activo):', err);
    }
  }

  return result;
};

export const syncRemotePassport = async (userId: string): Promise<UserPassportData> => {
  const local = loadLocalPassport();
  try {
    const userRef = doc(db, 'users', userId);
    const snap = await getDoc(userRef);
    if (snap.exists()) {
      const remoteData = snap.data();
      const remoteStamps: Stamp[] = remoteData.stamps || [];
      const remoteScore: number = remoteData.totalScore || 0;

      // Fusionar sellos locales y remotos
      const stampMap = new Map<string, Stamp>();
      [...local.stamps, ...remoteStamps].forEach((s) => stampMap.set(s.legendId, s));
      const mergedStamps = Array.from(stampMap.values());
      const mergedScore = Math.max(local.totalScore, remoteScore, mergedStamps.reduce((acc, s) => acc + (s.pointsEarned || 0), 0));

      localStorage.setItem(PASSPORT_KEY, JSON.stringify(mergedStamps));
      localStorage.setItem(SCORE_KEY, String(mergedScore));

      return {
        stamps: mergedStamps,
        totalScore: mergedScore,
        completedCount: mergedStamps.length,
        lastUpdated: Date.now()
      };
    }
  } catch (err) {
    console.warn('Fallo al sincronizar con Firestore:', err);
  }
  return local;
};
