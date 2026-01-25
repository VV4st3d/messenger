import {
  getAPIRouteAuthMe,
  getAPIRouteLogin,
  getAPIRouteRegister,
} from '~/shared/const';
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
      return appFetch<TCheckExist>(getAPIRouteAuthMe(), {
        method: 'POST',
        body,
      });
    },
    registration(body: IRegisterBody) {
      return appFetch<TAuthenticationRes>(getAPIRouteRegister(), {
        method: 'POST',
        body,
      });
    },
    login(body: ILoginBody) {
      return appFetch<TAuthenticationRes>(getAPIRouteLogin(), {
        method: 'POST',
        body,
      });
    },
    me() {
      return appFetch<TUserInitRes>(getAPIRouteAuthMe(), { method: 'GET' });
    },
  };
}
