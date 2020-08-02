export function updateAvatarRequest(data) {
  return {
    type: '@avatar/UPDATE_REQUEST',
    payload: { data },
  };
}

export function updateAvatarSuccess(avatar) {
  return {
    type: '@avatar/UPDATE_SUCCESS',
    payload: { avatar },
  };
}

export function updateAvatarFailure() {
  return {
    type: '@avatar/UPDATE_FAILURE',
  };
}

export function deleteAvatarRequest() {
  return {
    type: '@avatar/DELETE_REQUEST',
  };
}

export function deleteAvatarSuccess() {
  return {
    type: '@avatar/DELETE_SUCCESS',
  };
}

export function deleteAvatarFailure() {
  return {
    type: '@avatar/DELETE_FAILURE',
  };
}
