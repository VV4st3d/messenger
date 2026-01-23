import type {
  TAuthenticationRes,
  TCheckExist,
  TCheckExistBody,
  ILoginBody,
  IRegisterBody,
  TUserInitRes,
} from '~/shared/types';

export function createAuthRepository(appFetch: typeof $fetch) {
  return {
    checkExist(body: TCheckExistBody) {
      return appFetch<TCheckExist>('auth/check-email', {
        method: 'POST',
        body,
      });
    },
    registration(body: IRegisterBody) {
      return appFetch<TAuthenticationRes>('auth/register', {
        method: 'POST',
        body,
      });
    },
    login(body: ILoginBody) {
      return appFetch<TAuthenticationRes>('auth/login', {
        method: 'POST',
        body,
      });
    },
    me() {
      return appFetch<TUserInitRes>('auth/me', { method: 'GET' });
    },
  };
}
