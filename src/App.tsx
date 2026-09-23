import React, { useState, useEffect, useRef, Suspense, lazy } from 'react';
import { AnimatePresence } from 'motion/react';
import { auth } from './lib/firebase';
import { onAuthStateChanged, signOut, User as FirebaseUser } from 'firebase/auth';

import { Legend, Stamp } from './types/legend';
import { GameRoom, KeyType } from './types/game';
import { LEYENDAS_DATA, getLegendById, parseQRData } from './services/legendService';
import { loadLocalPassport, saveStamp, syncRemotePassport, UserPassportData } from './services/passportService';
import { 
  createGameRoom, 
  joinGameRoom, 
  subscribeToRoom, 
  startRoomGame,
  finishRoomGame,
  leaveGameRoom,
  updatePlayerScore 
} from './services/roomService';
import { sound } from './lib/audio';

// Vistas y Componentes base (críticos para el primer render)
import { LandingPageView } from './views/LandingPageView';
import { Navbar } from './components/Navbar';
import { MysticLoader } from './components/Theme';
import { KeyUnlockModal } from './components/KeyUnlockModal';

// Vistas y Módulos cargados bajo demanda (code-splitting)
const Login = lazy(() => import('./components/Login').then((m) => ({ default: m.Login })));
const WelcomeView = lazy(() => import('./views/WelcomeView').then((m) => ({ default: m.WelcomeView })));
const ExplorerView = lazy(() => import('./views/ExplorerView').then((m) => ({ default: m.ExplorerView })));
const ScannerView = lazy(() => import('./views/ScannerView').then((m) => ({ default: m.ScannerView })));
const JoinRoomView = lazy(() => import('./views/JoinRoomView').then((m) => ({ default: m.JoinRoomView })));
const LobbyView = lazy(() => import('./views/LobbyView').then((m) => ({ default: m.LobbyView })));
const GameRoomView = lazy(() => import('./views/GameRoomView').then((m) => ({ default: m.GameRoomView })));
const TriviaModule = lazy(() => import('./views/modules/TriviaModule').then((m) => ({ default: m.TriviaModule })));
const CharacterGuessModule = lazy(() => import('./views/modules/CharacterGuessModule').then((m) => ({ default: m.CharacterGuessModule })));
const MimeChallengeModule = lazy(() => import('./views/modules/MimeChallengeModule').then((m) => ({ default: m.MimeChallengeModule })));
const SocialChallengeModule = lazy(() => import('./views/modules/SocialChallengeModule').then((m) => ({ default: m.SocialChallengeModule })));
const StoryApparitionModule = lazy(() => import('./views/modules/StoryApparitionModule').then((m) => ({ default: m.StoryApparitionModule })));
const LiveTheaterView = lazy(() => import('./views/LiveTheaterView').then((m) => ({ default: m.LiveTheaterView })));
const MayordomoView = lazy(() => import('./views/MayordomoView').then((m) => ({ default: m.MayordomoView })));

type Screen = 
  | 'landing'
  | 'theater'
  | 'mayordomo'
  | 'login' 
  | 'welcome' 
  | 'explorer' 
  | 'scanner' 
  | 'join' 
  | 'lobby' 
  | 'game' 
  | 'module';

interface HistoryState {
  screen: Screen;
  legendId?: string;
}

