import { css } from '@emotion/react';
import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

import { Top, Spacing, Border, Button, Text } from '_tosslib/components';
import { colors } from '_tosslib/constants/colors';
import useRooms from 'hooks/useRooms';
import useReservations from 'hooks/useReservations';
import useMyReservations from 'hooks/useMyReservations';
import useCancelMutation from 'hooks/useCancelMutation';
import { formatDate } from '../../utils/time';
import type { Room } from '../../types/room';
import ReservationTimeline from '../../components/ReservationTimeline';
import MyReservationList from '../../components/MyReservationList';

const inputStyle = css`
  box-sizing: border-box;
  font-size: 16px;
  font-weight: 500;
  line-height: 1.5;
  height: 48px;
  background-color: ${colors.grey50};
  border-radius: 12px;
  color: ${colors.grey800};
  width: 100%;
  border: 1px solid ${colors.grey200};
  padding: 0 16px;
  outline: none;
  transition: border-color 0.15s;
  &:focus {
    border-color: ${colors.blue500};
  }
`;

export function ReservationStatusPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [date, setDate] = useState(formatDate(new Date()));

  const locationState = location.state as { message?: string } | null;
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(
    locationState?.message ? { type: 'success', text: locationState.message } : null
  );

  useEffect(() => {
    if (locationState?.message) {
      window.history.replaceState({}, '');
    }
  }, [locationState]);

  const { data: rooms = [] } = useRooms();
  const { data: reservations = [] } = useReservations(date);
  const { data: myReservationList = [] } = useMyReservations();
  const cancelMutation = useCancelMutation();

  const handleCancel = async (id: string) => {
    try {
      await cancelMutation.mutateAsync(id);
      setMessage({ type: 'success', text: '예약이 취소되었습니다.' });
    } catch {
      setMessage({ type: 'error', text: '취소에 실패했습니다.' });
    }
  };

  const [activeReservation, setActiveReservation] = useState<string | null>(null);

  const getRoomName = (roomId: string) => rooms.find((r: Room) => r.id === roomId)?.name ?? '(삭제된 회의실)';

  return (
    <div
      css={css`
        background: ${colors.white};
        padding-bottom: 40px;
      `}
    >
      <Top.Top03
        css={css`
          padding-left: 24px;
          padding-right: 24px;
        `}
      >
        회의실 예약
      </Top.Top03>
      <Spacing size={24} />
      <div
        css={css`
          padding: 0 24px;
        `}
      >
        <Text typography="t5" fontWeight="bold" color={colors.grey900}>
          날짜 선택
        </Text>
        <Spacing size={16} />
        <div
          css={css`
            display: flex;
            flex-direction: column;
            gap: 6px;
          `}
        >
          <input
            type="date"
            value={date}
            min={formatDate(new Date())}
            onChange={e => setDate(e.target.value)}
            aria-label="날짜"
            css={inputStyle}
          />
        </div>
      </div>
      <Spacing size={24} />
      <Border size={8} />
      <Spacing size={24} />
      <ReservationTimeline
        rooms={rooms}
        reservations={reservations}
        activeReservation={activeReservation}
        onToggleReservation={(id: string) => setActiveReservation(prev => (prev === id ? null : id))}
      />
      <Spacing size={24} />
      <Border size={8} />
      <Spacing size={24} />
      {message && (
        <div
          css={css`
            padding: 0 24px;
          `}
        >
          <div
            css={css`
              padding: 10px 14px;
              border-radius: 10px;
              background: ${message.type === 'success' ? colors.blue50 : colors.red50};
              display: flex;
              align-items: center;
              gap: 8px;
            `}
          >
            <Text
              typography="t7"
              fontWeight="medium"
              color={message.type === 'success' ? colors.blue600 : colors.red500}
            >
              {message.text}
            </Text>
          </div>
          <Spacing size={12} />
        </div>
      )}
      <MyReservationList myReservations={myReservationList} getRoomName={getRoomName} onCancel={handleCancel} />
      <Spacing size={24} />
      <Border size={8} />
      <Spacing size={24} />
      <div
        css={css`
          padding: 0 24px;
        `}
      >
        <Button display="full" onClick={() => navigate('/booking')}>
          예약하기
        </Button>
      </div>
      <Spacing size={24} />
    </div>
  );
}
