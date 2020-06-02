export function showSnackbar(severity, message) {
  return {
    type: '@ui/SNACKBAR_SHOW',
    payload: { severity, message },
  };
}

export function dismissSnackbar() {
  return {
    type: '@ui/SNACKBAR_DISMISS',
  };
}
