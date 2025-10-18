// lib/openf1-utils.ts

export interface OpenF1Meeting {
  meeting_key: number;
  meeting_name: string;
  circuit_short_name: string;
  country_name: string;
  date_start: string;
  year: number;
  location: string;
  meeting_official_name: string;
}

export interface OpenF1Session {
  session_key: number;
  session_name: string;
  session_type: string;
  date_start: string;
  date_end: string;
  meeting_key: number;
  circuit_short_name: string;
  country_name: string;
}

export interface OpenF1Driver {
  driver_number: number;
  full_name: string;
  name_acronym: string;
  team_name: string;
  team_colour: string;
  headshot_url: string;
  broadcast_name: string;
  country_code: string;
}

export interface OpenF1Lap {
  driver_number: number;
  lap_number: number;
  lap_duration: number;
  date_start: string;
  duration_sector_1?: number;
  duration_sector_2?: number;
  duration_sector_3?: number;
  is_pit_out_lap: boolean;
}

export interface OpenF1Position {
  driver_number: number;
  position: number;
  date: string;
  meeting_key: number;
  session_key: number;
}

/**
 * Cliente para OpenF1 API
 */
export class OpenF1Client {
  private baseUrl = "https://api.openf1.org/v1";

  /**
   * Obtener carreras por año
   */
  async getMeetings(year: number): Promise<OpenF1Meeting[]> {
    try {
      const response = await fetch(`${this.baseUrl}/meetings?year=${year}`);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      return data.sort((a: OpenF1Meeting, b: OpenF1Meeting) => 
        new Date(a.date_start).getTime() - new Date(b.date_start).getTime()
      );
    } catch (error) {
      console.error("Error fetching meetings:", error);
      throw error;
    }
  }

  /**
   * Obtener sesiones de una carrera
   */
  async getSessions(meetingKey: number): Promise<OpenF1Session[]> {
    try {
      const response = await fetch(`${this.baseUrl}/sessions?meeting_key=${meetingKey}`);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      return response.json();
    } catch (error) {
      console.error("Error fetching sessions:", error);
      throw error;
    }
  }

  /**
   * Obtener pilotos de una sesión
   */
  async getDrivers(sessionKey: number): Promise<OpenF1Driver[]> {
    try {
      const response = await fetch(`${this.baseUrl}/drivers?session_key=${sessionKey}`);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const drivers = await response.json();
      // Ordenar por número de piloto
      return drivers.sort((a: OpenF1Driver, b: OpenF1Driver) => 
        a.driver_number - b.driver_number
      );
    } catch (error) {
      console.error("Error fetching drivers:", error);
      throw error;
    }
  }

  /**
   * Obtener vueltas de una sesión
   */
  async getLaps(sessionKey: number): Promise<OpenF1Lap[]> {
    try {
      const response = await fetch(`${this.baseUrl}/laps?session_key=${sessionKey}`);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      return response.json();
    } catch (error) {
      console.error("Error fetching laps:", error);
      throw error;
    }
  }

  /**
   * Obtener posiciones de una sesión
   */
  async getPositions(sessionKey: number): Promise<OpenF1Position[]> {
    try {
      const response = await fetch(`${this.baseUrl}/position?session_key=${sessionKey}`);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      return response.json();
    } catch (error) {
      console.error("Error fetching positions:", error);
      throw error;
    }
  }

  /**
   * Obtener la vuelta más rápida de una sesión
   */
  async getFastestLap(sessionKey: number): Promise<{ driver_number: number; lap_duration: number } | null> {
    try {
      const laps = await this.getLaps(sessionKey);
      if (laps.length === 0) return null;

      // Filtrar vueltas válidas (no pit out y con duración)
      const validLaps = laps.filter(lap => 
        !lap.is_pit_out_lap && lap.lap_duration > 0
      );

      if (validLaps.length === 0) return null;

      // Encontrar la más rápida
      const fastest = validLaps.reduce((prev, current) => 
        current.lap_duration < prev.lap_duration ? current : prev
      );

      return {
        driver_number: fastest.driver_number,
        lap_duration: fastest.lap_duration
      };
    } catch (error) {
      console.error("Error fetching fastest lap:", error);
      return null;
    }
  }
}

/**
 * Calcular posiciones por vuelta basándose en los datos de laps
 * Algunos endpoints de position pueden no tener datos completos
 */
