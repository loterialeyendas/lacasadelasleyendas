import { Stamp } from '../types/legend';
import { PlayerKeys, KeyType } from '../types/game';
import { db } from '../lib/firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';

const PASSPORT_KEY = 'casa_leyendas_passport_v1';
const SCORE_KEY = 'casa_leyendas_score_v1';
const KEYS_KEY = 'casa_leyendas_keys_v1';

export interface UserPassportData {
  stamps: Stamp[];
  totalScore: number;
  completedCount: number;
  keys: PlayerKeys;
  totalKeys: number;
  hasWon: boolean;
  lastUpdated: number;
}

export const extractKeysFromStamps = (stamps: Stamp[]): PlayerKeys => {
  const keys: PlayerKeys = {
    gold: false,
    jade: false,
    silver: false,
    obsidian: false
  };

  stamps.forEach((s) => {
    if (s.keyEarned) {
      keys[s.keyEarned] = true;
    }
  });

  return keys;
};

export const countKeys = (keys: PlayerKeys): number => {
  return [keys.gold, keys.jade, keys.silver, keys.obsidian].filter(Boolean).length;
};

export const loadLocalPassport = (): UserPassportData => {
  try {
    const raw = localStorage.getItem(PASSPORT_KEY);
    const scoreRaw = localStorage.getItem(SCORE_KEY);
    const keysRaw = localStorage.getItem(KEYS_KEY);
    
    const stamps: Stamp[] = raw ? JSON.parse(raw) : [];
    const totalScore = scoreRaw ? parseInt(scoreRaw, 10) : 0;
    
    let keys: PlayerKeys = keysRaw ? JSON.parse(keysRaw) : extractKeysFromStamps(stamps);
    
    // Asegurar que si hay sellos con llaves, se fusionen
    const stampKeys = extractKeysFromStamps(stamps);
    keys = {
      gold: keys.gold || stampKeys.gold,
      jade: keys.jade || stampKeys.jade,
      silver: keys.silver || stampKeys.silver,
      obsidian: keys.obsidian || stampKeys.obsidian,
    };

    const totalKeys = countKeys(keys);

    return {
      stamps,
      totalScore,
      completedCount: stamps.length,
      keys,
      totalKeys,
      hasWon: totalKeys >= 4,
      lastUpdated: Date.now()
    };
  } catch (e) {
    console.error('Error loading local passport:', e);
    const emptyKeys: PlayerKeys = { gold: false, jade: false, silver: false, obsidian: false };
    return {
      stamps: [],
      totalScore: 0,
      completedCount: 0,
      keys: emptyKeys,
      totalKeys: 0,
      hasWon: false,
      lastUpdated: Date.now()
    };
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

  // Actualizar llaves
  const updatedKeys: PlayerKeys = {
    ...current.keys,
    ...(stamp.keyEarned ? { [stamp.keyEarned]: true } : {})
  };
  const totalKeys = countKeys(updatedKeys);
  const hasWon = totalKeys >= 4;

  // Guardar en LocalStorage (Offline primero con salvaguarda de cuota)
  try {
    localStorage.setItem(PASSPORT_KEY, JSON.stringify(updatedStamps));
    localStorage.setItem(SCORE_KEY, String(updatedScore));
    localStorage.setItem(KEYS_KEY, JSON.stringify(updatedKeys));
  } catch (err) {
    console.warn('Almacenamiento local restringido o saturado:', err);
  }

  const result: UserPassportData = {
    stamps: updatedStamps,
    totalScore: updatedScore,
    completedCount: updatedStamps.length,
    keys: updatedKeys,
    totalKeys,
    hasWon,
    lastUpdated: Date.now()
  };

  // Sincronizar en la nube si hay usuario conectado
  if (userId) {
    try {
      const userRef = doc(db, 'users', userId);
      await setDoc(userRef, {
        stamps: updatedStamps,
        totalScore: updatedScore,
        keys: updatedKeys,
        totalKeys,
        hasWon,
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
      const remoteKeys: Partial<PlayerKeys> = remoteData.keys || {};

      // Fusionar sellos locales y remotos
      const stampMap = new Map<string, Stamp>();
      [...local.stamps, ...remoteStamps].forEach((s) => stampMap.set(s.legendId, s));
      const mergedStamps = Array.from(stampMap.values());
      const mergedScore = Math.max(local.totalScore, remoteScore, mergedStamps.reduce((acc, s) => acc + (s.pointsEarned || 0), 0));

      const stampKeys = extractKeysFromStamps(mergedStamps);
      const mergedKeys: PlayerKeys = {
        gold: Boolean(local.keys.gold || remoteKeys.gold || stampKeys.gold),
        jade: Boolean(local.keys.jade || remoteKeys.jade || stampKeys.jade),
        silver: Boolean(local.keys.silver || remoteKeys.silver || stampKeys.silver),
        obsidian: Boolean(local.keys.obsidian || remoteKeys.obsidian || stampKeys.obsidian),
      };
      const totalKeys = countKeys(mergedKeys);

      localStorage.setItem(PASSPORT_KEY, JSON.stringify(mergedStamps));
      localStorage.setItem(SCORE_KEY, String(mergedScore));
      localStorage.setItem(KEYS_KEY, JSON.stringify(mergedKeys));

      return {
        stamps: mergedStamps,
        totalScore: mergedScore,
        completedCount: mergedStamps.length,
        keys: mergedKeys,
        totalKeys,
        hasWon: totalKeys >= 4,
        lastUpdated: Date.now()
      };
    }
  } catch (err) {
    console.warn('Fallo al sincronizar con Firestore:', err);
  }
  return local;
};

