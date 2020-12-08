import React, { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import {
  Container,
  Paper,
  Typography,
  Grid,
  Button,
  Backdrop,
  CircularProgress,
} from '@material-ui/core';
import Save from '@material-ui/icons/Save';
import { Formik, Field, Form } from 'formik';
import { TextField } from 'formik-material-ui';
import * as Yup from 'yup';

import Loader from '~/components/Loader';

import api from '~/services/api';
import history from '~/services/history';

import { showSnackbar } from '~/store/modules/ui/actions';

import style from './styles';

function ProfileForm() {
  const classes = style();

  const dispatch = useDispatch();

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [initialValues, setInitialValues] = useState({
    name: '',
    email: '',
    oldPassword: '',
    password: '',
    confirmPassword: '',
  });

  const loadValues = useCallback(async () => {
    const res = await api.get('profile');
    if (res.data) {
      const { name, email } = res.data;
      setInitialValues({
        name,
        email,
      });
    }
  }, []);

  const validationSchema = Yup.object().shape({
    name: Yup.string().required('Obrigatório.'),
    email: Yup.string().email('E-mail inválido.').required('Obrigatório.'),
    oldPassword: Yup.string().min(6, 'Mínimo de 6 caracteres.'),
    password: Yup.string()
      .min(6)
      .when('oldPassword', (oldPassword, field) =>
        oldPassword ? field.required('Obrigatório.') : field
      ),
    confirmPassword: Yup.string().when('password', (password, field) =>
      password
        ? field
            .required('Obrigatório.')
            .oneOf(
              [Yup.ref('password')],
              'Confirmação de senha deve ser igual a nova senha.'
            )
        : field
    ),
  });

  const handleSubmit = async (values) => {
    try {
      setIsSubmitting(true);
      await api.put('/profile', values);
      setIsSubmitting(false);
      dispatch(showSnackbar('success', 'Salvo com sucesso.'));
      history.push('/profile');
    } catch (error) {
      setIsSubmitting(false);
      dispatch(showSnackbar('error', 'Não foi possível salvar.'));
    }
  };

  return (
    <Container maxWidth="md">
      <Paper>
        <Loader loadFunction={loadValues}>
          <Formik
            enableReinitialize
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            <Form>
              <Typography
                variant="h6"
                color="primary"
                className={classes.title}
              >
                Perfil
              </Typography>
              <Grid container spacing={1} className={classes.container}>
                <Grid item xs={12}>
                  <Field
                    component={TextField}
                    type="text"
                    label="Nome"
                    name="name"
                    variant="outlined"
                    size="small"
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12}>
                  <Field
                    component={TextField}
                    type="text"
                    label="E-mail"
                    name="email"
                    variant="outlined"
                    size="small"
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12}>
                  <Field
                    component={TextField}
                    type="password"
                    label="Senha atual"
                    name="oldPassword"
                    variant="outlined"
                    size="small"
                    fullWidth
                    inputProps={{
                      form: {
                        autocomplete: 'off',
                      },
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Field
                    component={TextField}
                    type="password"
                    label="Nova senha"
                    name="password"
                    variant="outlined"
                    size="small"
                    fullWidth
                    inputProps={{
                      form: {
                        autocomplete: 'off',
                      },
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Field
                    component={TextField}
                    type="password"
                    label="Confirmação de senha"
                    name="confirmPassword"
                    variant="outlined"
                    size="small"
                    fullWidth
                    inputProps={{
                      form: {
                        autocomplete: 'off',
                      },
                    }}
                  />
                </Grid>
                <Grid item xs={12} className={classes.buttons}>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    disabled={isSubmitting}
                    className={classes.button}
                    startIcon={<Save />}
                  >
                    Salvar
                  </Button>
                  <Button
                    type="button"
                    variant="outlined"
                    color="primary"
                    component={Link}
                    to="/profile"
                  >
                    Voltar
                  </Button>
                </Grid>
              </Grid>
            </Form>
          </Formik>
        </Loader>
        <Backdrop open={isSubmitting} className={classes.backdrop}>
          <CircularProgress color="primary" />
        </Backdrop>
      </Paper>
    </Container>
  );
}

export default ProfileForm;
