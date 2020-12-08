import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Snackbar from '@material-ui/core/Snackbar';
import Alert from '@material-ui/lab/Alert';

import { dismissSnackbar } from '~/store/modules/ui/actions';

function SnackbarProvider() {
  const dispatch = useDispatch();

  const { snackbarOpen, snackbarSeverity, snackbarMessage } = useSelector(
    (state) => state.ui
  );

  function handleCloseAction() {
    dispatch(dismissSnackbar());
  }

  function handleCloseSnackbar(_e, reason) {
    if (snackbarOpen && reason === 'timeout') dispatch(dismissSnackbar());
  }

  return (
    <Snackbar
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'center',
      }}
      open={snackbarOpen}
      autoHideDuration={5000}
      onClose={handleCloseSnackbar}
    >
      <Alert
        severity={snackbarSeverity}
        elevation={6}
        variant="filled"
        onClose={handleCloseAction}
      >
        {snackbarMessage}
      </Alert>
    </Snackbar>
  );
}

export default SnackbarProvider;
