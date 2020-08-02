import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { CircularProgress, Typography, Button } from '@material-ui/core';
import Refresh from '@material-ui/icons/Refresh';

import style from './styles';

function Loader({ loadFunction, children }) {
  const classes = style();

  const [state, setState] = useState({});

  const handleLoad = useCallback(async () => {
    try {
      setState({ isLoading: true, loadError: false });
      await loadFunction();
      setState({ isLoading: false, loadError: false });
    } catch (error) {
      setState({ isLoading: false, loadError: true });
    }
  }, [loadFunction]);

  useEffect(() => {
    handleLoad();
  }, [handleLoad]);

  return (
    <>
      {state.isLoading && (
        <div className={classes.wrapper}>
          <CircularProgress className={classes.item} />
        </div>
      )}
      {state.loadError && (
        <div className={classes.wrapper}>
          <Typography variant="body1" className={classes.item}>
            Algo deu errado.
          </Typography>
          <Button
            type="button"
            variant="outlined"
            color="primary"
            className={classes.item}
            onClick={handleLoad}
          >
            <Refresh /> Tentar novamente
          </Button>
        </div>
      )}
      {!state.isLoading && !state.loadError && children}
    </>
  );
}

Loader.propTypes = {
  loadFunction: PropTypes.func.isRequired,
  children: PropTypes.element.isRequired,
};

export default Loader;
