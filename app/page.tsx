"use client";

import {
  useSensor,
  KeyboardSensor,
  MouseSensor,
  useSensors,
  DragEndEvent,
  UniqueIdentifier,
} from "@dnd-kit/core";

import { useEffect, useState, useCallback, useMemo } from "react";
import { arrayMove, rectSortingStrategy } from "@dnd-kit/sortable";
import { ListPilots } from "@/app/ListPilots";
import { ModeToggle } from "@/components/mode-toggle";
import { useOpenF1, PilotData, Meeting, Session, Driver, Lap, OpenF1Position, TyreData, TEAM_COLORS } from "@/lib/hooks"; // Import useOpenF1 and PilotData from lib/hooks.ts
import LogoApp from "@/components/LogoApp";

export default function Home() {
  const api = useOpenF1();

  // Estados de selección
  const [year, setYear] = useState(2025);
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [selectedMeeting, setSelectedMeeting] = useState<Meeting | null>(null);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);
  const [showSelector, setShowSelector] = useState(true);

  // Estados de datos
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [laps, setLaps] = useState<Lap[]>([]);
  const [allPositions, setAllPositions] = useState<OpenF1Position[]>([]); // Nuevo estado para todas las posiciones
  const [allTyreData, setAllTyreData] = useState<TyreData[]>([]); // New state for all tyre data
  const [pilotos, setPilotos] = useState<PilotData[]>([]);
  const [qBestLapTimes, setQBestLapTimes] = useState<{ [driverId: UniqueIdentifier]: number }>({});
  const [currentQStage, setCurrentQStage] = useState<string | null>(null);
  const [qCutOffTimes, setQCutOffTimes] = useState<{ Q1: number | null, Q2: number | null }>({ Q1: null, Q2: null });
  
  // Estados de UI
  const [isClient, setIsClient] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Estados de simulación
  const [isSimulationRunning, setIsSimulationRunning] = useState(false);
  const [currentLap, setCurrentLap] = useState(0);
  const [maxLaps, setMaxLaps] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isHeaderOpen, setIsHeaderOpen] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Cargar meetings al inicio
  useEffect(() => {
    const loadMeetings = async () => {
      setLoading(true);
      try {
        const data = await api.fetchMeetings(year);
        const sorted = data.sort((a, b) => 
          new Date(a.date_start).getTime() - new Date(b.date_start).getTime()
        );
        setMeetings(sorted);
      } catch (err) {
        setError("Error al cargar las carreras");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadMeetings();
  }, [year, api]);

  // Cargar sesiones cuando se selecciona un meeting
  const handleMeetingSelect = async (meeting: Meeting) => {
    setSelectedMeeting(meeting);
    setLoading(true);
    try {
      const data = await api.fetchSessions(meeting.meeting_key);
      setSessions(data);
    } catch (err) {
      setError("Error al cargar sesiones");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Cargar datos de la sesión y preparar simulación
  const handleSessionSelect = async (session: Session) => {
    setSelectedSession(session);
    setLoading(true);
    
    try {
      // Cargar datos
      const [driversData, lapsData, positionsData, tyreData] = await Promise.all([
        api.fetchDrivers(session.session_key),
        api.fetchLaps(session.session_key),
        api.fetchPositions(session.session_key),
        api.fetchTyreData(session.session_key)
      ]);

      setDrivers(driversData);
      setLaps(lapsData);
      setAllPositions(positionsData);
      setAllTyreData(tyreData);
      //console.log("All Tyre Data:", tyreData);
      //console.log("All Tyre Data:", tyreData); // New state for all tyre data // Asegúrate de que allPositions también se guarda aquí

      // Calcular número de vueltas
      if (lapsData.length > 0) {
        const lapNumbers = lapsData.map(l => l.lap_number);
        //console.log('Lap numbers for maxLaps calculation:', lapNumbers);
        const max = Math.max(...lapNumbers);
        setMaxLaps(max);
        //console.log('Calculated maxLaps:', max);
      }

      // Convertir drivers a formato PilotData
      const pilotosData: PilotData[] = driversData.map(driver => {
        const initialPos = positionsData.find(p => p.driver_number === driver.driver_number && p.date === positionsData[0].date);
        const initialLap = lapsData.find(l => l.driver_number === driver.driver_number && l.lap_number === 1);
        const initialTyre = tyreData.find(t => t.driver_number === driver.driver_number && 1 >= t.lap_start && 1 <= t.lap_end);

        return {
          id: driver.driver_number,
          nombre: driver.full_name,
          posicion: initialPos?.position || 999,
          imagen: driver.headshot_url || '/pilots/Albon.png', // Fallback image
          equipo: driver.team_name,
          currentTyreCompound: initialTyre?.compound || 'UNKNOWN',
          lapTime: initialLap?.lap_duration || 0,
          timeDiffToAhead: null, // Initial state, will be calculated in simulation
          lastKnownTyreCompound: initialTyre?.compound || 'UNKNOWN',
          status: (initialLap || initialPos) ? 'ACTIVE' : 'DNS',
          statusColor: (initialLap || initialPos) ? '' : 'text-gray-500',
          outOfRace: !(initialLap || initialPos),
          teamColor: TEAM_COLORS[driver.team_name || ''],
          qStatus: (selectedSession?.session_type === 'Qualifying' && (initialLap || initialPos)) ? 'Q1' : undefined,
          isEliminated: false,
        };
      }).sort((a, b) => a.posicion - b.posicion);

      setPilotos(pilotosData);
      setShowSelector(false); // Ocultar selector y mostrar simulación
      setError(null);
    } catch (err) {
      setError("Error al cargar datos de la sesión");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Drag and drop handler
  const handleDragEnd = (event: DragEndEvent) => {
    if (isSimulationRunning) return;

    const { active, over } = event;
    if (active.id !== over?.id && over) {
      setPilotos((pilotos) => {
        const oldIndex = pilotos.findIndex((pilot) => pilot.id === active.id);
        const newIndex = pilotos.findIndex((pilot) => pilot.id === over.id);
        if (oldIndex === -1 || newIndex === -1) return pilotos;

        const newPilotos = arrayMove(pilotos, oldIndex, newIndex);
        //console.log("New pilots order after drag:", newPilotos);
        return newPilotos.map((piloto, index) => ({
          ...piloto,
          posicion: index + 1,
        }));
      });
    }
  };

  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: { distance: 8 },
    }),
    useSensor(KeyboardSensor)
  );

  // Iniciar simulación
  const startSimulation = () => {
    //console.log('startSimulation called. laps.length:', laps.length, 'maxLaps:', maxLaps);
    if (laps.length === 0) {
      setError("No hay datos de vueltas disponibles");
      return;
    }
    setIsSimulationRunning(true);
    setCurrentLap(1);
    setElapsedTime(0);
  };

  // Detener simulación
  const stopSimulation = () => {
    setIsSimulationRunning(false);
  };

  // Timer de simulación
  useEffect(() => {
    if (isSimulationRunning) {
      const timer = setInterval(() => {
        setElapsedTime(prevTime => prevTime + 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [isSimulationRunning]);

  // Actualizar posiciones por vuelta
  useEffect(() => {
    if (isSimulationRunning && elapsedTime > 0 && elapsedTime % 10 === 0) {
      const nextLapNumber = (elapsedTime / 10) + 1;
      
      if (nextLapNumber > maxLaps) {
        stopSimulation();
        return;
      }

      setCurrentLap(nextLapNumber);

      // Encontrar la fecha de inicio de la vuelta actual
      const representativeLap = laps.find(lap => lap.lap_number === nextLapNumber);

      if (!representativeLap) {
        console.warn(`No lap data found for lap number: ${nextLapNumber}. Cannot update positions.`);
        return;
      }

      // Asegurarse de que date_start esté definido y sea una cadena válida antes de crear Date
      if (typeof representativeLap.date_start !== "string") {
        console.warn(`Lap data for lap number ${nextLapNumber} has no valid date_start.`);
        return;
      }

      const targetTime = new Date(representativeLap.date_start).getTime();
      console.log(`Target Time for lap ${nextLapNumber}: ${new Date(targetTime).toISOString()}`);
      if (isNaN(targetTime)) {
        console.warn(`Invalid date_start for lap number ${nextLapNumber}: ${representativeLap.date_start}`);
        return;
      }

      // Encontrar la instantánea de posición más cercana a la fecha de inicio de la vuelta
      // Filtrar posiciones cuya fecha sea menor o igual a targetTime
      const pastPositions = allPositions.filter(pos => new Date(pos.date).getTime() <= targetTime);
      console.log(`All Positions length: ${allPositions.length}`);
      console.log(`Past Positions for lap ${nextLapNumber}:`, pastPositions.map(p => ({ driver_number: p.driver_number, position: p.position, date: p.date })));
      // Construir un mapa de las posiciones más recientes para cada piloto
      const relevantPositionsMap = new Map<UniqueIdentifier, OpenF1Position>();
      // Ordenar pastPositions por fecha para asegurar que la última posición para cada piloto sea la más reciente
      const sortedPastPositions = [...pastPositions].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

      sortedPastPositions.forEach(pos => {
        relevantPositionsMap.set(pos.driver_number, pos);
      });
      console.log(`Relevant Positions Map for lap ${nextLapNumber} (${relevantPositionsMap.size} drivers):`, Array.from(relevantPositionsMap.values()).map(p => ({ driver_number: p.driver_number, position: p.position, date: p.date })));

      if (relevantPositionsMap.size === 0) {
        console.warn(`No relevant position data found for target time: ${new Date(targetTime).toISOString()}.`);
        return;
      }



      setPilotos(prevPilotos => {
        const newPilotos = prevPilotos.map(piloto => {
          const pilotPositionData = relevantPositionsMap.get(piloto.id);
          const currentLapData = laps.find(l => l.driver_number === piloto.id && l.lap_number === nextLapNumber);
          const currentTyreData = allTyreData.find(t => t.driver_number === piloto.id && nextLapNumber >= t.lap_start && nextLapNumber <= t.lap_end);

          const compoundToUse = currentTyreData?.compound || piloto.lastKnownTyreCompound || 'UNKNOWN';

          // Determine driver status
          let newStatus = piloto.status;
          let newStatusColor = piloto.statusColor;
          let newOutOfRace = piloto.outOfRace;

          if (piloto.status === 'ACTIVE') {
            const maxLapCompletedByPilot = laps
              .filter(l => l.driver_number === piloto.id)
              .reduce((max, l) => Math.max(max, l.lap_number), 0);

            const hasCompletedCurrentLap = laps.some(l => l.driver_number === piloto.id && l.lap_number === nextLapNumber);
            const isInRelevantPositions = relevantPositionsMap.has(piloto.id);

            if (!hasCompletedCurrentLap && !isInRelevantPositions && nextLapNumber > 1) { // Only mark DNF after lap 1
              newStatus = 'DNF';
              newStatusColor = 'text-red-500';
              newOutOfRace = true;
            }
          }

          // Qualification Logic
          let newQStatus = piloto.qStatus;
          const newIsEliminated = piloto.isEliminated;
          let currentBestLapTime = piloto.bestLapTime || Infinity;

          if (selectedSession?.session_type === 'Qualifying' && !piloto.outOfRace && !piloto.isEliminated) {
            if (currentLapData && currentLapData.lap_duration && currentLapData.lap_duration < currentBestLapTime) {
              currentBestLapTime = currentLapData.lap_duration;
              setQBestLapTimes(prev => ({ ...prev, [piloto.id]: currentBestLapTime }));
            }

            // Default to Q1 if not eliminated yet
            if (!newIsEliminated && newQStatus !== 'OUT_Q1' && newQStatus !== 'OUT_Q2' && newQStatus !== 'Q3') {
              newQStatus = 'Q1';
            }
          }

          return {
            ...piloto,
            posicion: pilotPositionData?.position || piloto.posicion,
            lapTime: currentLapData?.lap_duration || piloto.lapTime,
            currentTyreCompound: compoundToUse,
            lastKnownTyreCompound: compoundToUse !== 'UNKNOWN' ? compoundToUse : piloto.lastKnownTyreCompound,
            tyreAge: currentTyreData ? (currentTyreData.tyre_age_at_start + (nextLapNumber - currentTyreData.lap_start)) : piloto.tyreAge,
            status: newStatus,
            statusColor: newStatusColor,
            outOfRace: newOutOfRace,
            qStatus: newQStatus,
            isEliminated: newIsEliminated,
            bestLapTime: currentBestLapTime === Infinity ? undefined : currentBestLapTime,
          };
        });



        // Sort pilots: ACTIVE drivers first, then DNF/DNS/etc. at the end
        const sortedPilotos = newPilotos.sort((a, b) => {
          if (a.outOfRace && !b.outOfRace) return 1;
          if (!a.outOfRace && b.outOfRace) return -1;
          // For qualifying, sort by best lap time if not eliminated
          if (selectedSession?.session_type === 'Qualifying' && !a.isEliminated && !b.isEliminated) {
            return (a.bestLapTime || Infinity) - (b.bestLapTime || Infinity);
          }
          return (a.posicion || 0) - (b.posicion || 0);
        }).map((piloto, index) => ({ ...piloto, posicion: index + 1 })); // Re-assign sequential positions



        // Now calculate time differences
        const pilotosWithTimeDiff = sortedPilotos.map((piloto, index, arr) => {
          if (index === 0) {
            return { ...piloto, timeDiffToAhead: null }; // First place has no one ahead
          } else {
            const pilotAhead = arr[index - 1];
            const diff = (piloto.lapTime || 0) - (pilotAhead.lapTime || 0);
            return { ...piloto, timeDiffToAhead: diff };
          }
        });

        return pilotosWithTimeDiff;
      });
      //console.log("Simulation: Pilotos state after setPilotos", pilotos);
    }
  }, [elapsedTime, isSimulationRunning, laps, maxLaps, allPositions, allTyreData, selectedSession?.session_type]);

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  // Volver al selector
  const backToSelector = () => {
    setShowSelector(true);
    setIsSimulationRunning(false);
    setCurrentLap(0);
    setElapsedTime(0);
    setPilotos([]);
  };

  return (
    <div className='grid grid-rows-[auto_1fr_auto] items-center justify-items-center min-h-screen p-4 gap-2 sm:p-8'>
      {/* Selector de Carreras */}
      {showSelector && (
        <div className='w-full max-w-6xl'>
          <div className='bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-4'>
            <div className='flex items-center justify-between mb-6'>
              <div className='flex items-center gap-2 text-cyan-100 text-2xl'>
              <LogoApp />
              </div>
              <h1 className='text-3xl font-bold'>🏁 Selector de Carreras F1</h1>
              <ModeToggle />
            </div>

            {error && (
              <div className='bg-red-100 dark:bg-red-900/30 border border-red-400 text-red-700 dark:text-red-300 px-4 py-3 rounded mb-4'>
                {error}
              </div>
            )}

            {loading && (
              <div className='bg-blue-100 dark:bg-blue-900/30 border border-blue-400 text-blue-700 dark:text-blue-300 px-4 py-3 rounded mb-4'>
                <div className='flex items-center gap-2'>
                  <div className='animate-spin rounded-full h-4 w-4 border-b-2 border-blue-700'></div>
                  Cargando...
                </div>
              </div>
            )}

            <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
              {/* Año */}
              <div>
                <label className='block text-sm font-semibold mb-2'>Año</label>
                <select
                  value={year}
                  onChange={(e) => setYear(Number(e.target.value))}
                  className='w-full p-2 border rounded-lg bg-white dark:bg-gray-700 dark:border-gray-600'
                >
                  <option value={2025}>2025</option>
                  <option value={2024}>2024</option>
                  <option value={2023}>2023</option>
                </select>
              </div>

              {/* Carreras */}
              <div>
                <label className='block text-sm font-semibold mb-2'>Carrera</label>
                <select
                  value={selectedMeeting?.meeting_key || ''}
                  onChange={(e) => {
                    const meeting = meetings.find(m => m.meeting_key === Number(e.target.value));
                    if (meeting) handleMeetingSelect(meeting);
                  }}
                  className='w-full p-2 border rounded-lg bg-white dark:bg-gray-700 dark:border-gray-600'
                  disabled={loading}
                >
                  <option value=''>Selecciona una carrera</option>
                  {meetings.map(meeting => (
                    <option key={meeting.meeting_key} value={meeting.meeting_key}>
                      {meeting.meeting_name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Sesiones */}
              <div>
                <label className='block text-sm font-semibold mb-2'>Sesión</label>
                <select
                  value={selectedSession?.session_key || ''}
                  onChange={(e) => {
                    const session = sessions.find(s => s.session_key === Number(e.target.value));
                    if (session) handleSessionSelect(session);
                  }}
                  className='w-full p-2 border rounded-lg bg-white dark:bg-gray-700 dark:border-gray-600'
                  disabled={!selectedMeeting || loading}
                >
                  <option value=''>Selecciona una sesión</option>
                  {sessions.map(session => (
                    <option key={session.session_key} value={session.session_key}>
                      {session.session_name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {selectedMeeting && (
              <div className='mt-4 p-4 bg-gray-100 dark:bg-gray-700 rounded-lg'>
                <h3 className='font-semibold mb-2'>{selectedMeeting.meeting_name}</h3>
                <p className='text-sm text-gray-600 dark:text-gray-300'>
                  📍 {selectedMeeting.location}, {selectedMeeting.country_name}
                </p>
                <p className='text-sm text-gray-600 dark:text-gray-300'>
                  📅 {new Date(selectedMeeting.date_start).toLocaleDateString('es-ES', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Vista de Simulación */}
      {!showSelector && (
        <>
          <header className='w-full border-2 border-gray-200 dark:border-gray-700 rounded-lg p-2 transition-all duration-300'>
            <div className='flex items-center justify-between'>
              <div className='flex items-center gap-4'>
                <button
                  onClick={backToSelector}
                  className='px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition-colors'
                >
                  ← Volver
                </button>
                <h1 className='text-xl font-bold'>
                  {selectedMeeting?.meeting_name} - {selectedSession?.session_name}
                </h1>
              </div>
              <div className='flex items-center gap-4'>
                  <p className='text-sm text-gray-600 dark:text-gray-300'>
                    {new Date(selectedMeeting?.date_start || '').toLocaleDateString('es-ES')} • Vuelta {currentLap}/{maxLaps}
                  </p>
                  <p className='text-sm text-gray-600 dark:text-gray-300'>
                    🏎️ {drivers.length} Pilotos
                  </p>
                </div>
              <div className='flex items-center gap-4'>
                {isSimulationRunning && <p>Tiempo: {formatTime(elapsedTime)}</p>}
                <button onClick={() => setIsHeaderOpen(!isHeaderOpen)} className='p-2'>
                  {isHeaderOpen ? "Ocultar" : "Mostrar"}
                </button>
                <ModeToggle />
              </div>
            </div>
            {isHeaderOpen && (
              <div className='mt-2'>
                
                <p className='text-sm text-gray-500 dark:text-gray-400 mt-2'>
                  {isSimulationRunning 
                    ? "Simulación en curso - Las posiciones se actualizan cada 10 segundos"
                    : "Arrastra y suelta para cambiar el orden de los pilotos (solo cuando la simulación está detenida)"
                  }
                </p>
                <p className='text-xs text-gray-400 dark:text-gray-500 mt-2'>
                  Para una mejor experiencia, usa el modo de pantalla completa (Windows: F11, Mac: Control + Command + F).
                </p>
              </div>
            )}
          </header>

          <main className='flex flex-col row-start-2 items-center sm:items-start w-full max-w-6xl'>
            <div className='flex gap-2 mb-4'>
              {!isSimulationRunning ? (
                <button 
                  onClick={startSimulation}
                  className='px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition-colors'
                >
                  ▶ Iniciar Simulación
                </button>
              ) : (
                <button 
                  onClick={stopSimulation}
                  className='px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition-colors'
                >
                  ⏸ Detener Simulación
                </button>
              )}
            </div>

            <div className='border-2 border-gray-200 dark:border-gray-700 rounded-lg p-4 w-full bg-white dark:bg-gray-800'>
              {isClient && pilotos.length > 0 && (
                <ListPilots
                  pilots={pilotos}
                  onDragEnd={handleDragEnd}
                  sensors={sensors}
                  strategy={rectSortingStrategy}
                  columns={2}
                  disabled={isSimulationRunning}
                />
              )}
            </div>

            {pilotos.length === 0 && (
              <div className='text-center p-8 text-gray-500'>
                No hay datos de pilotos disponibles
              </div>
            )}
          </main>

          <footer className='row-start-3 flex flex-wrap items-center justify-center'>
            <p className='text-sm text-gray-600 dark:text-gray-400'>
              &copy; {new Date().getFullYear()} Elí con acento. Datos por OpenF1 API.
            </p>
          </footer>
        </>
      )}
    </div>
  );
}