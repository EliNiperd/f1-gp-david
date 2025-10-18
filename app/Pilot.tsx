import {  UniqueIdentifier } from "@dnd-kit/core";
import {
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import Image from "next/image";


// Mock image component para el ejemplo

interface PilotData {
  id: UniqueIdentifier;
  nombre: string;
  posicion: number;
  imagen: any;
  equipo?: string;
}

interface PilotProps {
  piloto: PilotData;
  disabled?: boolean;
}

export default function Pilot({ piloto, disabled }: PilotProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: piloto.id,
    disabled,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition: isDragging ? transition : 'none',
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 1000 : 1,
  };

  const content = (
    <div 
      className={`grid grid-cols-8 items-center p-2 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 
      hover:bg-gray-100 dark:hover:bg-gray-700 hover:shadow-md transition-all duration-200 ${disabled ? 'cursor-default' : 'cursor-grab active:cursor-grabbing'}`}
    >
      <div className="flex col-span-1 items-center justify-center text-xl font-bold text-blue-600 dark:text-blue-400">
        {piloto.posicion}
      </div>
      <div className="flex col-span-7 items-center gap-3">
        <Image
          src={piloto.imagen}
          alt={piloto.nombre}
          className="object-contain flex-shrink-0"
          width={50}
          height={50}
        />
        <span className="font-semibold">{piloto.nombre}</span>
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