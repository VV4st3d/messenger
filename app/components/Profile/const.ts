import type { TFriendRequestStatus } from '~/shared/types/profile';
import type { IActionButtonValue } from './type';

export const actionButtonsMap: Record<
  TFriendRequestStatus,
  IActionButtonValue[]
> = {
  none: [
    {
      buttonLabel: 'Добавить',
      icon: 'user-plus',
      eventName: 'send-request',
    },
  ],
  sent: [
    {
      buttonLabel: 'Отмена',
      icon: 'clock',
      eventName: 'cancel-request',
    },
  ],
  received: [
    {
      buttonLabel: 'Принять',
      icon: 'check',
      eventName: 'accept-request',
    },
    {
      buttonLabel: 'Отклонить',
      icon: 'x-mark',
      eventName: 'reject-request',
      isDanger: true,
    },
  ],
  friends: [
    {
      buttonLabel: 'Убрать из друзей',
      icon: 'user-minus',
      eventName: 'delete-friend',
      isDanger: true,
    },
  ],
};
