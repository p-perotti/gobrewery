import React from 'react';
import PropTypes from 'prop-types';
import Toolbar from '@material-ui/core/Toolbar';

import AppBar from '~/components/AppBar';
import AppDrawer from '~/components/AppDrawer';

import style from './styles';

function AppContainer({ children }) {
  const classes = style();

  return (
    <div className={classes.root}>
      <AppBar />
      <AppDrawer />
      <main className={classes.main}>
        <div className={classes.content}>
          <Toolbar />
          {children}
        </div>
      </main>
    </div>
  );
}

AppContainer.propTypes = {
  children: PropTypes.element.isRequired,
};

export default AppContainer;
