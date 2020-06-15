import React, { useState, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import {
  Paper,
  Typography,
  Grid,
  InputAdornment,
  Button,
  Backdrop,
  CircularProgress,
  TextField as TextFieldMUI,
} from '@material-ui/core';
import { Formik, Field, Form } from 'formik';
import { TextField } from 'formik-material-ui';
import { DateTimePicker } from 'formik-material-ui-pickers';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import { parseISO, setSeconds, setMilliseconds } from 'date-fns';
import DateFnsUtils from '@date-io/date-fns';
import ptBR from 'date-fns/locale/pt-BR';
import * as Yup from 'yup';

import Loader from '~/components/Loader';
import CurrencyFormat from '~/components/CurrencyFormat';

import api from '~/services/api';
import history from '~/services/history';

import { showSnackbar } from '~/store/modules/ui/actions';

import style from './styles';

function ProductPriceForm() {
  const classes = style();

  const dispatch = useDispatch();

  const { productId, id } = useParams();

  const [productName, setProductName] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [initialValues, setInitialValues] = useState({
    starting_date: new Date(),
    expiration_date: new Date(),
    price: '',
    description: '',
  });

  const loadValues = useCallback(async () => {
    if (id) {
      const res = await api.get(`products/${productId}/prices/${id}`);
      if (res.data) {
        const {
          product,
          starting_date,
          expiration_date,
          price,
          description,
        } = res.data;
        setProductName(product.name);
        setInitialValues({
          starting_date: parseISO(starting_date),
          expiration_date: parseISO(expiration_date),
          price,
          description,
        });
      }
    } else {
      const res = await api.get(`products/${productId}`);
      if (res.data) {
        setProductName(res.data.name);
      }
    }
  }, [productId, id]);

  const validationSchema = Yup.object().shape({
    price: Yup.string().required('Obrigatório.'),
    description: Yup.string().required('Obrigatório.'),
  });

  const handleSubmit = async (values) => {
    try {
      setIsSubmitting(true);

      const starting_date = setSeconds(
        setMilliseconds(values.starting_date, 0),
        0
      );

      const expiration_date = setSeconds(
        setMilliseconds(values.expiration_date, 999),
        59
      );

      if (id) {
        await api.put(`products/${productId}/prices/${id}`, {
          starting_date,
          expiration_date,
          price: values.price,
          description: values.description,
        });
      } else {
        await api.post(`products/${productId}/prices`, {
          starting_date,
          expiration_date,
          price: values.price,
          description: values.description,
        });
      }
      setIsSubmitting(false);
      dispatch(showSnackbar('success', 'Salvo com sucesso.'));
      history.push(`/products/${productId}`);
    } catch (err) {
      setIsSubmitting(false);
      dispatch(showSnackbar('error', 'Não foi possível salvar.'));
    }
  };

  return (
    <Paper>
      <Typography variant="h6" className={classes.title}>
        {id ? 'Editar Preço' : 'Novo Preço'}
      </Typography>
      <Loader loadFunction={loadValues}>
        <Formik
          enableReinitialize
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          <Form>
            <MuiPickersUtilsProvider utils={DateFnsUtils} locale={ptBR}>
              <Grid container spacing={1} className={classes.container}>
                <Grid item xs={6} className={classes.field}>
                  <TextFieldMUI
                    label="Produto"
                    value={productName}
                    variant="outlined"
                    size="small"
                    fullWidth
                    disabled
                  />
                </Grid>
                <Grid item xs={2} className={classes.field}>
                  <Field
                    component={DateTimePicker}
                    label="Início"
                    name="starting_date"
                    inputVariant="outlined"
                    size="small"
                    fullWidth
                    ampm={false}
                    format="dd/MM/yyyy HH:mm"
                  />
                </Grid>
                <Grid item xs={2} className={classes.field}>
                  <Field
                    component={DateTimePicker}
                    label="Expiração"
                    name="expiration_date"
                    inputVariant="outlined"
                    size="small"
                    fullWidth
                    ampm={false}
                    format="dd/MM/yyyy HH:mm"
                  />
                </Grid>
                <Grid item xs={2} className={classes.field}>
                  <Field
                    component={TextField}
                    type="text"
                    label="Preço"
                    name="price"
                    variant="outlined"
                    size="small"
                    fullWidth
                    InputProps={{
                      inputComponent: CurrencyFormat,
                      startAdornment: (
                        <InputAdornment position="start">R$</InputAdornment>
                      ),
                    }}
                  />
                </Grid>
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
                    to={`/products/${productId}`}
                  >
                    Voltar
                  </Button>
                </Grid>
              </Grid>
            </MuiPickersUtilsProvider>
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

export default ProductPriceForm;
