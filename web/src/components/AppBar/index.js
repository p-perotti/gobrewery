import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import {
  AppBar as AppBarMUI,
  Toolbar,
  Typography,
  Avatar,
  IconButton,
  Menu,
  MenuItem,
} from '@material-ui/core';

import { signOut } from '~/store/modules/auth/actions';

import style from './styles';

function AppBar() {
  const classes = style();
  const dispatch = useDispatch();

  const avatar = useSelector((state) => state.avatar.url);

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
    <AppBarMUI position="fixed" className={classes.appBar}>
      <Toolbar>
        <Typography variant="h6" className={classes.title}>
          GoBrewery
        </Typography>
        <IconButton onClick={handleMenu} color="inherit">
          <Avatar src={avatar} />
        </IconButton>
        <Menu
          id="menu-appbar"
          anchorEl={anchorEl}
          getContentAnchorEl={null}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
          transformOrigin={{ vertical: 'top', horizontal: 'center' }}
          open={open}
          onClose={handleClose}
        >
          <MenuItem onClick={handleClose} component={Link} to="/profile">
            Perfil
          </MenuItem>
          <MenuItem onClick={handleSignOut}>Sair</MenuItem>
        </Menu>
      </Toolbar>
    </AppBarMUI>
  );
}

export default AppBar;
