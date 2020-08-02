import produce from 'immer';

const INITIAL_STATE = {
  url: null,
  submitting: false,
};

export default function user(state = INITIAL_STATE, action) {
  return produce(state, (draft) => {
    switch (action.type) {
      case '@auth/SIGN_IN_SUCCESS': {
        draft.url = action.payload.user.avatar.url;
        break;
      }
      case '@avatar/UPDATE_REQUEST': {
        draft.submitting = true;
        break;
      }
      case '@avatar/UPDATE_SUCCESS': {
        draft.url = action.payload.avatar.url;
        draft.submitting = false;
        break;
      }
      case '@avatar/UPDATE_FAILURE': {
        draft.submitting = false;
        break;
      }
      case '@avatar/DELETE_REQUEST': {
        draft.submitting = true;
        break;
      }
      case '@avatar/DELETE_SUCCESS': {
        draft.url = null;
        draft.submitting = false;
        break;
      }
      case '@avatar/DELETE_FAILURE': {
        draft.submitting = false;
        break;
      }
      case '@auth/SIGN_OUT': {
        draft.url = null;
        break;
      }
      default:
    }
  });
}
