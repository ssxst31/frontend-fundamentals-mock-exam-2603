import { css } from '@emotion/react';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import axios from 'axios';

import { Top, Spacing, Border, Button, Text } from '_tosslib/components';
import { colors } from '_tosslib/constants/colors';
import useRooms from 'hooks/useRooms';
import useReservations from 'hooks/useReservations';
import useBookingMutation from 'hooks/useBookingMutation';
import BookingFilterSection from '../../components/BookingFilterSection';
import AvailableRoomSection from '../../components/AvailableRoomSection';
import useAvailableRooms from '../../hooks/useAvailableRooms';
import useBookingFilter from '../../hooks/useBookingFilter';
import type { Room } from '../../types/room';
import type { Reservation, ReservationResult } from '../../types/reservation';

export function RoomBookingPage() {
  const navigate = useNavigate();

  const {
    date,
    setDate,
    startTime,
    setStartTime,
    endTime,
    setEndTime,
    attendees,
    setAttendees,
    equipment,
    setEquipment,
    preferredFloor,
    setPreferredFloor,
  } = useBookingFilter();

  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const { data: rooms = [] } = useRooms();
  const { data: reservations = [] } = useReservations(date);
  const createMutation = useBookingMutation();

  const resetSelection = () => {
    setSelectedRoomId(null);
    setErrorMessage(null);
  };

  const hasTimeInputs = startTime !== '' && endTime !== '';

  let validationError: string | null = null;

  if (hasTimeInputs) {
    if (endTime <= startTime) {
      validationError = '종료 시간은 시작 시간보다 늦어야 합니다.';
    } else if (attendees < 1) {
      validationError = '참석 인원은 1명 이상이어야 합니다.';
    }
  }

  const isFilterComplete = hasTimeInputs && !validationError;

  const floors = [...new Set(rooms.map((r: Room) => r.floor))].sort((a: number, b: number) => a - b);

  const availableRooms = useAvailableRooms({
    rooms,
    reservations,
    date,
    startTime,
    endTime,
    attendees,
    equipment,
    preferredFloor,
    isFilterComplete,
  });

  const handleBook = async () => {
    if (!selectedRoomId) {
      setErrorMessage('회의실을 선택해주세요.');
      return;
    }
    if (!startTime || !endTime) {
      setErrorMessage('시작 시간과 종료 시간을 선택해주세요.');
      return;
    }

    try {
      const result = (await createMutation.mutateAsync({
        roomId: selectedRoomId,
        date,
        start: startTime,
        end: endTime,
        attendees,
        equipment,
      })) as ReservationResult;

      if (result.ok) {
        navigate('/', { state: { message: '예약이 완료되었습니다!' } });
        return;
      }

      setErrorMessage(result.message);
      setSelectedRoomId(null);
    } catch (err: unknown) {
      let serverMessage = '예약에 실패했습니다.';
      if (axios.isAxiosError(err)) {
        const data = err.response?.data as { message?: string } | undefined;
        serverMessage = data?.message ?? serverMessage;
      }
      setErrorMessage(serverMessage);
      setSelectedRoomId(null);
    }
  };

  return (
    <div
      css={css`
        background: ${colors.white};
        padding-bottom: 40px;
      `}
    >
      <div
        css={css`
          padding: 12px 24px 0;
        `}
      >
        <button
          type="button"
          onClick={() => navigate('/')}
          aria-label="뒤로가기"
          css={css`
            background: none;
            border: none;
            padding: 0;
            cursor: pointer;
            font-size: 14px;
            color: ${colors.grey600};
            &:hover {
              color: ${colors.grey900};
            }
          `}
        >
          ← 예약 현황으로
        </button>
      </div>
      <Top.Top03
        css={css`
          padding-left: 24px;
          padding-right: 24px;
        `}
      >
        예약하기
      </Top.Top03>
      {errorMessage && (
        <div
          css={css`
            padding: 0 24px;
          `}
        >
          <Spacing size={12} />
          <div
            css={css`
              padding: 10px 14px;
              border-radius: 10px;
              background: ${colors.red50};
              display: flex;
              align-items: center;
              gap: 8px;
            `}
          >
            <Text typography="t7" fontWeight="medium" color={colors.red500}>
              {errorMessage}
            </Text>
          </div>
        </div>
      )}
      <Spacing size={24} />
      <BookingFilterSection
        date={date}
        startTime={startTime}
        endTime={endTime}
        attendees={attendees}
        equipment={equipment}
        preferredFloor={preferredFloor}
        floors={floors}
        validationError={validationError}
        onDateChange={(v: string) => {
          setDate(v);
          resetSelection();
        }}
        onStartTimeChange={(v: string) => {
          setStartTime(v);
          resetSelection();
        }}
        onEndTimeChange={(v: string) => {
          setEndTime(v);
          resetSelection();
        }}
        onAttendeesChange={(v: number) => {
          setAttendees(v);
          resetSelection();
        }}
        onEquipmentToggle={(eq: string) => {
          const next = equipment.includes(eq) ? equipment.filter(e => e !== eq) : [...equipment, eq];
          setEquipment(next);
          resetSelection();
        }}
        onFloorChange={(v: number | null) => {
          setPreferredFloor(v);
          resetSelection();
        }}
      />
      <Spacing size={24} />
      <Border size={8} />
      <Spacing size={24} />
      {isFilterComplete && (
        <AvailableRoomSection
          availableRooms={availableRooms}
          selectedRoomId={selectedRoomId}
          isBooking={createMutation.isLoading}
          onSelectRoom={setSelectedRoomId}
          onBook={handleBook}
        />
      )}
      <Spacing size={24} />
    </div>
  );
}
