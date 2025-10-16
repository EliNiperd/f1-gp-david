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
  // Dividir pilotos en columnas
  const pilotsPerColumn = Math.ceil(pilots.length / columns);
  const columnsData = Array.from({ length: columns }, (_, columnIndex) =>
    pilots.slice(
      columnIndex * pilotsPerColumn,
      (columnIndex + 1) * pilotsPerColumn
    )
  );
  //console.log(columnsData);

  return (
    <DndContext sensors={sensors} onDragEnd={onDragEnd} modifiers={modifiers}>
      <div className={`grid grid-cols-${columns} gap-x-8 w-full `}>
        <div
          className="col-span-2 flex items-center justify-center text-2xl font-bold   "
        >
        </div>
        {columnsData.map((columnPilots, columnIndex) => (
          <SortableContext
            key={columnIndex}
            items={columnPilots.map((pilot) => pilot.id)}
            strategy={strategy}
          >
            {columnPilots.map((piloto) => (
              <div key={piloto.id} className="col-span-1">
                <Pilot piloto={piloto} />
              </div>
            ))}
          </SortableContext>
        ))}
      </div>
    </DndContext>
  );
};
