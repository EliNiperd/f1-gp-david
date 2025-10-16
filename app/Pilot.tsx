import { UniqueIdentifier } from "@dnd-kit/core";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import Image from "next/image";
import type { StaticImageData } from "next/image";

interface PilotProps {
  piloto: { 
    nombre: string; 
    posicion: number; 
    imagen: StaticImageData;
    id: UniqueIdentifier;
    equipo?: string;
  };
}

function Pilot({ piloto }: PilotProps) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id: piloto.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div 
      className="grid grid-cols-8 items-center p-2 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 
      hover:bg-gray-100 dark:hover:bg-gray-700 hover:shadow-md transition-shadow cursor-grab active:cursor-grabbing"
      ref={setNodeRef} 
      style={style} 
      {...attributes} 
      {...listeners}
    >
      <div className="flex col-span-1 items-center justify-center text-xl font-bold text-blue-600 dark:text-blue-400">
        {piloto.posicion}
      </div>
      <div className="flex col-span-7 items-center gap-3">
        <Image
          src={piloto.imagen}
          alt={piloto.nombre}
          className="object-contain flex-shrink-0"
        />
        {/* <div className="flex flex-col">
           <span className="text-sm font-semibold">{piloto.nombre}</span> 
          {piloto.equipo && (
            <span className="text-xs text-gray-500">{piloto.equipo}</span>
          )}
        </div> */}
      </div>
    </div>
  );
}

export default Pilot;