import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import {
  Paper,
  Typography,
  Grid,
  FormControlLabel,
  Button,
} from '@material-ui/core';
import { Formik, Field, Form as FormComponent } from 'formik';
import { TextField, Switch } from 'formik-material-ui';
import * as Yup from 'yup';

import api from '~/services/api';
import history from '~/services/history';

import { showSnackbar } from '~/store/modules/ui/actions';

import style from './styles';

const Form = () => {
  const classes = style();

  const dispatch = useDispatch();

  const { id } = useParams();

  const [state, setState] = useState({
    isLoading: true,
    isSubmitting: false,
  });

  const [initialValues, setInitialValues] = useState({
    name: '',
    email: '',
    active: true,
    administrator: false,
  });

  useEffect(() => {
    (async function loadInitialValues() {
      if (id) {
        const res = await api.get(`users/${id}`);
        if (res.data) {
          const { name, email, active, administrator } = res.data;
          setInitialValues({ name, email, active, administrator });
        }
      }
      setState({ isLoading: false });
    })();
  }, [id]);

  const validationSchema = Yup.object().shape({
    name: Yup.string().required('Obrigatório.'),
    email: Yup.string().email('E-mail inválido.').required('Obrigatório.'),
  });

  const handleSubmit = async (values) => {
    setState({ ...state, isSubmitting: true });
    try {
      if (id) {
        await api.put(`users/${id}`, values);
      } else {
        const data = { ...values, password: 'gobrewery' };
        await api.post('/users', data);
      }
      dispatch(showSnackbar('success', 'Salvo com sucesso.'));
      history.push('/users');
    } catch (err) {
      dispatch(showSnackbar('error', 'Erro ao salvar.'));
    }
    setState({ ...state, isSubmitting: false });
  };

  return (
    <Paper>
      <Typography variant="h6" className={classes.title}>
        {id ? 'Editar Usuário' : 'Novo Usuário'}
      </Typography>
      {!state.isLoading && (
        <Formik
          enableReinitialize
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          <FormComponent>
            <Grid container spacing={1} className={classes.container}>
              <Grid item xs={6} className={classes.field}>
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
              <Grid item xs={6} className={classes.field}>
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
              <Grid item xs={12} className={classes.field}>
                <FormControlLabel
                  control={
                    <Field component={Switch} name="active" type="checkbox" />
                  }
                  label="Ativo"
                />
                <FormControlLabel
                  control={
                    <Field
                      component={Switch}
                      name="administrator"
                      type="checkbox"
                    />
                  }
                  label="Administrador"
                />
              </Grid>
              <Grid item xs={12} className={classes.buttons}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  className={classes.button}
                  disabled={state.isSubmitting}
                >
                  Salvar
                </Button>
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
          </FormComponent>
        </Formik>
      )}
    </Paper>
  );
};

Form.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string,
    }).isRequired,
  }).isRequired,
};

export default Form;
