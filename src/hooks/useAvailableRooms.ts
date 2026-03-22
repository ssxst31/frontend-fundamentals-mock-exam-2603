import { useMemo } from 'react';

import type { Room } from '../types/room';
import type { Reservation } from '../types/reservation';

interface UseAvailableRoomsParams {
  rooms: Room[];
  reservations: Reservation[];
  date: string;
  startTime: string;
  endTime: string;
  attendees: number;
  equipment: string[];
  preferredFloor: number | null;
  isFilterComplete: boolean;
}

export default function useAvailableRooms({
  rooms,
  reservations,
  date,
  startTime,
  endTime,
  attendees,
  equipment,
  preferredFloor,
  isFilterComplete,
}: UseAvailableRoomsParams) {
  return useMemo(() => {
    if (!isFilterComplete) {
      return [];
    }

    return rooms
      .filter((room: Room) => {
        const hasEnoughCapacity = room.capacity >= attendees;
        const hasRequiredEquipment = equipment.every(eq => room.equipment.includes(eq));
        const isOnPreferredFloor = preferredFloor === null || room.floor === preferredFloor;
        const hasNoTimeConflict = !reservations.some(
          (r: Reservation) => r.roomId === room.id && r.date === date && r.start < endTime && r.end > startTime
        );
        return hasEnoughCapacity && hasRequiredEquipment && isOnPreferredFloor && hasNoTimeConflict;
      })
      .sort((a: Room, b: Room) => {
        if (a.floor !== b.floor) {
          return a.floor - b.floor;
        }
        return a.name.localeCompare(b.name);
      });
  }, [rooms, reservations, date, startTime, endTime, attendees, equipment, preferredFloor, isFilterComplete]);
}
