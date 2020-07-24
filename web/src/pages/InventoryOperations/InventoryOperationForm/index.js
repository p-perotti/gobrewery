import React, { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import {
  Paper,
  Typography,
  Grid,
  FormControl,
  InputLabel,
  MenuItem,
  TextField,
  Button,
  Backdrop,
  CircularProgress,
} from '@material-ui/core';
import { AddCircle, Save } from '@material-ui/icons';
import MaterialTable from 'material-table';
import { Formik, Field, Form } from 'formik';
import { Select } from 'formik-material-ui';
import { DateTimePicker } from 'formik-material-ui-pickers';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import ptBR from 'date-fns/locale/pt-BR';

import { localization } from '~/config/MaterialTableConfig';

import Loader from '~/components/Loader';
import NumberFormatInput from '~/components/NumberFormatInput';

import api from '~/services/api';
import history from '~/services/history';

import { showSnackbar } from '~/store/modules/ui/actions';

import style from './styles';

function UserForm() {
  const classes = style();

  const dispatch = useDispatch();

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [state, setState] = React.useState({
    columns: [],
    data: [],
  });

  const loadValues = useCallback(async () => {
    const resProducts = await api.get('products', { params: { active: true } });

    const resSizes = await api.get('sizes', { params: { active: true } });

    setState((prevState) => {
      const columns = [...prevState.columns];
      columns.push(
        {
          title: 'Produto',
          field: 'product_id',
          lookup: resProducts.data.reduce(
            (arr, product) =>
              Object.assign(arr, { [product.id]: product.name }),
            {}
          ),
        },
        {
          title: 'Tamanho',
          field: 'size_id',
          lookup: resSizes.data.reduce(
            (arr, size) => Object.assign(arr, { [size.id]: size.description }),
            {}
          ),
        },
        {
          title: 'Quantidade',
          field: 'amount',
          // eslint-disable-next-line react/prop-types
          editComponent: ({ value, onChange }) => (
            <TextField
              type="text"
              name="amount"
              size="small"
              value={value}
              onChange={(e) => onChange(e.target.value)}
              InputProps={{
                inputComponent: NumberFormatInput,
                inputProps: { decimalScale: 0 },
                style: {
                  fontSize: 13,
                },
              }}
            />
          ),
        }
      );
      return { ...prevState, columns };
    });
  }, []);

  const handleSubmit = async (values) => {
    try {
      setIsSubmitting(true);

      let totalAmount = 0;

      const inventory_operation_products = state.data.map((data) => {
        const { product_id, size_id, amount } = data;
        totalAmount += amount;
        return { product_id, size_id, amount };
      });

      const data = {
        ...values,
        total_amount: totalAmount,
        inventory_operation_products,
      };

      await api.post('/inventory-operations', data);
      setIsSubmitting(false);
      dispatch(showSnackbar('success', 'Salvo com sucesso.'));
      history.push('/inventory-operations');
    } catch (err) {
      setIsSubmitting(false);
      dispatch(showSnackbar('error', 'Não foi possível salvar.'));
    }
  };

  const validateProduct = (values) => {
    if (!values.product_id) {
      dispatch(showSnackbar('warning', 'Produto deve ser selecionado.'));
      return false;
    }
    if (!values.size_id) {
      dispatch(showSnackbar('warning', 'Tamanho deve ser selecionado.'));
      return false;
    }
    if (values.amount <= 0) {
      dispatch(
        showSnackbar('warning', 'Quantidade deve ser maior que zero (0).')
      );
      return false;
    }
    return true;
  };

  return (
    <Paper>
      <Loader loadFunction={loadValues}>
        <Formik
          initialValues={{
            type: 'E',
            date: new Date(),
          }}
          onSubmit={handleSubmit}
        >
          <Form>
            <Typography variant="h6" color="primary" className={classes.title}>
              Movimentação de estoque
            </Typography>
            <MuiPickersUtilsProvider utils={DateFnsUtils} locale={ptBR}>
              <Grid container spacing={1} className={classes.container}>
                <Grid item xs={2}>
                  <Field
                    component={DateTimePicker}
                    label="Data"
                    name="date"
                    inputVariant="outlined"
                    size="small"
                    fullWidth
                    ampm={false}
                    format="dd/MM/yyyy HH:mm"
                    cancelLabel="Cancelar"
                  />
                </Grid>
                <Grid item xs={2} className={classes.table}>
                  <FormControl variant="outlined" size="small" fullWidth>
                    <InputLabel htmlFor="type-simple">Tipo</InputLabel>
                    <Field
                      component={Select}
                      label="Tipo"
                      name="type"
                      inputProps={{
                        id: 'type-simple',
                      }}
                    >
                      <MenuItem value="E">Entrada</MenuItem>
                      <MenuItem value="S">Saída</MenuItem>
                    </Field>
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <MaterialTable
                    title={
                      <Typography variant="h6" color="primary">
                        Produtos
                      </Typography>
                    }
                    column
                    columns={state.columns}
                    data={state.data}
                    localization={localization.ptBR}
                    options={{
                      actionsColumnIndex: -1,
                      search: false,
                      paging: false,
                      loadingType: 'linear',
                    }}
                    components={{
                      // eslint-disable-next-line react/prop-types
                      Container: ({ children }) => <div>{children}</div>,
                    }}
                    icons={{
                      Add: () => <AddCircle />,
                    }}
                    editable={{
                      onRowAdd: (newData) =>
                        new Promise((resolve, reject) => {
                          setTimeout(() => {
                            if (validateProduct(newData)) {
                              setState((prevState) => {
                                const data = [...prevState.data];
                                data.push(newData);
                                return { ...prevState, data };
                              });
                              resolve();
                            } else {
                              reject();
                            }
                          }, 1);
                        }),
                      onRowUpdate: (newData, oldData) =>
                        new Promise((resolve, reject) => {
                          setTimeout(() => {
                            if (validateProduct(newData)) {
                              if (oldData) {
                                setState((prevState) => {
                                  const data = [...prevState.data];
                                  data[data.indexOf(oldData)] = newData;
                                  return { ...prevState, data };
                                });
                              }
                              resolve();
                            } else {
                              reject();
                            }
                          }, 1);
                        }),
                      onRowDelete: (oldData) =>
                        new Promise((resolve) => {
                          setTimeout(() => {
                            setState((prevState) => {
                              const data = [...prevState.data];
                              data.splice(data.indexOf(oldData), 1);
                              return { ...prevState, data };
                            });
                            resolve();
                          }, 1);
                        }),
                    }}
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
                    to="/inventory-operations"
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

export default UserForm;
