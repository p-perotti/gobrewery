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
import { Formik, Field, Form } from 'formik';
import { TextField, Select } from 'formik-material-ui';
import { DateTimePicker } from 'formik-material-ui-pickers';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import { parseISO, setSeconds, setMilliseconds } from 'date-fns';
import DateFnsUtils from '@date-io/date-fns';
import ptBR from 'date-fns/locale/pt-BR';
import * as Yup from 'yup';

import Loader from '~/components/Loader';
import DecimalFormat from '~/components/DecimalFormat';

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
    starting_date: new Date(),
    expiration_date: new Date(),
    type: 'P',
    value: '',
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
        } = res.data;
        setInitialValues({
          name,
          description,
          starting_date: parseISO(starting_date),
          expiration_date: parseISO(expiration_date),
          type,
          value,
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
        await api.put(`coupons/${id}`, {
          name: values.name,
          starting_date,
          expiration_date,
          type: values.type,
          value: values.value,
          description: values.description,
        });
      } else {
        await api.post('/coupons', {
          name: values.name,
          starting_date,
          expiration_date,
          type: values.type,
          value: values.value,
          description: values.description,
        });
      }
      setIsSubmitting(false);
      dispatch(showSnackbar('success', 'Salvo com sucesso.'));
      history.push('/coupons');
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
          {({ values }) => (
            <Form>
              <MuiPickersUtilsProvider utils={DateFnsUtils} locale={ptBR}>
                <Typography variant="h6" className={classes.title}>
                  {id ? 'Editar Cupom' : 'Novo Cupom'}
                </Typography>
                <Grid container spacing={1} className={classes.container}>
                  <Grid item xs={12} className={classes.field}>
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
                  <Grid item xs={3} className={classes.field}>
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
                  <Grid item xs={3} className={classes.field}>
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
                  <Grid item xs={3} className={classes.field}>
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
                  <Grid item xs={3} className={classes.field}>
                    <Field
                      component={TextField}
                      type="text"
                      label="Valor"
                      name="value"
                      variant="outlined"
                      size="small"
                      fullWidth
                      InputProps={{
                        inputComponent: DecimalFormat,
                        startAdornment: values.type === 'V' && (
                          <InputAdornment position="start">R$</InputAdornment>
                        ),
                        endAdornment: values.type === 'P' && (
                          <InputAdornment position="end">%</InputAdornment>
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
      {isSubmitting && (
        <Backdrop open className={classes.backdrop}>
          <CircularProgress color="primary" />
        </Backdrop>
      )}
    </Paper>
  );
}

export default CouponForm;
