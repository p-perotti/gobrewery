import React, { useState, useCallback, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
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
import { parseISO, startOfDay, endOfDay, isBefore, isAfter } from 'date-fns';
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
  const isGuest = useSelector((state) => state.user.guest);

  const { productId, id } = useParams();
  const isViewMode = isGuest && !!id;

  const [productName, setProductName] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [sizes, setSizes] = useState([]);

  const [initialValues, setInitialValues] = useState({
    starting_date: startOfDay(new Date()),
    expiration_date: endOfDay(new Date()),
    price: '',
    description: '',
  });

  const loadValues = useCallback(async () => {
    const resSizes = await api.get('sizes', { params: { active: true } });

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
    if (
      isBefore(values.starting_date, values.expiration_date) &&
      isAfter(values.expiration_date, values.starting_date)
    ) {
      try {
        setIsSubmitting(true);

        if (id) {
          await api.put(`products/${productId}/prices/${id}`, {
            size_id: values.size,
            starting_date: values.starting_date,
            expiration_date: values.expiration_date,
            price: values.price,
            description: values.description,
          });
        } else {
          await api.post(`products/${productId}/prices`, {
            size_id: values.size,
            starting_date: values.starting_date,
            expiration_date: values.expiration_date,
            price: values.price,
            description: values.description,
          });
        }

        setIsSubmitting(false);
        dispatch(showSnackbar('success', 'Salvo com sucesso.'));
        history.push(`/products/${productId}`);
      } catch (error) {
        setIsSubmitting(false);
        dispatch(showSnackbar('error', 'Não foi possível salvar.'));
      }
    } else {
      dispatch(
        showSnackbar(
          'warning',
          'A data de início deve ser menor que a data de expiração.'
        )
      );
    }
  };

  useEffect(() => {
    if (isGuest && !id) {
      dispatch(showSnackbar('info', 'Acesso de visitante é somente leitura.'));
      history.replace(`/products/${productId}`);
    }
  }, [dispatch, id, isGuest, productId]);

  if (isGuest && !id) {
    return null;
  }

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
          {({ values }) => (
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
                        disabled={isViewMode || sizes.length === 0}
                      >
                        {sizes.map((size) => (
                          <MenuItem key={size.id} value={size.id}>
                            {size.description}
                          </MenuItem>
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
                      maxDate={values.expiration_date}
                      maxDateMessage="Início do período deve ser menor que a expiração."
                      strictCompareDates
                      disabled={isViewMode}
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
                      minDate={values.starting_date}
                      minDateMessage="Expiração do período deve ser maior que o início."
                      strictCompareDates
                      disabled={isViewMode}
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
                      disabled={isViewMode}
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
                      disabled={isViewMode}
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
                      to={`/products/${productId}`}
                    >
                      Voltar
                    </Button>
                  </Grid>
                </Grid>
              </MuiPickersUtilsProvider>
            </Form>
          )}
        </Formik>
      </Loader>
      <Backdrop open={isSubmitting} className={classes.backdrop}>
        <CircularProgress color="primary" />
      </Backdrop>
    </Paper>
  );
}

export default ProductPriceForm;
