import React, { useState, useCallback, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Paper,
  Typography,
  Grid,
  FormControlLabel,
  Button,
  Backdrop,
  CircularProgress,
} from '@material-ui/core';
import Save from '@material-ui/icons/Save';
import { Formik, Field, Form } from 'formik';
import { TextField, Switch } from 'formik-material-ui';
import * as Yup from 'yup';

import Loader from '~/components/Loader';

import api from '~/services/api';
import history from '~/services/history';

import { showSnackbar } from '~/store/modules/ui/actions';

import style from './styles';

function UserForm() {
  const classes = style();

  const dispatch = useDispatch();
  const isGuest = useSelector((state) => state.user.guest);

  const { id } = useParams();
  const isViewMode = isGuest && !!id;

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [initialValues, setInitialValues] = useState({
    name: '',
    email: '',
    active: true,
    administrator: false,
  });

  const loadValues = useCallback(async () => {
    if (id) {
      const res = await api.get(`users/${id}`);
      if (res.data) {
        const { name, email, active, administrator } = res.data;
        setInitialValues({ name, email, active, administrator });
      }
    }
  }, [id]);

  const validationSchema = Yup.object().shape({
    name: Yup.string().required('Obrigatório.'),
    email: Yup.string().email('E-mail inválido.').required('Obrigatório.'),
  });

  const handleSubmit = async (values) => {
    try {
      setIsSubmitting(true);
      if (id) {
        await api.put(`users/${id}`, values);
      } else {
        const data = { ...values, password: 'gobrewery' };
        await api.post('users', data);
      }
      setIsSubmitting(false);
      dispatch(showSnackbar('success', 'Salvo com sucesso.'));
      history.push('/users');
    } catch (error) {
      setIsSubmitting(false);
      dispatch(showSnackbar('error', 'Não foi possível salvar.'));
    }
  };

  useEffect(() => {
    if (isGuest && !id) {
      dispatch(showSnackbar('info', 'Acesso de visitante é somente leitura.'));
      history.replace('/users');
    }
  }, [dispatch, id, isGuest]);

  if (isGuest && !id) {
    return null;
  }

  return (
    <Paper>
      <Loader loadFunction={loadValues}>
        <Formik
          enableReinitialize
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          <Form>
            <Typography variant="h6" color="primary" className={classes.title}>
              Usuário {!id && '(Novo)'}
            </Typography>
            <Grid container spacing={1} className={classes.container}>
              <Grid item xs={6}>
                <Field
                  component={TextField}
                  type="text"
                  label="Nome"
                  name="name"
                  variant="outlined"
                  size="small"
                  fullWidth
                  disabled={isViewMode}
                />
              </Grid>
              <Grid item xs={6}>
                <Field
                  component={TextField}
                  type="text"
                  label="E-mail"
                  name="email"
                  variant="outlined"
                  size="small"
                  fullWidth
                  disabled={isViewMode}
                />
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Field
                      component={Switch}
                      name="active"
                      type="checkbox"
                      disabled={isViewMode}
                    />
                  }
                  label="Ativo"
                />
                <FormControlLabel
                  control={
                    <Field
                      component={Switch}
                      name="administrator"
                      type="checkbox"
                      disabled={isViewMode}
                    />
                  }
                  label="Administrador"
                />
              </Grid>
              <Grid item xs={12} className={classes.buttons}>
                {!isViewMode && (
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
                )}
                <Button
                  type="button"
                  variant="outlined"
                  color="primary"
                  component={Link}
                  to="/users"
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
  );
}

export default UserForm;
