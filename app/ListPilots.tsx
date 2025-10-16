'use client'
import { FC } from 'react';
import { DndContext, DragEndEvent, UniqueIdentifier } from '@dnd-kit/core';
import { SortableContext, SortingStrategy, verticalListSortingStrategy } from '@dnd-kit/sortable';
import Pilot from './Pilot';

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
  columns = 1 // Valor por defecto: 1 columna
}) => {
  // Dividir pilotos en columnas
  const pilotsPerColumn = Math.ceil(pilots.length / columns);
  const columnsData = Array.from({ length: columns }, (_, columnIndex) =>
    pilots.slice(columnIndex * pilotsPerColumn, (columnIndex + 1) * pilotsPerColumn)
  );

  return (
    <DndContext 
      sensors={sensors}
      onDragEnd={onDragEnd}
      modifiers={modifiers}
    >
      <div className={`grid grid-cols-${columns} gap-8 w-full`}>
        {columnsData.map((columnPilots, columnIndex) => (
          <div key={columnIndex} className="space-y-3">
            <h3 className="text-lg font-semibold text-center mb-4">
              {columns > 1 ? `Columna ${columnIndex + 1}` : 'Clasificación'}
            </h3>
            <SortableContext items={columnPilots.map(pilot => pilot.id)} strategy={strategy}>
              <div className="space-y-2">
                {columnPilots.map((piloto) => (
                  <Pilot key={piloto.id} piloto={piloto} />
                ))}
              </div>
            </SortableContext>
          </div>
        ))}
      </div>
    </DndContext>
  );
};