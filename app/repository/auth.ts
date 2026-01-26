import { API_ROUTES } from '~/shared/const';
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
      return appFetch<TCheckExist>(API_ROUTES.getRouteCheckEmail(), {
        method: 'POST',
        body,
      });
    },
    registration(body: IRegisterBody) {
      return appFetch<TAuthenticationRes>(API_ROUTES.getRouteRegister(), {
        method: 'POST',
        body,
      });
    },
    login(body: ILoginBody) {
      return appFetch<TAuthenticationRes>(API_ROUTES.getRouteLogin(), {
        method: 'POST',
        body,
      });
    },
    me() {
      return appFetch<TUserInitRes>(API_ROUTES.getRouteAuthMe(), {
        method: 'GET',
      });
    },
  };
}
