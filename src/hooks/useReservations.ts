import { useQuery } from '@tanstack/react-query';

import { getReservations } from 'pages/remotes';
import { CACHE_KEYS } from '../constants/cacheKeys';

export default function useReservations(date: string) {
  return useQuery(CACHE_KEYS.reservations(date), () => getReservations(date), {
    enabled: Boolean(date),
  });
}
