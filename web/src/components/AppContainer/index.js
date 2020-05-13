import React from 'react';
import PropTypes from 'prop-types';
import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import AccountCircle from '@material-ui/icons/AccountCircle';

import AppMenu from '~/components/AppMenu';

import useStyles from './styles';

function AppContainer({ children }) {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <AppBar position="fixed" className={classes.appBar}>
        <Toolbar>
          <Typography variant="h6" className={classes.title}>
            GoBrewery
          </Typography>
          <Button color="inherit">
            <AccountCircle />
          </Button>
        </Toolbar>
      </AppBar>
      <Drawer
        className={classes.drawer}
        variant="permanent"
        classes={{
          paper: classes.drawerPaper,
        }}
      >
        <Toolbar />
        <div className={classes.drawerContainer}>
          <AppMenu />
        </div>
      </Drawer>
      <main className={classes.content}>{children}</main>
    </div>
  );
}

export default AppContainer;

AppContainer.propTypes = {
  children: PropTypes.element.isRequired,
};
