import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Container,
  Paper,
  Button,
  TextField,
  Typography,
  CircularProgress,
} from '@material-ui/core';

import style from './styles';

import {
  signInRequest,
  signInGuestRequest,
} from '~/store/modules/auth/actions';

export default function SignIn() {
  const classes = style();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const dispatch = useDispatch();

  const loading = useSelector((state) => state.auth.loading);

  function handleSubmit(e) {
    e.preventDefault();
    dispatch(signInRequest(email, password));
  }

  function handleGuestAccess() {
    dispatch(signInGuestRequest());
  }

  return (
    <Container component="main" maxWidth="sm" className={classes.root}>
      <Paper className={classes.paper}>
        <Typography
          component="h1"
          variant="h3"
          color="primary"
          className={classes.title}
        >
          GoBrewery
        </Typography>
        <form className={classes.form} onSubmit={handleSubmit}>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="email"
            label="E-mail"
            name="email"
            autoComplete="email"
            autoFocus
            value={email}
            onInput={(e) => setEmail(e.target.value)}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password"
            label="Senha"
            type="password"
            id="password"
            autoComplete="current-password"
            value={password}
            onInput={(e) => setPassword(e.target.value)}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            disabled={loading}
            className={classes.submit}
          >
            Entrar
            {loading && (
              <CircularProgress size={24} className={classes.progress} />
            )}
          </Button>
          <Button
            fullWidth
            variant="outlined"
            color="primary"
            disabled={loading}
            onClick={handleGuestAccess}
          >
            Entrar como visitante
          </Button>
        </form>
      </Paper>
    </Container>
  );
}
