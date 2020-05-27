import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import {
  AppBar as AppBarComponent,
  Toolbar,
  Typography,
  IconButton,
  Menu,
  MenuItem,
} from '@material-ui/core';
import AccountCircle from '@material-ui/icons/AccountCircle';

import { signOut } from '~/store/modules/auth/actions';

import style from './styles';

function AppBar() {
  const classes = style();
  const dispatch = useDispatch();

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleMenu = (e) => {
    setAnchorEl(e.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  function handleSignOut() {
    dispatch(signOut());
  }

  return (
    <AppBarComponent position="fixed" className={classes.appBar}>
      <Toolbar>
        <Typography variant="h6" className={classes.title}>
          GoBrewery
        </Typography>
        <IconButton
          aria-label="Usuário"
          aria-controls="menu-appbar"
          aria-haspopup="true"
          onClick={handleMenu}
          color="inherit"
        >
          <AccountCircle />
        </IconButton>
        <Menu
          id="menu-appbar"
          anchorEl={anchorEl}
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          keepMounted
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          open={open}
          onClose={handleClose}
        >
          <MenuItem component={Link} to="/profile">
            Perfil
          </MenuItem>
          <MenuItem onClick={handleSignOut}>Sair</MenuItem>
        </Menu>
      </Toolbar>
    </AppBarComponent>
  );
}

export default AppBar;
