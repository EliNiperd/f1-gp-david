'use client'
import { useState } from "react";
import { useSensor, closestCenter, KeyboardSensor, MouseSensor, useSensors, DragEndEvent, UniqueIdentifier } from "@dnd-kit/core";
import { arrayMove, verticalListSortingStrategy } from "@dnd-kit/sortable";

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";

import Albon from "@/public/pilots/Albon.png";
import Alonso from "@/public/pilots/Alonso.png";
import Antonelli from "@/public/pilots/Antonelli.png";
import Bearman from "@/public/pilots/Bearman.png";
import Bortoleto from "@/public/pilots/Bortoleto.png";
import Doohan from "@/public/pilots/Doohan.png";
import Norris from "@/public/pilots/Norris.png";
import Gasly from "@/public/pilots/Gasly.png";
import Hadjar from "@/public/pilots/Hadjar.png";
import Leclerc from "@/public/pilots/Leclerc.png";
import Sainz from "@/public/pilots/Sainz.png";
import Verstapen from "@/public/pilots/Verstapen.png";
import Piastri from "@/public/pilots/Piastri.png";
import Russel from "@/public/pilots/Russell.png";
import Hamilton from "@/public/pilots/Hamilton.png";
import Tsunoda from "@/public/pilots/Tsunoda.png";
import Lawson from "@/public/pilots/Lawson.png";
import Stroll from "@/public/pilots/Stroll.png";
import Hulkenberg from "@/public/pilots/Hulkenberg.png";
import Ocon from "@/public/pilots/Ocon.png";


import { ListPilots } from "@/app/ListPilots";

import type { StaticImageData } from "next/image";

interface PilotData {
  id: UniqueIdentifier;
  nombre: string;
  posicion: number;
  imagen: StaticImageData;
  equipo?: string;
}

export default function Home() {
  const [pilotos, setPilotos] = useState<PilotData[]>([
    {
      id: "1",
      nombre: "Lando Norris",
      posicion: 1,
      imagen: Norris,
    },
    {
      id: "2",
      nombre: "Charles Leclerc",
      posicion: 2,
      imagen: Leclerc,
    },
    {
      id: "3",
      nombre: "Andrea Antonelli",
      posicion: 3,
      imagen: Antonelli,
    },
    {
      id: "4",
      nombre: "Carlos Sainz",
      posicion: 4,
      imagen: Sainz,
    },
    {
      id: "5",
      nombre: "Oliver Bearman",
      posicion: 5,
      imagen: Bearman,
    },
    {
      id: "6",
      nombre: "Fernando Alonso",
      posicion: 6,
      imagen: Alonso,
    },
    {
      id: "7",
      nombre: "Gabriel Bortoleto",
      posicion: 7,
      imagen: Bortoleto,
    },
    {
      id: "8",
      nombre: "Jack Doohan",
      posicion: 8,
      imagen: Doohan,
    },
    {
      id: "9",
      nombre: "Alexander Albon",
      posicion: 9,
      imagen: Albon,
    },
    {
      id: "10",
      nombre: "Pierre Gasly",
      posicion: 10,
      imagen: Gasly,
    },
    {
      id: "11",
      nombre: "Hadjar",
      posicion: 11,
      imagen: Hadjar,
    },
    { id: "12",
      nombre: "Verstapen",
      posicion: 12,
      imagen: Verstapen,
    },
    { id: "13",
      nombre: "Piastri",
      posicion: 13,
      imagen: Piastri,
    },
    { id: "14",
      nombre: "Sainz",
      posicion: 14,
      imagen: Sainz,
    },
    { id: "15",
      nombre: "Hamilton",
      posicion: 15,
      imagen: Hamilton,
    },
    { id: "16",
      nombre: "Tsunoda",
      posicion: 16,
      imagen: Tsunoda,
    },
    { id: "17",
      nombre: "Russel",
      posicion: 17,
      imagen: Russel,
    },
    { id: "18",
      nombre: "Lawson",
      posicion: 18,
      imagen: Lawson,
    },
    { id: "19",
      nombre: "Stroll",
      posicion: 19,
      imagen: Stroll,
    },
    { id: "20",
      nombre: "Hulkenberg",
      posicion: 20,
      imagen: Hulkenberg,
    } 
  ]);

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