import React, { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Container,
  Paper,
  Badge,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Backdrop,
  CircularProgress,
} from '@material-ui/core';
import { PhotoCamera, SupervisorAccount, Edit } from '@material-ui/icons';

import Loader from '~/components/Loader';

import api from '~/services/api';

import {
  updateAvatarRequest,
  deleteAvatarRequest,
} from '~/store/modules/user/actions';
import { showSnackbar } from '~/store/modules/ui/actions';

import style from './styles';

function Profile() {
  const classes = style();

  const dispatch = useDispatch();

  const avatar = useSelector((state) => state.user.avatar);
  const isSubmitting = useSelector((state) => state.user.submitting);

  const [anchorEl, setAnchorEl] = useState(null);
  const [profile, setProfile] = useState({});
  const [dialogOpen, setDialogOpen] = useState(false);

  const loadProfile = useCallback(async () => {
    const res = await api.get('/profile');
    if (res.data) {
      const { name, email, administrator } = res.data;
      setProfile({
        name,
        email,
        administrator,
      });
    }
  }, []);

  const open = Boolean(anchorEl);

  const handleMenu = (e) => {
    setAnchorEl(e.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  async function handleUpdateAvatar(e) {
    handleCloseMenu();
    try {
      const data = new FormData();
      data.append('file', e.target.files[0]);
      dispatch(updateAvatarRequest(data));
    } catch (error) {
      dispatch(
        showSnackbar(
          'error',
          'Não foi possível selecionar a imagem de perfil, tente novamente.'
        )
      );
    }
  }

  const handleCloseCancelDialog = () => setDialogOpen(false);

  const handleRemoveAvatarRequest = () => {
    handleCloseMenu();
    setDialogOpen(true);
  };

  async function handleDeleteAvatar() {
    handleCloseMenu();
    handleCloseCancelDialog();
    dispatch(deleteAvatarRequest());
  }

  return (
    <>
      <Container maxWidth="md">
        <Paper className={classes.paper}>
          <Loader loadFunction={loadProfile}>
            <>
              <Badge
                overlap="circle"
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'right',
                }}
                badgeContent={
                  <div className={classes.badge}>
                    <IconButton
                      color="primary"
                      component="span"
                      onClick={handleMenu}
                    >
                      <PhotoCamera />
                    </IconButton>
                    <Menu
                      id="menu-avatar"
                      anchorEl={anchorEl}
                      anchorOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                      }}
                      open={open}
                      onClose={handleCloseMenu}
                    >
                      <label htmlFor="product-image-file">
                        <input
                          accept="image/*"
                          id="product-image-file"
                          type="file"
                          hidden
                          onChange={handleUpdateAvatar}
                        />
                        <MenuItem>
                          {avatar ? 'Alterar' : 'Adicionar'}...
                        </MenuItem>
                      </label>
                      {avatar && (
                        <MenuItem onClick={handleRemoveAvatarRequest}>
                          Remover
                        </MenuItem>
                      )}
                    </Menu>
                  </div>
                }
              >
                <Avatar src={avatar} className={classes.avatar} />
              </Badge>
              <Typography variant="h4" color="primary" className={classes.name}>
                {profile.name} {profile.administrator && <SupervisorAccount />}
              </Typography>
              <Typography variant="subtitle1" className={classes.email}>
                {profile.email}
              </Typography>
              <div>
                <Button
                  variant="contained"
                  color="primary"
                  component={Link}
                  to="/profile/edit"
                  startIcon={<Edit />}
                >
                  Editar
                </Button>
              </div>
            </>
          </Loader>
        </Paper>
      </Container>
      <Dialog open={dialogOpen} onClose={handleCloseCancelDialog}>
        <DialogTitle>
          <Typography component="span" variant="h6" color="primary">
            Confirma a remoção da imagem de perfil?
          </Typography>
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Essa operação é permanente e não pode ser desfeita.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseCancelDialog} autoFocus>
            Voltar
          </Button>
          <Button onClick={handleDeleteAvatar} color="primary">
            Confirmar
          </Button>
        </DialogActions>
      </Dialog>
      <Backdrop open={isSubmitting} className={classes.backdrop}>
        <CircularProgress color="primary" />
      </Backdrop>
    </>
  );
}

export default Profile;
