
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

import { StaticImageData } from "next/image";


interface PilotData {
    id: number;
    nombre: string;
    posicion: number;
    imagen: StaticImageData;
    equipo?: string;
}

export const pilots: PilotData[] = [
    { id: 4, nombre: "Lando Norris", posicion: 1, imagen: Norris },
    { id: 16, nombre: "Charles Leclerc", posicion: 2, imagen: Leclerc },
    { id: 87, nombre: "Andrea Antonelli", posicion: 3, imagen: Antonelli },
    { id: 55, nombre: "Carlos Sainz", posicion: 4, imagen: Sainz },
    { id: 38, nombre: "Oliver Bearman", posicion: 5, imagen: Bearman },
    { id: 14, nombre: "Fernando Alonso", posicion: 6, imagen: Alonso },
    { id: 43, nombre: "Gabriel Bortoleto", posicion: 7, imagen: Bortoleto },
    { id: 23, nombre: "Alexander Albon", posicion: 8, imagen: Albon },
    { id: 37, nombre: "Isack Hadjar", posicion: 9, imagen: Hadjar },
    { id: 1, nombre: "Max Verstappen", posicion: 10, imagen: Verstapen},
    { id: 81, nombre: "Oscar Piastri", posicion: 11, imagen: Piastri },
    { id: 31, nombre: "Esteban Ocon", posicion: 12, imagen: Ocon },
    { id: 44, nombre: "Lewis Hamilton", posicion: 13, imagen: Hamilton },
    { id: 22, nombre: "Yuki Tsunoda", posicion: 14, imagen: Tsunoda },
    { id: 63, nombre: "George Russel", posicion: 15, imagen: Russel },
    { id: 18, nombre: "Lance Stroll", posicion: 16, imagen: Stroll },
    { id: 40, nombre: "Liam Lawson", posicion: 17, imagen: Lawson },
    { id: 27, nombre: "Nicholas Hulkenberg", posicion: 18, imagen: Hulkenberg },
    { id: 10, nombre: "Pierre Gasly", posicion: 19, imagen: Gasly },
    { id: 61, nombre: "Jack Doohan", posicion: 20, imagen: Doohan },
]