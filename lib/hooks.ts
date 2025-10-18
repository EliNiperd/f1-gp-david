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
}

// Hook para OpenF1 API
export const useOpenF1 = () => {
  const BASE_URL = "https://api.openf1.org/v1";

  const fetchMeetings = useCallback(async (year: number): Promise<Meeting[]> => {
    await new Promise(resolve => setTimeout(resolve, 200)); // Small delay
    const response = await fetch(`${BASE_URL}/meetings?year=${year}`);
    if (!response.ok) throw new Error("Error fetching meetings");
    return response.json();
  }, []);

  const fetchSessions = useCallback(async (meetingKey: number): Promise<Session[]> => {
    await new Promise(resolve => setTimeout(resolve, 200)); // Small delay
    const response = await fetch(`${BASE_URL}/sessions?meeting_key=${meetingKey}`);
    if (!response.ok) throw new Error("Error fetching sessions");
    return response.json();
  }, []);

  const fetchDrivers = useCallback(async (sessionKey: number): Promise<Driver[]> => {
    await new Promise(resolve => setTimeout(resolve, 200)); // Small delay
    const response = await fetch(`${BASE_URL}/drivers?session_key=${sessionKey}`);
    if (!response.ok) throw new Error("Error fetching drivers");
    return response.json();
  }, []);

  const fetchLaps = useCallback(async (sessionKey: number): Promise<Lap[]> => {
    await new Promise(resolve => setTimeout(resolve, 200)); // Small delay
    const response = await fetch(`${BASE_URL}/laps?session_key=${sessionKey}`);
    if (!response.ok) {
      throw new Error("Error fetching laps");
    }
    return response.json();
  }, []);

  const fetchPositions = useCallback(async (sessionKey: number): Promise<OpenF1Position[]> => {
    await new Promise(resolve => setTimeout(resolve, 200)); // Small delay
    const response = await fetch(`${BASE_URL}/position?session_key=${sessionKey}`);
    if (!response.ok) throw new Error("Error fetching positions");
    return response.json();
  }, []);

  const fetchTyreData = useCallback(async (sessionKey: number): Promise<TyreData[]> => {
    await new Promise(resolve => setTimeout(resolve, 200)); // Small delay
    const response = await fetch(`${BASE_URL}/stints?session_key=${sessionKey}`); // Assuming 'stints' endpoint for tyre data
    //console.log("fetchTyreData response:", response);
    if (!response.ok) throw new Error("Error fetching tyre data");
    return response.json();
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