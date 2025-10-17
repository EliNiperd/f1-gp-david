"use client";
import { FC } from "react";
import { DndContext, DragEndEvent, UniqueIdentifier } from "@dnd-kit/core";
import {
  SortableContext,
  SortingStrategy,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import Pilot from "./Pilot";

import type { StaticImageData } from "next/image";

interface PilotData {
  id: UniqueIdentifier;
  nombre: string;
  posicion: number;
  imagen: StaticImageData;
  equipo?: string;
}

export interface ListPilotsProps {
  pilots: PilotData[];
  onDragEnd: (event: DragEndEvent) => void;
  strategy?: SortingStrategy;
  sensors?: any;
  modifiers?: any;
  columns?: number; // Nueva prop para número de columnas
}

export const ListPilots: FC<ListPilotsProps> = ({
  pilots,
  onDragEnd,
  strategy = verticalListSortingStrategy,
  sensors,
  modifiers,
  columns = 1, // Valor por defecto: 1 columna
}) => {
  const midIndex = Math.ceil(pilots.length / 2);
  const column1 = pilots.slice(0, midIndex);
  const column2 = pilots.slice(midIndex);

  return (
    <DndContext sensors={sensors} onDragEnd={onDragEnd} modifiers={modifiers}>
      <SortableContext items={pilots.map((p) => p.id)} strategy={strategy}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
          <div className="flex flex-col gap-4">
            {column1.map((piloto) => (
              <Pilot key={piloto.id} piloto={piloto} />
            ))}
          </div>
          <div className="flex flex-col gap-4">
            {column2.map((piloto) => (
              <Pilot key={piloto.id} piloto={piloto} />
            ))}
          </div>
        </div>
      </SortableContext>
    </DndContext>
  );
};