export function calculatePositionsByLap(laps: OpenF1Lap[]): Map<number, Map<number, number>> {
  // Map<lap_number, Map<driver_number, position>>
  const positionsByLap = new Map<number, Map<number, number>>();

  // Agrupar vueltas por lap_number
  const lapsByNumber = new Map<number, OpenF1Lap[]>();
  laps.forEach(lap => {
    if (!lapsByNumber.has(lap.lap_number)) {
      lapsByNumber.set(lap.lap_number, []);
    }
    lapsByNumber.get(lap.lap_number)!.push(lap);
  });

  // Para cada vuelta, ordenar por tiempo acumulado
  lapsByNumber.forEach((lapsInRound, lapNumber) => {
    // Calcular tiempo acumulado para cada piloto hasta esta vuelta
    const cumulativeTimes = new Map<number, number>();
    
    lapsInRound.forEach(lap => {
      const driverLaps = laps.filter(l => 
        l.driver_number === lap.driver_number && 
        l.lap_number <= lapNumber
      );
      
      const totalTime = driverLaps.reduce((sum, l) => sum + (l.lap_duration || 0), 0);
      cumulativeTimes.set(lap.driver_number, totalTime);
    });

    // Ordenar pilotos por tiempo acumulado
    const sorted = Array.from(cumulativeTimes.entries())
      .sort((a, b) => a[1] - b[1]);

    // Asignar posiciones
    const positions = new Map<number, number>();
    sorted.forEach(([driverNumber], index) => {
      positions.set(driverNumber, index + 1);
    });

    positionsByLap.set(lapNumber, positions);
  });

  return positionsByLap;
}

/**
 * Formatear tiempo en formato MM:SS.mmm
 */
export function formatLapTime(seconds: number): string {
  if (!seconds || seconds <= 0) return "--:--.---";
  
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  const wholeSecs = Math.floor(secs);
  const ms = Math.round((secs - wholeSecs) * 1000);
  
  return `${minutes}:${wholeSecs.toString().padStart(2, '0')}.${ms.toString().padStart(3, '0')}`;
}

/**
 * Obtener color del equipo en formato #RRGGBB
 */
export function getTeamColor(teamColour: string): string {
  // OpenF1 devuelve colores sin #
  return `#${teamColour}`;
}

/**
 * Mapear nombre de sesión a español
 */
export function translateSessionName(sessionName: string): string {
  const translations: Record<string, string> = {
    'Practice 1': 'Práctica 1',
    'Practice 2': 'Práctica 2',
    'Practice 3': 'Práctica 3',
    'Qualifying': 'Clasificación',
    'Sprint': 'Sprint',
    'Sprint Qualifying': 'Clasificación Sprint',
    'Race': 'Carrera'
  };
  
  return translations[sessionName] || sessionName;
}

/**
 * Obtener el total de vueltas de una sesión
 */
export function getTotalLaps(laps: OpenF1Lap[]): number {
  if (laps.length === 0) return 0;
  return Math.max(...laps.map(lap => lap.lap_number));
}

/**
 * Verificar si una sesión es una carrera
 */
export function isRaceSession(sessionType: string): boolean {
  return sessionType.toLowerCase() === 'race';
}

/**
 * Obtener estadísticas de un piloto en una sesión
 */
export function getDriverStats(
  driverNumber: number, 
  laps: OpenF1Lap[]
): {
  totalLaps: number;
  bestLap: number | null;
  averageLapTime: number | null;
  pitStops: number;
} {
  const driverLaps = laps.filter(lap => lap.driver_number === driverNumber);
  
  if (driverLaps.length === 0) {
    return { totalLaps: 0, bestLap: null, averageLapTime: null, pitStops: 0 };
  }

  const validLaps = driverLaps.filter(lap => !lap.is_pit_out_lap && lap.lap_duration > 0);
  const pitStops = driverLaps.filter(lap => lap.is_pit_out_lap).length;
  
  const bestLap = validLaps.length > 0
    ? Math.min(...validLaps.map(lap => lap.lap_duration))
    : null;
    
  const averageLapTime = validLaps.length > 0
    ? validLaps.reduce((sum, lap) => sum + lap.lap_duration, 0) / validLaps.length
    : null;

  return {
    totalLaps: driverLaps.length,
    bestLap,
    averageLapTime,
    pitStops
  };
}

// Instancia singleton del cliente
export const openF1Client = new OpenF1Client();