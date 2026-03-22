import { useMutation, useQueryClient } from '@tanstack/react-query';

import { cancelReservation } from 'pages/remotes';
import { CACHE_KEYS } from '../constants/cacheKeys';

export default function useCancelMutation() {
  const queryClient = useQueryClient();

  return useMutation(cancelReservation, {
    onSuccess: () => {
      queryClient.invalidateQueries(CACHE_KEYS.reservations());
      queryClient.invalidateQueries(CACHE_KEYS.myReservations);
    },
  });
}
