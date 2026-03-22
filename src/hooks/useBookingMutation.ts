import { useMutation, useQueryClient } from '@tanstack/react-query';

import { createReservation } from 'pages/remotes';
import { CACHE_KEYS } from '../constants/cacheKeys';

export default function useBookingMutation() {
  const queryClient = useQueryClient();

  return useMutation(createReservation, {
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries(CACHE_KEYS.reservations(variables.date));
      queryClient.invalidateQueries(CACHE_KEYS.myReservations);
    },
  });
}
