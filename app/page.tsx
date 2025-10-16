'use client'

import { pilots } from "@/lib/data";
import { useState } from "react";
import { useSensor,  KeyboardSensor, MouseSensor, useSensors, DragEndEvent, UniqueIdentifier } from "@dnd-kit/core";
import { arrayMove, verticalListSortingStrategy } from "@dnd-kit/sortable";

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";

import { ListPilots } from "@/app/ListPilots";





export default function Home() {
  const [pilotos, setPilotos] = useState(pilots);

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
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <header className="flex flex-col gap-[32px] items-center sm:items-start">
        <div className="flex flex-col items-center">
          <h1 className="text-2xl font-bold mb-4">Carrera F1 - {circuito}</h1>
          <p className="text-sm text-gray-600">{fecha} • Vuelta {vuelta}/{vueltas}</p>
          <p className="text-sm text-gray-600">Vuelta rápida: {vueltaRapidaPiloto}</p>
        </div>
        
        <div className="">
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger>Gran Premio</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <NavigationMenuLink href="/gran-premio">
                    Gran Premio
                  </NavigationMenuLink>
                </NavigationMenuContent>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuTrigger>Clasificación</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <NavigationMenuLink href="/clasificacion">
                    Clasificación
                  </NavigationMenuLink>
                </NavigationMenuContent>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuTrigger>Resultados</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <NavigationMenuLink href="/resultados">
                    Resultados
                  </NavigationMenuLink>
                </NavigationMenuContent>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>
      </header>
      
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start w-full max-w-6xl">
        <div className="border-black border-2 rounded-lg p-6 w-full">
          <ListPilots 
            pilots={pilotos}
            onDragEnd={handleDragEnd}
            sensors={sensors}
            strategy={verticalListSortingStrategy}
            columns={2} // ¡Aquí especificamos 2 columnas!
          />
        </div>
      </main>
      
      <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center">
        <p className="text-sm text-gray-500">
          Arrastra y suelta para cambiar el orden de los pilotos
        </p>
      </footer>
    </div>
  );
}