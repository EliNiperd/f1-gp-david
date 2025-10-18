import { UniqueIdentifier } from "@dnd-kit/core";
import {
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import Image from "next/image";
//import { PilotData } from "@/app/page"; // Import PilotData

interface PilotProps {
  piloto: PilotData;
  disabled?: boolean;
}

interface PilotData {
  id: UniqueIdentifier;
  nombre: string;
  posicion: number;
  imagen: any;
  equipo?: string;
  currentTyreCompound?: string;
  lapTime?: number;
  timeDiffToAhead?: number | null;
}

function Pilot({ piloto, disabled }: PilotProps) {
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

  // Tyre compound color mapping
  const tyreColors: { [key: string]: string } = {
    SOFT: 'bg-red-500',
    MEDIUM: 'bg-yellow-400',
    HARD: 'bg-white border border-gray-300',
    INTERMEDIATE: 'bg-green-500',
    WET: 'bg-blue-500',
    UNKNOWN: 'bg-gray-400',
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
      className={`grid grid-cols-8 items-center p-2 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700
      hover:bg-gray-100 dark:hover:bg-gray-700 hover:shadow-md transition-all duration-200 ${disabled ? 'cursor-default' : 'cursor-grab active:cursor-grabbing'}`}
    >
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
        <span className="font-semibold">{piloto.nombre}</span>
      </div>
      <div className="col-span-3 flex flex-col items-end justify-center text-right">
        {piloto.currentTyreCompound && (
          <div className="flex items-center gap-2 mb-1">
            <span className="text-sm text-gray-500">Compuesto:</span>
            <div className={`w-4 h-4 rounded-full ${tyreColors[piloto.currentTyreCompound] || tyreColors.UNKNOWN}`}></div>
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