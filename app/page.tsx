'use client'

import { pilots } from "@/lib/data";
import { useEffect, useState } from "react";
import { useSensor,  KeyboardSensor, MouseSensor, useSensors, DragEndEvent } from "@dnd-kit/core";
import { arrayMove, verticalListSortingStrategy } from "@dnd-kit/sortable";
// import {
//   NavigationMenu,
//   NavigationMenuContent,
//   NavigationMenuItem,
//   NavigationMenuLink,
//   NavigationMenuList,
//   NavigationMenuTrigger,
// } from "@/components/ui/navigation-menu";
import { ListPilots } from "@/app/ListPilots";
import { ModeToggle } from "@/components/mode-toggle";

export default function Home() {
  const [pilotos, setPilotos] = useState(pilots);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

 const [circuito] = useState("Circuito de Mónaco");
  const [fecha] = useState("28 de mayo de 2023");
  const [vuelta] = useState(1);
  const [vueltas] = useState(78);
  const [vueltaRapidaPiloto] = useState("Lando Norris");

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id && over) {
      setPilotos((pilotos) => {
        const oldIndex = pilotos.findIndex((pilot) => pilot.id === active.id);
        const newIndex = pilotos.findIndex((pilot) => pilot.id === over.id);

        if (oldIndex === -1 || newIndex === -1) return pilotos;

        const newPilotos = arrayMove(pilotos, oldIndex, newIndex);
        
        return newPilotos.map((piloto, index) => ({
          ...piloto,
          posicion: index + 1
        }));
      });
    }
  };

  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor)
  );

  return (
    <div className="grid grid-rows-[auto_1fr_auto] items-center justify-items-center min-h-screen p-8 gap-10 sm:p-12">
      <header className="w-full flex items-center justify-between border-2 border-gray-200 rounded-lg p-4">
        <div className="flex flex-col">
          <h1 className="text-2xl font-bold mb-2">Carrera F1 - {circuito}</h1>
          <p className="text-sm text-gray-600">{fecha} • Vuelta {vuelta}/{vueltas}</p>
          <p className="text-sm text-gray-600">Vuelta rápida: {vueltaRapidaPiloto}</p>
           <p className="text-sm text-gray-500">
          Arrastra y suelta para cambiar el orden de los pilotos
        </p>
        </div>
        <ModeToggle />
      </header>
      
      <main className="flex flex-col row-start-2 items-center sm:items-start w-full max-w-6xl">
        <div className="border-black border-2 rounded-lg p-4 w-full">
        {isClient && (
          <ListPilots 
            pilots={pilotos}
            onDragEnd={handleDragEnd}
            sensors={sensors}
            strategy={verticalListSortingStrategy}
            columns={2} // ¡Aquí especificamos 2 columnas!
          />
        )}
        </div>
      </main>
      <footer className="row-start-3 flex flex-wrap items-center justify-center">
        <p>
          &copy; {new Date().getFullYear()} Elí con acento. Todos los derechos
          reservados.
        </p>
      </footer>
    </div>
  );
}