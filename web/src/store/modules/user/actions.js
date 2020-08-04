export function updateAvatarRequest(data) {
  return {
    type: '@user/UPDATE_AVATAR_REQUEST',
    payload: { data },
  };
}

export function updateAvatarSuccess(avatar) {
  return {
    type: '@user/UPDATE_AVATAR_SUCCESS',
    payload: { avatar },
  };
}

export function updateAvatarFailure() {
  return {
    type: '@user/UPDATE_AVATAR_FAILURE',
  };
}

export function deleteAvatarRequest() {
  return {
    type: '@user/DELETE_AVATAR_REQUEST',
  };
}

export function deleteAvatarSuccess() {
  return {
    type: '@user/DELETE_AVATAR_SUCCESS',
  };
}

export function deleteAvatarFailure() {
  return {
    type: '@user/DELETE_AVATAR_FAILURE',
  };
}
