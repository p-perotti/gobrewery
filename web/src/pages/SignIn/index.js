import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import Container from '@material-ui/core/Container';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
// import FormControlLabel from '@material-ui/core/FormControlLabel';
// import Checkbox from '@material-ui/core/Checkbox';
// import Link from '@material-ui/core/Link';
// import Grid from '@material-ui/core/Grid';
// import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import style from './styles';

import { signInRequest } from '~/store/modules/auth/actions';

export default function SignIn() {
  const classes = style();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const dispatch = useDispatch();

  function handleSubmit(e) {
    e.preventDefault();
    dispatch(signInRequest(email, password));
  }

  return (
    <Container component="main" maxWidth="sm" className={classes.root}>
      <Paper className={classes.paper}>
        <Typography component="h1" variant="h3" className={classes.title}>
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
          {/* <FormControlLabel
            control={<Checkbox value="remember" color="primary" />}
            label="Lembrar-me"
          /> */}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
          >
            Acessar
          </Button>
          {/* <Grid container>
            <Grid item xs>
              <Link href="/" variant="body2">
                Esqueceu a senha?
              </Link>
            </Grid>
          </Grid> */}
        </form>
      </Paper>
    </Container>
  );
}
