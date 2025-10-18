import { useState, useEffect } from 'react';

interface Meeting {
  meeting_key: number;
  meeting_name: string;
}

interface RaceSelectorProps {
  onRaceSelected: (meetingKey: number) => void;
}

export default function RaceSelector({ onRaceSelected }: RaceSelectorProps) {
  const [years, setYears] = useState<number[]>([]);
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [races, setRaces] = useState<Meeting[]>([]);
  const [selectedRace, setSelectedRace] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const currentYear = new Date().getFullYear();
    const yearsArray = Array.from({ length: currentYear - 2018 + 1 }, (_, i) => currentYear - i);
    setYears(yearsArray);
  }, []);

  useEffect(() => {
    if (selectedYear) {
      setError(null);
      fetch(`https://api.openf1.org/v1/meetings?year=${selectedYear}`)
        .then(response => response.json())
        .then(data => {
          if (Array.isArray(data)) {
            setRaces(data);
          } else {
            setError(data.detail || "An unexpected error occurred.");
            setRaces([]);
          }
        });
    }
  }, [selectedYear]);

  const handleLoadRace = () => {
    if (selectedRace) {
      onRaceSelected(selectedRace);
    }
  };

  return (
    <div className="flex items-center gap-4 p-4 border-2 border-gray-200 rounded-lg">
      <select onChange={(e) => setSelectedYear(Number(e.target.value))}>
        <option>Select Year</option>
        {years.map(year => (
          <option key={year} value={year}>{year}</option>
        ))}
      </select>
      <select onChange={(e) => setSelectedRace(Number(e.target.value))} disabled={!selectedYear}>
        <option>Select Race</option>
        {races.map(race => (
          <option key={race.meeting_key} value={race.meeting_key}>{race.meeting_name}</option>
        ))}
      </select>
      <button onClick={handleLoadRace} disabled={!selectedRace}>Load Race</button>
      {error && <p className="text-red-500">{error}</p>}
    </div>
  );
}