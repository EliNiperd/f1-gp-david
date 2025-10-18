import React, { FC } from "react";
import {
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import Image from "next/image";
import { PilotData } from "@/lib/hooks"; // Import PilotData from lib/hooks.ts
import { TyreC1Hard, TyreC3Medium, TyreC4Soft, TyreIntermedium, TyreWet } from "@/components/TyreIcon";

interface PilotProps {
  piloto: PilotData;
  disabled?: boolean;
}

function Pilot({ piloto, disabled }: PilotProps) {
  //console.log(`Pilot ${piloto.nombre} (ID: ${piloto.id}) teamColor: ${piloto.teamColor}`);
  const { attributes, listeners, setNodeRef, transform, transition, isOver, isDragging } = useSortable({
    id: piloto.id,
    disabled,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition: isDragging ? transition : 'none',
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 1000 : 1,
  };

  // Map compound strings to SVG components
  const TyreIconMap: { [key: string]: React.ElementType } = {
    SOFT: TyreC4Soft,
    MEDIUM: TyreC3Medium,
    HARD: TyreC1Hard,
    INTERMEDIATE: TyreIntermedium,
    WET: TyreWet,
    // UNKNOWN will fall back to the gray circle div
  };

  const formatTime = (timeInSeconds: number | undefined | null) => {
    if (timeInSeconds === undefined || timeInSeconds === null) return '---';

    const isNegative = timeInSeconds < 0;
    let totalMilliseconds = Math.abs(Math.round(timeInSeconds * 1000));

    const minutes = Math.floor(totalMilliseconds / (60 * 1000));
    totalMilliseconds %= (60 * 1000);

    const seconds = Math.floor(totalMilliseconds / 1000);
    totalMilliseconds %= 1000;

    const milliseconds = totalMilliseconds;

    const sign = isNegative ? '-' : '';
    const formattedMinutes = minutes.toString().padStart(2, '0');
    const formattedSeconds = seconds.toString().padStart(2, '0');
    const formattedMilliseconds = milliseconds.toString().padStart(3, '0');

    return `${sign}${formattedMinutes}:${formattedSeconds}.${formattedMilliseconds}`;
  };

  const content = (
    <div
      className={`relative grid grid-cols-8 items-center p-2 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700
      hover:bg-gray-100 dark:hover:bg-gray-700 hover:shadow-md transition-all duration-200 ${disabled ? 'cursor-default' : 'cursor-grab active:cursor-grabbing'} ${piloto.outOfRace ? 'opacity-50' : ''}`}
    >
      {piloto.teamColor && (
        <div className="absolute left-0 top-0 bottom-0 w-2 rounded-l-lg" style={{ backgroundColor: piloto.teamColor }}></div>
      )}
      <div className="flex col-span-1 items-center justify-center text-xl font-bold text-blue-600 dark:text-blue-400">
        {piloto.posicion}
      </div>
      <div className="flex col-span-4 items-center gap-3">
        <Image
          src={piloto.imagen}
          alt={piloto.nombre}
          className="object-contain flex-shrink-0"
          width={50}
          height={50}
        />
        <span className={`font-semibold ${piloto.statusColor}`}>{piloto.nombre} {piloto.status !== 'ACTIVE' && `(${piloto.status})`}</span>
      </div>
      <div className="col-span-3 flex flex-col items-end justify-center text-right">
        {piloto.currentTyreCompound && (
          <div className="flex items-center gap-2 mb-1">
            <span className="text-sm text-gray-500">Compuesto:</span>
            {TyreIconMap[piloto.currentTyreCompound] ? (
              React.createElement(TyreIconMap[piloto.currentTyreCompound], { width: 24, height: 24 })
            ) : (
              <div className={`w-4 h-4 rounded-full bg-gray-400`}></div>
            )}
            {piloto.tyreAge !== undefined && piloto.tyreAge !== null && (
              <span className="text-sm text-gray-500">({piloto.tyreAge})</span>
            )}
          </div>
        )}
        {piloto.lapTime !== undefined && piloto.lapTime !== null && (
          <p className="text-sm font-medium">
            {piloto.timeDiffToAhead !== undefined && piloto.timeDiffToAhead !== null
              ? (piloto.timeDiffToAhead > 0 ? '+' : '') + formatTime(piloto.timeDiffToAhead)
              : formatTime(piloto.lapTime)}
          </p>
        )}
      </div>
    </div>
  );

  if (disabled) {
    return <div>{content}</div>;
  }

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      {content}
    </div>
  );
}
export default Pilot;