export const CACHE_KEYS = {
  rooms: ['rooms'] as const,
  reservations: (date?: string) => (date ? (['reservations', date] as const) : (['reservations'] as const)),
  myReservations: ['myReservations'] as const,
};
