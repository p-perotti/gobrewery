import React, { useState, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import {
  Paper,
  Typography,
  Grid,
  FormControlLabel,
  Button,
  Backdrop,
  CircularProgress,
} from '@material-ui/core';
import { Formik, Field, Form as FormComponent } from 'formik';
import { TextField, Switch } from 'formik-material-ui';
import * as Yup from 'yup';

import Loader from '~/components/Loader';

import api from '~/services/api';
import history from '~/services/history';

import { showSnackbar } from '~/store/modules/ui/actions';
import style from './styles';

function Form() {
  const classes = style();

  const dispatch = useDispatch();

  const { id } = useParams();

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [initialValues, setInitialValues] = useState({
    description: '',
    active: true,
  });

  const loadValues = useCallback(async () => {
    if (id) {
      const res = await api.get(`packages/${id}`);
      if (res.data) {
        const { description, active } = res.data;
        setInitialValues({ description, active });
      }
    }
  }, [id]);

  const validationSchema = Yup.object().shape({
    description: Yup.string().required('Obrigatório.'),
    active: Yup.boolean().required(),
  });

  const handleSubmit = async (values) => {
    try {
      setIsSubmitting(true);
      if (id) {
        await api.put(`packages/${id}`, values);
      } else {
        await api.post('/packages', values);
      }
      setIsSubmitting(false);
      dispatch(showSnackbar('success', 'Salvo com sucesso.'));
      history.push('/packages');
    } catch (err) {
      setIsSubmitting(false);
      dispatch(showSnackbar('error', 'Não foi possível salvar.'));
    }
  };

  return (
    <Paper>
      <Loader loadFunction={loadValues}>
        <Formik
          enableReinitialize
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          <FormComponent>
            <Typography variant="h6" className={classes.title}>
              {id ? 'Editar Embalagem' : 'Nova Embalagem'}
            </Typography>
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
                  disabled={isSubmitting}
                  className={classes.button}
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
      </Loader>
      {isSubmitting && (
        <Backdrop open className={classes.backdrop}>
          <CircularProgress color="primary" />
        </Backdrop>
      )}
    </Paper>
  );
}

export default Form;
