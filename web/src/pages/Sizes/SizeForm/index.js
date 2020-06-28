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
  InputAdornment,
} from '@material-ui/core';
import { Formik, Field, Form } from 'formik';
import { TextField, Switch } from 'formik-material-ui';
import * as Yup from 'yup';

import Loader from '~/components/Loader';
import NumberFormatInput from '~/components/NumberFormatInput';

import api from '~/services/api';
import history from '~/services/history';

import { showSnackbar } from '~/store/modules/ui/actions';
import style from './styles';

function SizeForm() {
  const classes = style();

  const dispatch = useDispatch();

  const { id } = useParams();

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [initialValues, setInitialValues] = useState({
    description: '',
    capacity: '',
    active: true,
  });

  const loadValues = useCallback(async () => {
    if (id) {
      const res = await api.get(`sizes/${id}`);
      if (res.data) {
        const { description, capacity, active } = res.data;
        setInitialValues({ description, capacity, active });
      }
    }
  }, [id]);

  const validationSchema = Yup.object().shape({
    description: Yup.string().required('Obrigatório.'),
  });

  const handleSubmit = async (values) => {
    try {
      setIsSubmitting(true);
      if (id) {
        await api.put(`sizes/${id}`, values);
      } else {
        await api.post('/sizes', values);
      }
      setIsSubmitting(false);
      dispatch(showSnackbar('success', 'Salvo com sucesso.'));
      history.push('/sizes');
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
          <Form>
            <Typography variant="h6" color="primary" className={classes.title}>
              Tamanho {!id && '(Novo)'}
            </Typography>
            <Grid container spacing={1} className={classes.container}>
              <Grid item xs={10}>
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
              <Grid item xs={2}>
                <Field
                  component={TextField}
                  type="text"
                  label="Capacidade"
                  name="capacity"
                  variant="outlined"
                  size="small"
                  fullWidth
                  InputProps={{
                    inputComponent: NumberFormatInput,
                    inputProps: { decimalScale: 3 },
                    endAdornment: (
                      <InputAdornment position="end">L</InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12}>
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
                  to="/sizes"
                >
                  Voltar
                </Button>
              </Grid>
            </Grid>
          </Form>
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

export default SizeForm;
