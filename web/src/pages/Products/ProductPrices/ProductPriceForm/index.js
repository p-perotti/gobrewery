import React, { useState, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import {
  Paper,
  Typography,
  Grid,
  FormControl,
  InputLabel,
  MenuItem,
  InputAdornment,
  Button,
  Backdrop,
  CircularProgress,
  TextField as TextFieldMUI,
} from '@material-ui/core';
import Save from '@material-ui/icons/Save';
import { Formik, Field, Form } from 'formik';
import { TextField, Select } from 'formik-material-ui';
import { DateTimePicker } from 'formik-material-ui-pickers';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import { parseISO, startOfDay, endOfDay } from 'date-fns';
import DateFnsUtils from '@date-io/date-fns';
import ptBR from 'date-fns/locale/pt-BR';
import * as Yup from 'yup';

import Loader from '~/components/Loader';
import NumberFormatInput from '~/components/NumberFormatInput';

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

  const [sizes, setSizes] = useState([]);

  const [initialValues, setInitialValues] = useState({
    starting_date: new Date(),
    expiration_date: new Date(),
    price: '',
    description: '',
  });

  const loadValues = useCallback(async () => {
    const resSizes = await api.get('sizes', { query: { active: true } });

    if (resSizes.data) {
      setSizes(resSizes.data);
    }

    if (id) {
      const res = await api.get(`products/${productId}/prices/${id}`);

      if (res.data) {
        const {
          product,
          size,
          starting_date,
          expiration_date,
          price,
          description,
        } = res.data;
        setProductName(product.name);
        setInitialValues({
          size: size.id,
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

      const starting_date = startOfDay(values.starting_date);

      const expiration_date = endOfDay(values.expiration_date);

      if (id) {
        await api.put(`products/${productId}/prices/${id}`, {
          size_id: values.size,
          starting_date,
          expiration_date,
          price: values.price,
          description: values.description,
        });
      } else {
        await api.post(`products/${productId}/prices`, {
          size_id: values.size,
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
      <Typography variant="h6" color="primary" className={classes.title}>
        Preço {!id && '(Novo)'}
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
                <Grid item xs={12}>
                  <TextFieldMUI
                    label="Produto"
                    value={productName}
                    variant="outlined"
                    size="small"
                    fullWidth
                    disabled
                  />
                </Grid>
                <Grid item xs={6}>
                  <FormControl variant="outlined" size="small" fullWidth>
                    <InputLabel htmlFor="size-select">Tamanho</InputLabel>
                    <Field
                      component={Select}
                      label="Tamanho"
                      name="size"
                      inputProps={{
                        id: 'size-select',
                      }}
                      disabled={sizes.length === 0}
                    >
                      {sizes.map((size) => (
                        <MenuItem value={size.id}>{size.description}</MenuItem>
                      ))}
                    </Field>
                  </FormControl>
                </Grid>
                <Grid item xs={2}>
                  <Field
                    component={DateTimePicker}
                    label="Início"
                    name="starting_date"
                    inputVariant="outlined"
                    size="small"
                    fullWidth
                    ampm={false}
                    format="dd/MM/yyyy HH:mm"
                    cancelLabel="Cancelar"
                  />
                </Grid>
                <Grid item xs={2}>
                  <Field
                    component={DateTimePicker}
                    label="Expiração"
                    name="expiration_date"
                    inputVariant="outlined"
                    size="small"
                    fullWidth
                    ampm={false}
                    format="dd/MM/yyyy HH:mm"
                    cancelLabel="Cancelar"
                  />
                </Grid>
                <Grid item xs={2}>
                  <Field
                    component={TextField}
                    type="text"
                    label="Preço"
                    name="price"
                    variant="outlined"
                    size="small"
                    fullWidth
                    InputProps={{
                      inputComponent: NumberFormatInput,
                      startAdornment: (
                        <InputAdornment position="start">R$</InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
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
                    startIcon={<Save />}
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
      <Backdrop open={isSubmitting} className={classes.backdrop}>
        <CircularProgress color="primary" />
      </Backdrop>
    </Paper>
  );
}

export default ProductPriceForm;