export default function App() {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [screen, setScreen] = useState<Screen>('landing');
  const [previousScreen, setPreviousScreen] = useState<Screen>('welcome');

  // Estado del Pasaporte y Puntuación
  const [passport, setPassport] = useState<UserPassportData>(loadLocalPassport());

  // Estado de Sala Multijugador
  const [currentRoom, setCurrentRoom] = useState<GameRoom | null>(null);
  const [roomId, setRoomId] = useState<string>('');
  const [isRoomLoading, setIsRoomLoading] = useState(false);
  const [roomError, setRoomError] = useState('');

  // Código de sala pendiente (deep-link ?room=CODE, se consume tras iniciar sesión)
  const [pendingRoomCode, setPendingRoomCode] = useState<string>('');
  const [prefillJoinCode, setPrefillJoinCode] = useState<string>('');

  // Leyenda / Módulo Activo
  const [activeLegend, setActiveLegend] = useState<Legend | null>(null);

  // Modal de Llave Mística Conquistada
  const [unlockedKeyInfo, setUnlockedKeyInfo] = useState<{
    isOpen: boolean;
    keyType: KeyType;
    legendName: string;
    totalKeys: number;
    hasWon: boolean;
  } | null>(null);

  // Refs para acceder al estado más reciente desde listeners de larga vida
  const screenRef = useRef(screen);
  const roomIdRef = useRef(roomId);
  const userRef = useRef(user);
  useEffect(() => { screenRef.current = screen; }, [screen]);
  useEffect(() => { roomIdRef.current = roomId; }, [roomId]);
  useEffect(() => { userRef.current = user; }, [user]);

  // Navegación integrada con el historial del navegador y URLs limpias (/juego, /rutadeleyendas, /mayordomo, /)
  const navigate = (to: Screen, legend?: Legend) => {
    setActiveLegend(to === 'module' && legend ? legend : null);
    setScreen(to);
    const state: HistoryState = {
      screen: to,
      legendId: to === 'module' ? legend?.id : undefined
    };

    let targetUrl = '/';
    if (to === 'theater') {
      targetUrl = '/rutadeleyendas';
    } else if (to === 'mayordomo') {
      targetUrl = '/mayordomo';
    } else if (to === 'landing') {
      targetUrl = '/';
    } else {
      // Pantallas del juego (login, welcome, lobby, join, explorer, scanner, module, game)
      targetUrl = '/juego';
    }

    window.history.pushState(state, '', targetUrl);
  };

  // Deep linking por URL directa (/juego, /rutadeleyendas, /mayordomo, ?legend=sombreron, ?room=ABC123)
  useEffect(() => {
    const rawPath = window.location.pathname.toLowerCase();
    const path = rawPath.replace(/\/+$/, ''); // eliminar trailing slash
    const params = new URLSearchParams(window.location.search);

    const isMayordomoPath = path === '/mayordomo' || path.includes('/mayordomo') || params.has('mayordomo');
    const isRutaDeLeyendas = 
      path === '/rutadeleyendas' || 
      path.includes('/rutadeleyendas') || 
      path === '/envivo' || 
      path.includes('/envivo') || 
      params.has('rutadeleyendas') || 
      params.has('envivo') || 
      params.has('teatro') || 
      params.has('live');
    const isJuegoPath = path === '/juego' || path.includes('/juego') || params.has('juego');
    const legendParam = params.get('legend') || params.get('id') || params.get('code');
    const roomParam = params.get('room');

    if (isMayordomoPath) {
      setScreen('mayordomo');
      window.history.replaceState({ screen: 'mayordomo' } satisfies HistoryState, '', '/mayordomo');
    } else if (isRutaDeLeyendas) {
      setScreen('theater');
      window.history.replaceState({ screen: 'theater' } satisfies HistoryState, '', '/rutadeleyendas');
    } else if (isJuegoPath) {
      if (roomParam) {
        setPendingRoomCode(roomParam.toUpperCase());
      }
      const initialScreen = userRef.current ? 'welcome' : 'login';
      setScreen(initialScreen);
      window.history.replaceState({ screen: initialScreen } satisfies HistoryState, '', '/juego');
    } else if (legendParam) {
      const found = parseQRData(legendParam);
      if (found) {
        setActiveLegend(found);
        setScreen('module');
        window.history.replaceState({ screen: 'module', legendId: found.id } satisfies HistoryState, '', '/juego');
      }
    } else if (roomParam) {
      setPendingRoomCode(roomParam.toUpperCase());
      const initialScreen = userRef.current ? 'welcome' : 'login';
      setScreen(initialScreen);
      window.history.replaceState({ screen: initialScreen } satisfies HistoryState, '', '/juego');
    }

    // Limpiar parámetros residuales de consulta manteniendo la ruta limpia
    if ((legendParam || roomParam || params.has('envivo') || params.has('rutadeleyendas')) && window.location.search) {
      const cleanPath = isRutaDeLeyendas ? '/rutadeleyendas' : (isMayordomoPath ? '/mayordomo' : (isJuegoPath ? '/juego' : '/'));
      window.history.replaceState(window.history.state, '', cleanPath);
    }
  }, []);

  // Escuchar Autenticación
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (u) => {
      setUser(u);
      if (u) {
        // Cargar pasaporte local y sincronizar con Firestore
        const data = await syncRemotePassport(u.uid);
        setPassport(data);

        // Si estaba en la pantalla de login dentro de /juego, pasar a welcome
        if (screenRef.current === 'login') {
          setScreen('welcome');
          window.history.replaceState({ screen: 'welcome' } satisfies HistoryState, '', '/juego');
        }
      }
    });

    return () => unsubscribe();
  }, []);

  // Botón atrás / gesto del navegador
  useEffect(() => {
    const onPopState = (e: PopStateEvent) => {
      const st = (e.state || {}) as HistoryState;
      const rawPath = window.location.pathname.toLowerCase().replace(/\/+$/, '');
      let target: Screen = st.screen ?? 'landing';

      if (!st.screen) {
        if (rawPath === '/rutadeleyendas' || rawPath.includes('/rutadeleyendas')) {
          target = 'theater';
        } else if (rawPath === '/mayordomo' || rawPath.includes('/mayordomo')) {
          target = 'mayordomo';
        } else if (rawPath === '/juego' || rawPath.includes('/juego')) {
          target = userRef.current ? 'welcome' : 'login';
        } else {
          target = 'landing';
        }
      }

      // Si estaba dentro de una sala y retrocede a una pantalla externa, abandonarla en limpio
      const wasInRoom = screenRef.current === 'lobby' || screenRef.current === 'game';
      const staysInRoomContext = ['scanner', 'module', 'game', 'lobby'].includes(target);
      if (wasInRoom && !staysInRoomContext && roomIdRef.current) {
        const code = roomIdRef.current;
        setRoomId('');
        setCurrentRoom(null);
        const uid = userRef.current?.uid;
        if (uid) {
          leaveGameRoom(code, uid).catch((err) =>
            console.warn('No se pudo abandonar la sala limpiamente:', err)
          );
        }
      }

      if (target === 'module') {
        const legend = st.legendId ? getLegendById(st.legendId) : undefined;
        if (!legend) {
          setScreen(userRef.current ? 'explorer' : 'welcome');
          return;
        }
        setActiveLegend(legend);
      } else {
        setActiveLegend(null);
      }
      setScreen(target);
    };

    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  // Unión automática a sala invitada (?room=CODE) cuando ya hay sesión
  useEffect(() => {
    if (!user || !pendingRoomCode || isRoomLoading) return;
    const code = pendingRoomCode;
    setPendingRoomCode('');
    void handleJoinRoom(code);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, pendingRoomCode]);

  // Suscripción a la sala: depende SOLO de roomId para no recrear el listener en cada cambio de pantalla
  useEffect(() => {
    if (!roomId) {
      setCurrentRoom(null);
      return;
    }

    const unsubscribe = subscribeToRoom(
      roomId,
      (room) => {
        if (!room) {
          setRoomError('La sala ya no está disponible');
          setCurrentRoom(null);
          setRoomId('');
          const cur = screenRef.current;
          if (cur === 'lobby' || cur === 'game' || cur === 'join') {
            navigate('welcome');
          }
          return;
        }
        setCurrentRoom(room);
      },
      (err) => {
        console.error('Room subscription error:', err);
        setRoomError('Error al sincronizar con la sala');
      }
    );

    return () => unsubscribe();
  }, [roomId]);

  // Transición automática lobby → partida cuando el anfitrión inicia el ritual
  useEffect(() => {
    if (currentRoom?.status === 'playing' && screen === 'lobby') {
      sound.playMysticChime();
      navigate('game');
    }
  }, [currentRoom?.status, screen]);

  // Manejo de Inicio desde la Landing
  const handleEnterFromLanding = () => {
    if (user) {
      navigate('welcome');
    } else {
      navigate('login');
    }
  };

  const handleEnterExplorerFromLanding = () => {
    if (user) {
      navigate('explorer');
    } else {
      navigate('login');
    }
  };

  // Manejo de Creación de Sala
  const handleCreateRoom = async () => {
    if (!user) return;
    setIsRoomLoading(true);
    setRoomError('');

    try {
      const newRoomId = await createGameRoom(user.uid, user.displayName || 'Anfitrión');
      setRoomId(newRoomId);
      navigate('lobby');
    } catch (err: any) {
      console.error(err);
      setRoomError('No se pudo crear la sala');
    } finally {
      setIsRoomLoading(false);
    }
  };

  // Manejo de Unión a Sala
  const handleJoinRoom = async (code: string) => {
    if (!user) return;
    setIsRoomLoading(true);
    setRoomError('');

    try {
      const res = await joinGameRoom(code, {
        id: user.uid,
        name: user.displayName || 'Explorador',
        points: 0,
        isHost: false,
        isReady: true,
        lastActive: Date.now()
      });

      if (!res.success) {
        setRoomError(res.error || 'No se pudo conectar a la sala');
        setPrefillJoinCode(code);
        navigate('join');
        return;
      }

      setPrefillJoinCode('');
      setRoomId(code.toUpperCase());
      navigate('lobby');
    } catch (err: any) {
      console.error(err);
      setRoomError('Error al conectarse a la sala');
      setPrefillJoinCode(code);
      navigate('join');
    } finally {
      setIsRoomLoading(false);
    }
  };

  // Iniciar Juego en Sala
  const handleStartGame = async () => {
    if (!roomId) return;
    await startRoomGame(roomId);
  };

  // Finalizar Partida (Anfitrión)
  const handleFinishGame = async () => {
    if (!roomId) return;
    try {
      await finishRoomGame(roomId);
    } catch (err) {
      console.warn('No se pudo finalizar la partida:', err);
    }
  };

  // Salir de Sala (limpia también al jugador en Firestore)
  const handleLeaveRoom = () => {
    sound.playClick();
    const code = roomId;
    setRoomId('');
    setCurrentRoom(null);
    setPendingRoomCode('');
    if (code && user) {
      leaveGameRoom(code, user.uid).catch((err) =>
        console.warn('No se pudo abandonar la sala limpiamente:', err)
      );
    }
    navigate('welcome');
  };

  // Abrir Escáner
  const handleOpenScanner = () => {
    setPreviousScreen(screen);
    navigate('scanner');
  };

  // Al Encontrar Leyenda por Escáner o Selección
  const handleLegendFound = (legend: Legend) => {
    navigate('module', legend);
  };

  // Completar Reto / Desafío y Ganar Llave Mística + Puntos
  const handleCompleteModule = async (pointsEarned: number) => {
    if (!activeLegend) return;

    const keyEarned: KeyType = activeLegend.keyReward || (
      activeLegend.category === 'social' ? 'obsidian' :
      activeLegend.category === 'mime' ? 'silver' :
      activeLegend.category === 'character' ? 'jade' : 'gold'
    );

    // Crear Sello con Llave
    const stamp: Stamp = {
      legendId: activeLegend.id,
      legendName: activeLegend.name,
      unlockedAt: Date.now(),
      pointsEarned,
      keyEarned,
      mode: currentRoom ? 'room' : 'explorer'
    };

    // Actualizar Pasaporte
    const updatedPassport = await saveStamp(user ? user.uid : null, stamp);
    setPassport(updatedPassport);

    // Si estamos en una sala multijugador, sumar los puntos a la tabla de la sala
    if (currentRoom && user) {
      await updatePlayerScore(currentRoom.id, user.uid, pointsEarned);
    }

    // Mostrar modal ceremonial de llave forjada
    setUnlockedKeyInfo({
      isOpen: true,
      keyType: keyEarned,
      legendName: activeLegend.name,
      totalKeys: updatedPassport.totalKeys,
      hasWon: updatedPassport.hasWon
    });
  };

  const handleCloseKeyModal = () => {
    setUnlockedKeyInfo(null);
    if (currentRoom) {
      navigate('game');
    } else {
      navigate('explorer');
    }
    setActiveLegend(null);
  };

  // Cerrar Sesión
  const handleLogout = async () => {
    await signOut(auth);
    setRoomId('');
    setCurrentRoom(null);
    setPendingRoomCode('');
    navigate('landing');
  };

  // Renderizado del Módulo Educativo según la Leyenda
  const renderActiveModule = () => {
    if (!activeLegend) return null;

    const returnScreen = () => {
      if (currentRoom) {
        navigate('game');
      } else if (user) {
        navigate(previousScreen === 'scanner' ? 'explorer' : previousScreen);
      } else {
        navigate('welcome');
      }
    };

    switch (activeLegend.category) {
      case 'trivia':
        return (
          <TriviaModule
            legend={activeLegend}
            onComplete={handleCompleteModule}
            onCancel={returnScreen}
          />
        );
      case 'character':
        return (
          <CharacterGuessModule
            legend={activeLegend}
            onComplete={handleCompleteModule}
            onCancel={returnScreen}
          />
        );
      case 'mime':
        return (
          <MimeChallengeModule
            legend={activeLegend}
            onComplete={handleCompleteModule}
            onCancel={returnScreen}
          />
        );
      case 'social':
        return (
          <SocialChallengeModule
            legend={activeLegend}
            onComplete={handleCompleteModule}
            onCancel={returnScreen}
          />
        );
      case 'apparition':
      default:
        return (
          <StoryApparitionModule
            legend={activeLegend}
            onComplete={handleCompleteModule}
            onCancel={returnScreen}
          />
        );
    }
  };

  // Si estamos en la Landing Page, mostrar la vista completa de la landing
  if (screen === 'landing') {
    return (
      <LandingPageView
        onEnterGame={handleEnterFromLanding}
        onEnterExplorer={handleEnterExplorerFromLanding}
        onEnterLiveTheater={() => navigate('theater')}
      />
    );
  }

  // Si estamos en la página del Teatro en Vivo
  if (screen === 'theater') {
    return (
      <Suspense fallback={<MysticLoader />}>
        <LiveTheaterView
          onBack={() => navigate('landing')}
          onEnterGame={handleEnterFromLanding}
        />
      </Suspense>
    );
  }

  // Si estamos en el panel administrativo Mayordomo
  if (screen === 'mayordomo') {
    return (
      <Suspense fallback={<MysticLoader />}>
        <MayordomoView
          onGoToLanding={() => navigate('landing')}
          onGoToTheater={() => navigate('theater')}
        />
      </Suspense>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-start py-4 px-2 bg-obsidian text-cream select-none overflow-x-hidden">
      {/* Barra de Navegación Superior */}
      {user && screen !== 'login' && (
        <Navbar
          userName={user.displayName || 'Explorador Místico'}
          totalScore={passport.totalScore}
          onLogout={handleLogout}
          onGoHome={() => navigate('landing')}
        />
      )}

      {/* Contenedor Principal de Pantallas con Transición Fluida */}
      <main className="w-full flex-1 flex flex-col items-center justify-center my-auto">
        <AnimatePresence mode="wait">
          {screen === 'login' && (
            <Suspense key="login" fallback={<MysticLoader />}>
              <Login 
                onLogin={(u) => {
                  setUser(u);
                  navigate('welcome');
                }} 
                onBack={() => navigate('landing')}
              />
            </Suspense>
          )}

          {screen === 'welcome' && (
            <Suspense key="welcome" fallback={<MysticLoader />}>
              <WelcomeView
                onStartExplorer={() => navigate('explorer')}
                onCreateRoom={handleCreateRoom}
                onJoinRoom={() => navigate('join')}
                completedStamps={passport.completedCount}
                totalLegends={LEYENDAS_DATA.length}
              />
            </Suspense>
          )}

          {screen === 'explorer' && (
            <Suspense key="explorer" fallback={<MysticLoader />}>
              <ExplorerView
                stamps={passport.stamps}
                totalScore={passport.totalScore}
                keys={passport.keys}
                onOpenScanner={handleOpenScanner}
                onSelectLegend={handleLegendFound}
                onBack={() => navigate('welcome')}
              />
            </Suspense>
          )}

          {screen === 'scanner' && (
            <Suspense key="scanner" fallback={<MysticLoader />}>
              <ScannerView
                onLegendFound={handleLegendFound}
                onBack={() => navigate(previousScreen === 'scanner' ? 'welcome' : previousScreen)}
              />
            </Suspense>
          )}

          {screen === 'join' && (
            <Suspense key="join" fallback={<MysticLoader />}>
              <JoinRoomView
                initialCode={prefillJoinCode}
                onJoin={handleJoinRoom}
                onBack={() => navigate('welcome')}
                isLoading={isRoomLoading}
                error={roomError}
              />
            </Suspense>
          )}

          {screen === 'lobby' && currentRoom && user && (
            <Suspense fallback={<MysticLoader />}>
              <LobbyView
                room={currentRoom}
                userId={user.uid}
                isHost={currentRoom.hostId === user.uid}
                onStartGame={handleStartGame}
                onLeaveRoom={handleLeaveRoom}
              />
            </Suspense>
          )}

          {screen === 'game' && currentRoom && user && (
            <Suspense fallback={<MysticLoader />}>
              <GameRoomView
                room={currentRoom}
                userId={user.uid}
                isHost={currentRoom.hostId === user.uid}
                onOpenScanner={handleOpenScanner}
                onLeaveRoom={handleLeaveRoom}
                onFinishGame={handleFinishGame}
                onSelectLegendChallenge={handleLegendFound}
              />
            </Suspense>
          )}

          {screen === 'module' && activeLegend && (
            <div key="module" className="w-full">
              <Suspense fallback={<MysticLoader />}>
                {renderActiveModule()}
              </Suspense>
            </div>
          )}
        </AnimatePresence>

        {/* Modal Ceremonial de Llave Mística Conquistada */}
        {unlockedKeyInfo?.isOpen && (
          <KeyUnlockModal
            isOpen={unlockedKeyInfo.isOpen}
            keyType={unlockedKeyInfo.keyType}
            legendName={unlockedKeyInfo.legendName}
            totalKeys={unlockedKeyInfo.totalKeys}
            hasWon={unlockedKeyInfo.hasWon}
            onClose={handleCloseKeyModal}
          />
        )}
      </main>
    </div>
  );
}

