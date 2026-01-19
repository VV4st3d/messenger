import {type LoginRes, type CheckExist, type CheckExistBody, type LoginBody, type RegisterBody, type RegisterRes} from '~/types/auth'

export function createAuthRepository(appFetch: typeof $fetch) {
  return {
    checkExist(body: CheckExistBody){
      return appFetch<CheckExist>("auth/check-email", {method: "POST", body})
    },
    registration(body: RegisterBody){
      return appFetch<RegisterRes>("auth/register", {method: "POST", body})
    },
    login(body: LoginBody){
      return appFetch<LoginRes>("auth/login", {method: "POST", body})
    }
  };
}
