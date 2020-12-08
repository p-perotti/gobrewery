import produce from 'immer';

const INITIAL_STATE = {
  snackbarOpen: false,
  snackbarSeverity: '',
  snackbarMessage: '',
};

export default function auth(state = INITIAL_STATE, action) {
  return produce(state, (draft) => {
    switch (action.type) {
      case '@ui/SNACKBAR_SHOW': {
        draft.snackbarOpen = true;
        draft.snackbarSeverity = action.payload.severity;
        draft.snackbarMessage = action.payload.message;
        break;
      }
      case '@ui/SNACKBAR_DISMISS': {
        draft.snackbarOpen = false;
        break;
      }
      default:
    }
  });
}
