export type TEvents =
  | 'chat-open'
  | 'send-request'
  | 'cancel-request'
  | 'accept-request'
  | 'delete-friend'
  | 'reject-request';

export interface IActionButtonValue {
  buttonLabel: string;
  icon: string;
  eventName: TEvents;
  isDanger?: boolean;
}
