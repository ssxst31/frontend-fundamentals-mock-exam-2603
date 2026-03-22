export interface Reservation {
  id: string;
  roomId: string;
  date: string;
  start: string;
  end: string;
  attendees: number;
  equipment: string[];
}

export type ReservationInput = Omit<Reservation, 'id'>;

export type ReservationResult = { ok: true; reservation?: unknown } | { ok: false; message: string };
