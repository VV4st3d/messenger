import { API_ROUTES } from '~/shared/const';
import type {
  TProfile,
  TUpdateProfileResponse,
  TUploadPhotoResponse,
} from '~/shared/types/profile';

export function createProfileRepository(appFetch: typeof $fetch) {
  return {
    getUserProfile(id: string) {
      return appFetch<TProfile>(API_ROUTES.getRouteProfile(id), {
        method: 'GET',
      });
    },
    editProfile(body: FormData) {
      return appFetch<TUpdateProfileResponse>(
        API_ROUTES.getRouteEditProfile(),
        {
          method: 'PATCH',
          body,
        },
      );
    },
    uploadPhoto(body: FormData) {
      return appFetch<TUploadPhotoResponse>(
        API_ROUTES.getRouteUploadProfilePhotos(),
        {
          method: 'POST',
          body,
        },
      );
    },
  };
}
