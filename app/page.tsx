'use client'
import { useState } from "react"
import Image from "next/image";
import { NavigationMenu,
  NavigationMenuContent,
//  NavigationMenuIndicator,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
//  NavigationMenuViewport,
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

import { closestCenter, DndContext } from "@dnd-kit/core";

export default function Home() {

 const [pilotos, setPilotos] = useState([
    {
      nombre: "Hadjar",
      posicion: 11,
      imagen: Hadjar,},
    {
      nombre: "Lando Norris",
      posicion: 1,
      imagen: Norris,},
    {
      nombre: "Charles Leclerc",
      posicion: 2,
      imagen: Leclerc,},
    {
      nombre: "Andrea Antonelli",
      posicion: 3,
      imagen: Antonelli,},
    {
      nombre: "Carlos Sainz",
      posicion: 4,
      imagen: Sainz,},
    {
      nombre: "Oliver Bearman",
      posicion: 5,
      imagen: Bearman,},
    {
      nombre: "Fernando Alonso",
      posicion: 6,
      imagen: Alonso,},
    {
      nombre: "Gabriel Bortoleto",
      posicion: 7,
      imagen: Bortoleto,},
    {
      nombre: "Jack Doohan",
      posicion: 8,
      imagen: Doohan,},
    {
      nombre: "Alexander Albon",
      posicion: 9,
      imagen: Albon,},
    {
      nombre: "Pierre Gasly",
      posicion: 10,
      imagen: Gasly,}
  ]);
  const [circuito, setCircuito] =useState("Circuito de Mónaco");
  const [fecha, setFecha] = useState("28 de mayo de 2023");
  //const [hora, setHora] = .useState("15:00 CEST");
  const [vuelta, setVuelta] = useState(1);
  const [vueltas, setVueltas] = useState(78);
  //const [vueltaRapida, setVueltaRapida] = useState(1);
  const [vueltaRapidaPiloto, setVueltaRapidaPiloto] = useState("Lando Norris");
  //const [vueltaRapidaTiempo, setVueltaRapidaTiempo] = useState("1:30.123");

  const handleDragEnd =() => {

  }

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <header className="flex flex-col gap-[32px] items-center sm:items-start">
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
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <DndContext 
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}>
          </DndContext>
      <div className="grid grid-cols-16 grid-rows-10 border-black border-2 rounded-lg p-4 gap-[32px] items-center ">
        <div className="w-14 col-span-1 flex items-center text-3xl font-medium ">01</div>
        <div className="col-span-15 flex-none items-center border-black border-2">
          <Image
            src={Norris}
            alt="Lando Norris"
            className=" "
          />
        </div>
        <div className="w-14 col-span-1 flex items-center text-3xl font-medium">02</div>
        <div className="col-span-15 flex-none  border-black border-2">
          <Image
            src={Leclerc}
            alt="Charles Leclerc"
            className=" "
          />
        </div>
        <div className="w-14 col-span-1 flex items-center text-3xl font-medium">03</div>
        <div className="col-span-15 flex-none  border-black border-2">
          <Image
            src={Antonelli}
            alt="Andrea Antonelli"
            className=" "
          />
        </div>
        <div className="w-14 col-span-1 flex items-center text-3xl font-medium">04</div>
        <div className="col-span-15 flex-none  border-black border-2">
          <Image
            src={Sainz}
            alt="Carlos Sainz"
            className=" "
          />
        </div>
        <div className="w-14 col-span-1 flex items-center text-3xl font-medium">05</div>
        <div className="col-span-15 flex-none  border-black border-2">
          <Image
            src={Bearman}
            alt="Oliver Bearman"
            className=" "
          />
        </div>
        <div className="w-14 col-span-1 flex items-center text-3xl font-medium">06</div>
        <div className="col-span-15 flex-none  border-black border-2">
          <Image
            src={Alonso}
            alt="Fernando Alonso"
            className=" "
          />
        </div>
        <div className="w-14 col-span-1 flex items-center text-3xl font-medium">07</div>
        <div className="col-span-15 flex-none  border-black border-2">
          <Image
            src={Bortoleto}
            alt="Gabriel Bortoleto"
            className=" "
          />
        </div>
        <div className="w-14 col-span-1 flex items-center text-3xl font-medium">08</div>
        <div className="col-span-15 flex-none  border-black border-2">
          <Image
            src={Doohan}
            alt="Jack Doohan"
            className=" "
          />
        </div>
        <div className="w-14 col-span-1 flex items-center text-3xl font-medium">09</div>
        <div className="col-span-15 flex-none  border-black border-2">
          <Image
            src={Albon}
            alt="Alexander Albon"
            className=" "
          />
        </div>
        <div className="w-14 col-span-1 flex items-center text-3xl font-medium">10</div>
        <div className="col-span-15 flex-none  border-black border-2">
          <Image
            src={Gasly}
            alt="Pierre Gasly"
            className=" "
          />
        </div>
      </div>
      </main>
      <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center">
        
      </footer>
    </div>
  );
}
