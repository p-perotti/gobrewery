import React, { useState, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import {
  Paper,
  Typography,
  Grid,
  FormControl,
  InputLabel,
  InputAdornment,
  MenuItem,
  Button,
  Backdrop,
  CircularProgress,
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

function CouponForm() {
  const classes = style();

  const dispatch = useDispatch();

  const { id } = useParams();

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [initialValues, setInitialValues] = useState({
    name: '',
    description: '',
    starting_date: startOfDay(new Date()),
    expiration_date: endOfDay(new Date()),
    type: 'P',
    value: '',
    discount_limitation: 0,
    use_limit: '',
  });

  const loadValues = useCallback(async () => {
    if (id) {
      const res = await api.get(`coupons/${id}`);
      if (res.data) {
        const {
          name,
          description,
          starting_date,
          expiration_date,
          type,
          value,
          discount_limitation,
          use_limit,
        } = res.data;
        setInitialValues({
          name,
          description,
          starting_date: parseISO(starting_date),
          expiration_date: parseISO(expiration_date),
          type,
          value,
          discount_limitation,
          use_limit,
        });
      }
    }
  }, [id]);

  const validationSchema = Yup.object().shape({
    name: Yup.string().required('Obrigatório.'),
    type: Yup.string(),
    value: Yup.number()
      .required('Obrigatório.')
      .moreThan(0, 'Valor deve ser maior que 0.')
      .when('type', (type, field) =>
        type === 'P'
          ? field.lessThan(100, 'Percentual deve ser menor que 100.')
          : field
      ),
    discount_limitation: Yup.number()
      .nullable()
      .moreThan(0, 'Valor deve ser maior que 0.'),
    use_limit: Yup.number()
      .nullable()
      .moreThan(0, 'Valor deve ser maior que 0.'),
  });

  const handleSubmit = async (values) => {
    if (
      isBefore(values.starting_date, values.expiration_date) &&
      isAfter(values.expiration_date, values.starting_date)
    ) {
      try {
        setIsSubmitting(true);

        const discount_limitation =
          values.discount_limitation === '' ? null : values.discount_limitation;

        const use_limit = values.use_limit === '' ? null : values.use_limit;

        if (id) {
          await api.put(`coupons/${id}`, {
            name: values.name,
            starting_date: values.starting_date,
            expiration_date: values.expiration_date,
            type: values.type,
            value: values.value,
            description: values.description,
            discount_limitation,
            use_limit,
          });
        } else {
          await api.post('coupons', {
            name: values.name,
            starting_date: values.starting_date,
            expiration_date: values.starting_date,
            type: values.type,
            value: values.value,
            description: values.description,
            discount_limitation,
            use_limit,
          });
        }

        setIsSubmitting(false);
        dispatch(showSnackbar('success', 'Salvo com sucesso.'));
        history.push('/coupons');
      } catch (error) {
        setIsSubmitting(false);
        dispatch(showSnackbar('error', 'Não foi possível salvar.'));
      }
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
          {({ values }) => (
            <Form>
              <Typography
                variant="h6"
                color="primary"
                className={classes.title}
              >
                Cupom {!id && '(Novo)'}
              </Typography>
              <MuiPickersUtilsProvider utils={DateFnsUtils} locale={ptBR}>
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
                    />
                  </Grid>
                  <Grid item xs={3}>
                    <Field
                      component={TextField}
                      type="text"
                      label={
                        values.type === 'P'
                          ? 'Máximo de desconto'
                          : 'Mínimo de venda'
                      }
                      name="discount_limitation"
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
                  <Grid item xs={3}>
                    <Field
                      component={TextField}
                      type="number"
                      label="Limite de uso"
                      name="use_limit"
                      variant="outlined"
                      size="small"
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={3}>
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
                    />
                  </Grid>
                  <Grid item xs={3}>
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
                    />
                  </Grid>
                  <Grid item xs={3}>
                    <FormControl variant="outlined" size="small" fullWidth>
                      <InputLabel htmlFor="type-select">Tipo</InputLabel>
                      <Field
                        component={Select}
                        label="Tipo"
                        name="type"
                        inputProps={{
                          id: 'type-select',
                        }}
                      >
                        <MenuItem value="P">Percentual</MenuItem>
                        <MenuItem value="V">Valor</MenuItem>
                      </Field>
                    </FormControl>
                  </Grid>
                  <Grid item xs={3}>
                    <Field
                      component={TextField}
                      type="text"
                      label="Desconto"
                      name="value"
                      variant="outlined"
                      size="small"
                      fullWidth
                      InputProps={{
                        inputComponent: NumberFormatInput,
                        startAdornment: values.type === 'V' && (
                          <InputAdornment position="start">R$</InputAdornment>
                        ),
                        endAdornment: values.type === 'P' && (
                          <InputAdornment position="end">%</InputAdornment>
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
                      multiline
                      rowsMax={5}
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
                      to="/coupons"
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

export default CouponForm;
