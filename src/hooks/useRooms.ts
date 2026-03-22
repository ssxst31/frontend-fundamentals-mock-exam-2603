import { useQuery } from '@tanstack/react-query';

import { getRooms } from 'pages/remotes';
import { CACHE_KEYS } from '../constants/cacheKeys';

export default function useRooms() {
  return useQuery(CACHE_KEYS.rooms, getRooms);
}
