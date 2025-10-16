
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
    id: string;
    nombre: string;
    posicion: number;
    imagen: StaticImageData;
    equipo?: string;
}

export const pilots: PilotData[] = [
    { id: "1", nombre: "Lando Norris", posicion: 1, imagen: Norris },
    { id: "2", nombre: "Charles Leclerc", posicion: 2, imagen: Leclerc },
    { id: "3", nombre: "Andrea Antonelli", posicion: 3, imagen: Antonelli },
    { id: "4", nombre: "Carlos Sainz", posicion: 4, imagen: Sainz },
    { id: "5", nombre: "Oliver Bearman", posicion: 5, imagen: Bearman },
    { id: "6", nombre: "Fernando Alonso", posicion: 6, imagen: Alonso },
    { id: "7", nombre: "Gabriel Bortoleto", posicion: 7, imagen: Bortoleto },
    { id: "8", nombre: "Alexander Albon", posicion: 8, imagen: Albon },
    { id: "9", nombre: "Isack Hadjar", posicion: 9, imagen: Hadjar },
    { id: "10", nombre: "Max Verstappen", posicion: 10, imagen: Verstapen},
    { id: "11", nombre: "Oscar Piastri", posicion: 11, imagen: Piastri },
    { id: "12", nombre: "Esteban Ocon", posicion: 12, imagen: Ocon },
    { id: "13", nombre: "Lewis Hamilton", posicion: 13, imagen: Hamilton },
    { id: "14", nombre: "Yuki Tsunoda", posicion: 14, imagen: Tsunoda },
    { id: "15", nombre: "George Russel", posicion: 15, imagen: Russel },
    { id: "16", nombre: "Lance Stroll", posicion: 16, imagen: Stroll },
    { id: "17", nombre: "Liam Lawson", posicion: 17, imagen: Lawson },
    { id: "18", nombre: "Nicholas Hulkenberg", posicion: 19, imagen: Hulkenberg },
    { id: "19", nombre: "Pierre Gasly", posicion: 20, imagen: Gasly },
    { id: "20", nombre: "Jack Doohan", posicion: 21, imagen: Doohan },
]