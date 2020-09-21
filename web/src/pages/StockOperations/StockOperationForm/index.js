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
import { AddCircle, Save, Warning } from '@material-ui/icons';
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
  });

  const [detailColumns, setDetailColumns] = useState([]);

  const [detailData, setDetailData] = useState([]);

  const loadValues = useCallback(async () => {
    const params = id ? {} : { active: true };

    const resProducts = await api.get('products', { params });

    const resSizes = await api.get('sizes', { params });

    setDetailColumns([
      {
        title: 'Produto',
        field: 'product_id',
        lookup: resProducts.data.reduce(
          (arr, product) => Object.assign(arr, { [product.id]: product.name }),
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
        title: '',
        field: 'warning',
        editable: 'never',
        sorting: false,
        width: 48,
        render: (rowData) => rowData.warning && <Warning color="secondary" />,
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
      },
    ]);

    if (id) {
      const res = await api.get(`stock-operations/${id}`, {
        params: { products: true },
      });

      if (res.data) {
        const { type, date, canceled, products } = res.data;

        setState((prevState) => {
          return {
            ...prevState,
            initialValues: { type, date },
            canceled,
          };
        });

        setDetailData(
          products.map((row) => ({
            product_id: row.product.id,
            size_id: row.size.id,
            amount: row.amount,
            warning: false,
          }))
        );
      }
    }
  }, [id]);

  const validateDetailData = async () => {
    const detailDataUpdate = [...detailData];

    await Promise.all(
      detailDataUpdate.map(async (row) => {
        const res = await api.get('product-stock-amount', {
          params: { productId: row.product_id, sizeId: row.size_id },
        });

        if (res.data && res.data.amount < row.amount) {
          detailDataUpdate[row.tableData.id] = {
            ...row,
            warning: true,
          };
        }
      })
    );

    setDetailData([...detailDataUpdate]);

    return !detailData.find((row) => row.warning === true);
  };

  const handleSubmit = async (values) => {
    try {
      if (!id) {
        setIsSubmitting(true);
        if (values.type === 'S' && (await validateDetailData())) {
          setIsSubmitting(false);
          dispatch(
            showSnackbar(
              'warning',
              'Ajuste a quantidade dos produtos indicados e tente novamente.'
            )
          );
        } else {
          let totalAmount = 0;

          const stock_operation_products = detailData.map(async (row) => {
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
      }
    } catch (error) {
      setIsSubmitting(false);
      dispatch(showSnackbar('error', 'Não foi possível salvar.'));
    }
  };

  const validateRow = async (newData, issueOperation) => {
    if (!newData.product_id) {
      dispatch(showSnackbar('warning', 'Produto deve ser selecionado.'));
      return false;
    }

    if (!newData.size_id) {
      dispatch(showSnackbar('warning', 'Tamanho deve ser selecionado.'));
      return false;
    }

    if (newData.amount <= 0) {
      dispatch(showSnackbar('warning', 'Quantidade deve ser maior que 0.'));
      return false;
    }

    if (issueOperation) {
      const res = await api.get('product-stock-amount', {
        params: {
          productId: newData.product_id,
          sizeId: newData.size_id,
        },
      });

      if (res.data && res.data.amount < newData.amount) {
        dispatch(
          showSnackbar(
            'warning',
            `Estoque disponível para o produto com este tamanho é ${res.data.amount}.`
          )
        );
        return false;
      }
    }

    return true;
  };

  const handleRowAdd = async (resolve, reject, newData, issueOperation) => {
    try {
      if (await validateRow(newData, issueOperation)) {
        if (
          detailData.find(
            (row) =>
              row.product_id === newData.product_id &&
              row.size_id === newData.size_id
          )
        ) {
          dispatch(
            showSnackbar(
              'info',
              'Já existe um produto com este tamanho na movimentação.'
            )
          );
          reject();
        } else {
          setDetailData([...detailData, { ...newData, warning: false }]);
          resolve();
        }
      } else {
        reject();
      }
    } catch (error) {
      dispatch(
        showSnackbar('error', 'Não foi possível adicionar, tente novamente.')
      );
      reject();
    }
  };

  const handleRowUpdate = async (
    resolve,
    reject,
    newData,
    oldData,
    issueOperation
  ) => {
    try {
      if (await validateRow(newData, issueOperation)) {
        const detailDataUpdate = [...detailData];
        detailDataUpdate[oldData.tableData.id] = { ...newData, warning: false };
        setDetailData([...detailDataUpdate]);
        resolve();
      } else {
        reject();
      }
    } catch (error) {
      dispatch(
        showSnackbar('error', 'Não foi possível editar, tente novamente.')
      );
      reject();
    }
  };

  const handleRowDelete = (resolve, reject, oldData) => {
    try {
      const detailDataDelete = [...detailData];
      detailDataDelete.splice(oldData.tableData.id, 1);
      setDetailData([...detailDataDelete]);
      resolve();
    } catch (error) {
      dispatch(
        showSnackbar('error', 'Não foi possível excluir, tente novamente.')
      );
      reject();
    }
  };

  return (
    <Paper>
      <Loader loadFunction={loadValues}>
        <Formik
          enableReinitialize
          initialValues={state.initialValues}
          onSubmit={handleSubmit}
        >
          {({ values }) => (
            <Form>
              <Typography
                variant="h6"
                color="primary"
                className={classes.title}
              >
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
                      columns={detailColumns}
                      data={detailData}
                      localization={localization.ptBR}
                      options={{
                        actionsColumnIndex: -1,
                        search: false,
                        paging: false,
                        draggable: false,
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
                              handleRowAdd(
                                resolve,
                                reject,
                                newData,
                                values.type === 'S'
                              );
                            }),
                          onRowUpdate: (newData, oldData) =>
                            new Promise((resolve, reject) => {
                              handleRowUpdate(
                                resolve,
                                reject,
                                newData,
                                oldData,
                                values.type === 'S'
                              );
                            }),
                          onRowDelete: (oldData) =>
                            new Promise((resolve, reject) => {
                              handleRowDelete(resolve, reject, oldData);
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
          )}
        </Formik>
      </Loader>
      <Backdrop open={isSubmitting} className={classes.backdrop}>
        <CircularProgress color="primary" />
      </Backdrop>
    </Paper>
  );
}

export default StockOperationForm;
