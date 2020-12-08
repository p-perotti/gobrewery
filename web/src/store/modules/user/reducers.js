import produce from 'immer';

const INITIAL_STATE = {
  avatar: null,
  administrator: null,
  submitting: false,
};

export default function user(state = INITIAL_STATE, action) {
  return produce(state, (draft) => {
    switch (action.type) {
      case '@auth/SIGN_IN_SUCCESS': {
        draft.administrator = action.payload.user.administrator;
        draft.avatar = action.payload.user.avatar
          ? action.payload.user.avatar.url
          : null;
        break;
      }
      case '@user/UPDATE_AVATAR_REQUEST': {
        draft.submitting = true;
        break;
      }
      case '@user/UPDATE_AVATAR_SUCCESS': {
        draft.avatar = action.payload.avatar.url;
        draft.submitting = false;
        break;
      }
      case '@user/UPDATE_AVATAR_FAILURE': {
        draft.submitting = false;
        break;
      }
      case '@user/DELETE_AVATAR_REQUEST': {
        draft.submitting = true;
        break;
      }
      case '@user/DELETE_AVATAR_SUCCESS': {
        draft.avatar = null;
        draft.submitting = false;
        break;
      }
      case '@user/DELETE_AVATAR_FAILURE': {
        draft.submitting = false;
        break;
      }
      case '@auth/SIGN_OUT': {
        draft.administrator = null;
        draft.avatar = null;
        break;
      }
      default:
    }
  });
}
