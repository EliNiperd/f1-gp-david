import { useEffect, useState, useCallback, useMemo } from "react";
import { UniqueIdentifier } from "@dnd-kit/core";

// Tipos para OpenF1 API
export interface Meeting {
  meeting_key: number;
  meeting_name: string;
  circuit_short_name: string;
  country_name: string;
  date_start: string;
  year: number;
  location: string;
}

export interface Session {
  session_key: number;
  session_name: string;
  session_type: string;
  date_start: string;
  date_end: string;
  meeting_key: number;
}

export interface Driver {
  driver_number: number;
  full_name: string;
  name_acronym: string;
  team_name: string;
  team_colour: string;
  headshot_url: string;
  broadcast_name: string;
}

export interface Lap {
  driver_number: number;
  lap_number: number;
  lap_duration: number;
  position?: number;
  date_start?: string;
}

export interface OpenF1Position {
  driver_number: number;
  position: number;
  date: string;
}

export interface TyreData {
  driver_number: number;
  compound: string;
  lap_start: number;
  lap_end: number;
  stint_number: number;
  tyre_age_at_start: number;
  date?: string;
}

export interface PilotData {
  id: UniqueIdentifier;
  nombre: string;
  posicion: number;
  imagen: any; // Tu StaticImageData
  equipo?: string;
  currentTyreCompound?: string; // soft, medium, hard, etc.
  lapTime?: number; // Lap time for the current lap
  timeDiffToAhead?: number | null; // Difference to the pilot ahead
  lastKnownTyreCompound?: string; // For fallback if current is not found
  tyreAge?: number; // Age of the current tyre compound in laps
  status?: string; // e.g., ACTIVE, DNF, DNS, DSQ, NC, RET
  statusColor?: string; // Tailwind CSS class for status color
  outOfRace?: boolean; // True if driver is DNF, DSQ, NC, RET
  teamColor?: string; // Hex color for the team
  qStatus?: string; // e.g., Q1, Q2, Q3, OUT_Q1, OUT_Q2, POLE
  isEliminated?: boolean; // True if driver is eliminated from qualification
  bestLapTime?: number; // Best lap time for the driver during qualification
}

// Mapping of team names to their colors for 2024/2025 seasons
export const TEAM_COLORS: { [key: string]: string } = {
  "Mercedes": "#00D7B6",
  "Red Bull Racing": "#4781D7",
  "Ferrari": "#ED1131",
  "McLaren": "#F47600",
  "Alpine": "#00A1E8",
  "Racing Bulls": "#6C98FF", // Corrected team name from API
  "Aston Martin": "#229971",
  "Williams": "#1868DB",
  "Kick Sauber": "#01C00E",
  "Haas F1 Team": "#9C9FA2", // Assuming Haas is 'Haas F1 Team' in API
};

// Hook para OpenF1 API
export const useOpenF1 = () => {
  const BASE_URL = "https://api.openf1.org/v1";

  const fetchWithRetry = async (url: string, retries = 3, delay = 500): Promise<any> => {
    try {
      const response = await fetch(url);
      if (response.status === 429 && retries > 0) {
        console.warn(`Rate limit hit (429). Retrying in ${delay}ms... (${retries} retries left)`);
        await new Promise(resolve => setTimeout(resolve, delay));
        return fetchWithRetry(url, retries - 1, delay * 2);
      }
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status} for ${url}`);
      return response.json();
    } catch (error) {
      if (retries > 0) {
        await new Promise(resolve => setTimeout(resolve, delay));
        return fetchWithRetry(url, retries - 1, delay * 2);
      }
      throw error;
    }
  };

  const fetchMeetings = useCallback(async (year: number): Promise<Meeting[]> => {
    return fetchWithRetry(`${BASE_URL}/meetings?year=${year}`);
  }, []);

  const fetchSessions = useCallback(async (meetingKey: number): Promise<Session[]> => {
    return fetchWithRetry(`${BASE_URL}/sessions?meeting_key=${meetingKey}`);
  }, []);

  const fetchDrivers = useCallback(async (sessionKey: number): Promise<Driver[]> => {
    return fetchWithRetry(`${BASE_URL}/drivers?session_key=${sessionKey}`);
  }, []);

  const fetchLaps = useCallback(async (sessionKey: number): Promise<Lap[]> => {
    return fetchWithRetry(`${BASE_URL}/laps?session_key=${sessionKey}`);
  }, []);

  const fetchPositions = useCallback(async (sessionKey: number): Promise<OpenF1Position[]> => {
    return fetchWithRetry(`${BASE_URL}/position?session_key=${sessionKey}`);
  }, []);

  const fetchTyreData = useCallback(async (sessionKey: number): Promise<TyreData[]> => {
    return fetchWithRetry(`${BASE_URL}/stints?session_key=${sessionKey}`);
  }, []);

  return useMemo(() => ({
    fetchMeetings,
    fetchSessions,
    fetchDrivers,
    fetchLaps,
    fetchPositions,
    fetchTyreData,
  }), [fetchMeetings, fetchSessions, fetchDrivers, fetchLaps, fetchPositions, fetchTyreData]);
};