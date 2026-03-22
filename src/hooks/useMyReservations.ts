import { useQuery } from '@tanstack/react-query';

import { getMyReservations } from 'pages/remotes';
import { CACHE_KEYS } from '../constants/cacheKeys';

export default function useMyReservations() {
  return useQuery(CACHE_KEYS.myReservations, getMyReservations);
}
