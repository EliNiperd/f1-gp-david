// components/RaceStats.tsx
"use client";

import { useMemo } from 'react';
import { OpenF1Driver, OpenF1Lap, formatLapTime, getDriverStats } from '@/lib/openf1-utils';

interface RaceStatsProps {
  drivers: OpenF1Driver[];
  laps: OpenF1Lap[];
  currentLap: number;
  maxLaps: number;
}

export function RaceStats({ drivers, laps, currentLap, maxLaps }: RaceStatsProps) {
  // Calcular vuelta más rápida general
  const fastestLap = useMemo(() => {
    const validLaps = laps.filter(lap => !lap.is_pit_out_lap && lap.lap_duration > 0);
    if (validLaps.length === 0) return null;

    const fastest = validLaps.reduce((prev, current) =>
      current.lap_duration < prev.lap_duration ? current : prev
    );

    const driver = drivers.find(d => d.driver_number === fastest.driver_number);
    return { lap: fastest, driver };
  }, [laps, drivers]);

  // Calcular estadísticas por piloto
  const driverStats = useMemo(() => {
    return drivers.map(driver => {
      const stats = getDriverStats(driver.driver_number, laps);
      return { driver, ...stats };
    }).sort((a, b) => {
      if (a.bestLap === null) return 1;
      if (b.bestLap === null) return -1;
      return a.bestLap - b.bestLap;
    });
  }, [drivers, laps]);

  const progress = maxLaps > 0 ? (currentLap / maxLaps) * 100 : 0;

  return (
    <div className="space-y-4">
      {/* Progreso de la carrera */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold text-lg">Progreso de la Sesión</h3>
          <span className="text-sm text-gray-600 dark:text-gray-400">
            {currentLap} / {maxLaps} vueltas
          </span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
          <div
            className="bg-gradient-to-r from-red-600 to-red-500 h-full transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Vuelta más rápida */}
      {fastestLap && (
        <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 dark:from-purple-500/20 dark:to-pink-500/20 rounded-lg p-4 border border-purple-300 dark:border-purple-700">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                🏆 Vuelta Más Rápida
              </div>
              <div className="text-2xl font-bold text-purple-700 dark:text-purple-300">
                {formatLapTime(fastestLap.lap.lap_duration)}
              </div>
            </div>
            <div className="text-right">
              <div className="font-semibold text-lg">
                {fastestLap.driver?.name_acronym || 'N/A'}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Vuelta {fastestLap.lap.lap_number}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Top 3 mejores tiempos */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
        <h3 className="font-semibold text-lg mb-3">🏎️ Mejores Tiempos por Vuelta</h3>
        <div className="space-y-2">
          {driverStats.slice(0, 3).map((stat, index) => (
            <div
              key={stat.driver.driver_number}
              className="flex items-center gap-3 p-2 rounded hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
            >
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-white text-sm"
                style={{ backgroundColor: `#${stat.driver.team_colour}` }}
              >
                {index + 1}
              </div>
              <div className="flex-1">
                <div className="font-semibold">{stat.driver.name_acronym}</div>
                <div className="text-xs text-gray-600 dark:text-gray-400">
                  {stat.driver.team_name}
                </div>
              </div>
              <div className="text-right">
                <div className="font-mono font-semibold">
                  {stat.bestLap ? formatLapTime(stat.bestLap) : 'N/A'}
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400">
                  {stat.totalLaps} vueltas
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Información adicional */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3 border border-blue-200 dark:border-blue-800">
          <div className="text-xs text-blue-600 dark:text-blue-400 mb-1">Total Pilotos</div>
          <div className="text-2xl font-bold text-blue-700 dark:text-blue-300">
            {drivers.length}
          </div>
        </div>
        <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-3 border border-green-200 dark:border-green-800">
          <div className="text-xs text-green-600 dark:text-green-400 mb-1">Total Vueltas</div>
          <div className="text-2xl font-bold text-green-700 dark:text-green-300">
            {laps.length}
          </div>
        </div>
      </div>
    </div>
  );
}