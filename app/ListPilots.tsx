"use client";

import { FC, useCallback } from "react";
import { DndContext, DragEndEvent, UniqueIdentifier } from "@dnd-kit/core";
import {
  SortableContext,
  SortingStrategy,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import Pilot from "./Pilot";

import type { StaticImageData } from "next/image";
import { Flipped, Flipper } from "react-flip-toolkit";

export interface PilotData {
  id: UniqueIdentifier;
  nombre: string;
   posicion: number;
  imagen: StaticImageData | string;
  [key: string]: any;
}

export interface ListPilotsProps {
  pilots: PilotData[];
  onDragEnd: (event: DragEndEvent) => void;
  strategy?: SortingStrategy;
  sensors?: any;
  modifiers?: any;
  columns?: number;
  disabled?: boolean;
}

export const ListPilots: FC<ListPilotsProps> = ({
  pilots,
  onDragEnd,
  strategy = verticalListSortingStrategy,
  sensors,
  modifiers,
  columns = 1,
  disabled = false,
}) => {
  const midIndex = Math.ceil(pilots.length / 2);
  const column1 = pilots.slice(0, midIndex);
  const column2 = pilots.slice(midIndex);

  // Función para animar elementos que se mueven entre columnas
  const onElementAppear = useCallback((el: HTMLElement, index: number) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(-20px)';
    
    setTimeout(() => {
      el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
      el.style.opacity = '1';
      el.style.transform = 'translateY(0)';
    }, 50);
  }, []);

  const onExit = useCallback((el: HTMLElement, index: number, removeElement: () => void) => {
    el.style.transition = 'opacity 0.3s ease-out';
    el.style.opacity = '0';
    
    setTimeout(removeElement, 300);
  }, []);

  return (
    <DndContext sensors={sensors} onDragEnd={onDragEnd} modifiers={modifiers}>
      <SortableContext items={pilots.map((p) => p.id)} strategy={strategy} disabled={disabled}>
        <Flipper 
          flipKey={pilots.map(p => `${p.id}-${p.posicion}`).join('-')}
          spring={{
            stiffness: 200,
            damping: 25,
          }}
          staggerConfig={{
            default: {
              speed: 0.5,
            },
          }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
            <div className="flex flex-col gap-4">
              {column1.map((piloto) => (
                <Flipped 
                  key={piloto.id} 
                  flipId={piloto.id}
                  onAppear={onElementAppear}
                  onExit={onExit}
                  stagger
                >
                  <div>
                    <Pilot piloto={piloto} disabled={disabled} />
                  </div>
                </Flipped>
              ))}
            </div>
            <div className="flex flex-col gap-4">
              {column2.map((piloto) => (
                <Flipped 
                  key={piloto.id} 
                  flipId={piloto.id}
                  onAppear={onElementAppear}
                  onExit={onExit}
                  stagger
                >
                  <div>
                    <Pilot piloto={piloto} disabled={disabled} />
                  </div>
                </Flipped>
              ))}
            </div>
          </div>
        </Flipper>
      </SortableContext>
    </DndContext>
  );
};