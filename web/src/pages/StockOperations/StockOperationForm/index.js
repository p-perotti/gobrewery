import React, { useState, useCallback } from 'react';
import { Link, useParams } from 'react-router-dom';
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

function StockOperationForm() {
  const classes = style();

  const dispatch = useDispatch();

  const { id } = useParams();

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [state, setState] = useState({
    initialValues: {
      type: 'E',
      date: new Date(),
    },
    canceled: false,
    detailColumns: [],
    detailData: [],
  });

  const loadValues = useCallback(async () => {
    const params = id ? { active: true } : {};

    const resProducts = await api.get('products', { params });

    const resSizes = await api.get('sizes', { params });

    setState((prevState) => {
      const detailColumns = [...prevState.detailColumns];
      detailColumns.push(
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
      return { ...prevState, detailColumns };
    });

    if (id) {
      const res = await api.get(`stock-operations/${id}`, {
        params: { products: true },
      });

      if (res.data) {
        const { type, date, canceled, products } = res.data;

        const detailData = products.map((row) => ({
          product_id: row.product.id,
          size_id: row.size.id,
          amount: row.amount,
        }));

        setState((prevState) => {
          return {
            ...prevState,
            initialValues: { type, date },
            canceled,
            detailData,
          };
        });
      }
    }
  }, [id]);

  const handleSubmit = async (values) => {
    try {
      if (!id) {
        setIsSubmitting(true);

        let totalAmount = 0;

        const stock_operation_products = state.detailData.map((row) => {
          const { product_id, size_id, amount } = row;
          totalAmount += amount;
          return { product_id, size_id, amount };
        });

        const data = {
          ...values,
          total_amount: totalAmount,
          stock_operation_products,
        };

        await api.post('stock-operations', data);
        setIsSubmitting(false);
        dispatch(showSnackbar('success', 'Salvo com sucesso.'));
        history.push('/stock-operations');
      }
    } catch (error) {
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
          enableReinitialize
          initialValues={state.initialValues}
          onSubmit={handleSubmit}
        >
          <Form>
            <Typography variant="h6" color="primary" className={classes.title}>
              Movimentação de estoque {state.canceled && '(Cancelada)'}
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
                    disabled={id}
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
                      disabled={id}
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
                    columns={state.detailColumns}
                    data={state.detailData}
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
                    editable={
                      !id && {
                        onRowAdd: (newData) =>
                          new Promise((resolve, reject) => {
                            setTimeout(() => {
                              if (validateProduct(newData)) {
                                setState((prevState) => {
                                  const detailData = [...prevState.detailData];
                                  detailData.push(newData);
                                  return { ...prevState, detailData };
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
                                    const detailData = [
                                      ...prevState.detailData,
                                    ];
                                    detailData[
                                      detailData.indexOf(oldData)
                                    ] = newData;
                                    return { ...prevState, detailData };
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
                                const detailData = [...prevState.detailData];
                                detailData.splice(
                                  detailData.indexOf(oldData),
                                  1
                                );
                                return { ...prevState, detailData };
                              });
                              resolve();
                            }, 1);
                          }),
                      }
                    }
                  />
                </Grid>
                <Grid item xs={12} className={classes.buttons}>
                  {!id && (
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
                    to="/stock-operations"
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

export default StockOperationForm;
