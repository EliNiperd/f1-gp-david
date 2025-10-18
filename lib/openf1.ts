// lib/openf1.ts
const OPENF1_BASE_URL = 'https://api.openf1.org/v1';

export interface SessionInfo {
  session_key: number;
  session_name: string;
  date_start: string;
  date_end: string;
  circuit_short_name: string;
}

export interface DriverData {
  driver_number: number;
  broadcast_name: string;
  team_name: string;
  team_colour: string;
}

export interface PositionData {
  driver_number: number;
  position: number;
  date: string;
}

export interface LapData {
  driver_number: number;
  lap_number: number;
  lap_duration: number;
  is_pit_out_lap: boolean;
}

export interface StintData {
  driver_number: number;
  stint_number: number;
  lap_start: number;
  lap_end: number;
  compound: string;
  tyre_age_at_start: number;
}

class OpenF1Service {
  private baseURL = OPENF1_BASE_URL;

  async getLatestSession(): Promise<SessionInfo> {
    const response = await fetch(`${this.baseURL}/sessions?session_key=latest`);
    const data = await response.json();
    return data[0];
  }

  async getDrivers(sessionKey: number): Promise<DriverData[]> {
    const response = await fetch(`${this.baseURL}/drivers?session_key=${sessionKey}`);
    return await response.json();
  }

  async getPositions(sessionKey: number, lapNumber?: number): Promise<PositionData[]> {
    let url = `${this.baseURL}/position?session_key=${sessionKey}`;
    if (lapNumber) {
      url += `&lap_number=${lapNumber}`;
    }
    const response = await fetch(url);
    return await response.json();
  }

  async getLaps(sessionKey: number, driverNumber?: number): Promise<LapData[]> {
    let url = `${this.baseURL}/laps?session_key=${sessionKey}`;
    if (driverNumber) {
      url += `&driver_number=${driverNumber}`;
    }
    const response = await fetch(url);
    return await response.json();
  }

  async getStints(sessionKey: number): Promise<StintData[]> {
    const response = await fetch(`${this.baseURL}/stints?session_key=${sessionKey}`);
    return await response.json();
  }

  async getIntervals(sessionKey: number): Promise<any[]> {
    const response = await fetch(`${this.baseURL}/intervals?session_key=${sessionKey}`);
    return await response.json();
  }

  // Función auxiliar para combinar todos los datos
  async getRaceStandings(sessionKey: number, lapNumber: number) {
    const [drivers, positions, laps, stints, intervals] = await Promise.all([
      this.getDrivers(sessionKey),
      this.getPositions(sessionKey, lapNumber),
      this.getLaps(sessionKey),
      this.getStints(sessionKey),
      this.getIntervals(sessionKey),
    ]);

    // Combinar datos
    return positions.map(pos => {
      const driver = drivers.find(d => d.driver_number === pos.driver_number);
      const driverLaps = laps.filter(l => l.driver_number === pos.driver_number);
      const currentStint = stints
        .filter(s => s.driver_number === pos.driver_number)
        .sort((a, b) => b.stint_number - a.stint_number)[0];
      const interval = intervals.find(i => i.driver_number === pos.driver_number);

      return {
        position: pos.position,
        driverNumber: pos.driver_number,
        driverName: driver?.broadcast_name || `Driver ${pos.driver_number}`,
        team: driver?.team_name || 'Unknown',
        teamColor: driver?.team_colour || '000000',
        interval: interval?.interval || (pos.position === 1 ? 'LEADER' : '+?.???'),
        lapTime: driverLaps[driverLaps.length - 1]?.lap_duration 
          ? formatLapTime(driverLaps[driverLaps.length - 1].lap_duration) 
          : '--:--.---',
        currentTire: currentStint?.compound || 'UNKNOWN',
        tireAge: lapNumber - (currentStint?.lap_start || 0),
      };
    }).sort((a, b) => a.position - b.position);
  }
}

function formatLapTime(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const secs = (seconds % 60).toFixed(3);
  return `${minutes}:${secs.padStart(6, '0')}`;
}

export const openf1 = new OpenF1Service();
