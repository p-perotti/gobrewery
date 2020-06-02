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
    description: '',
    active: true,
  });

  useEffect(() => {
    (async function loadInitialValues() {
      if (id) {
        const res = await api.get(`packages/${id}`);
        if (res.data) {
          const { description, active } = res.data;
          setInitialValues({ description, active });
        }
      }
      setState({ isLoading: false });
    })();
  }, [id]);

  const validationSchema = Yup.object().shape({
    description: Yup.string().required('Obrigatório.'),
    active: Yup.boolean().required(),
  });

  const handleSubmit = async (values) => {
    setState({ ...state, isSubmitting: true });
    try {
      if (id) {
        await api.put(`packages/${id}`, values);
      } else {
        await api.post('/packages', values);
      }
      dispatch(showSnackbar('success', 'Salvo com sucesso.'));
      history.push('/packages');
    } catch (err) {
      dispatch(showSnackbar('error', 'Erro ao salvar.'));
    }
    setState({ ...state, isSubmitting: false });
  };

  return (
    <Paper>
      <Typography variant="h6" className={classes.title}>
        {id ? 'Editar Embalagem' : 'Nova Embalagem'}
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
              <Grid item xs={12} className={classes.field}>
                <Field
                  component={TextField}
                  type="text"
                  label="Descrição"
                  name="description"
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
                  to="/packages"
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
