import React, { useState, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import {
  Paper,
  Tabs,
  Tab,
  Typography,
  Grid,
  FormControlLabel,
  Button,
  Backdrop,
  CircularProgress,
} from '@material-ui/core';
import Save from '@material-ui/icons/Save';
import { TabContext, TabPanel } from '@material-ui/lab';
import { Formik, Field, Form } from 'formik';
import { TextField, Switch } from 'formik-material-ui';
import * as Yup from 'yup';

import Loader from '~/components/Loader';

import api from '~/services/api';
import history from '~/services/history';

import { showSnackbar } from '~/store/modules/ui/actions';

import ProductPrices from '../ProductPrices';
import ProductImages from '../ProductImages';

import style from './styles';

function ProductForm() {
  const classes = style();

  const dispatch = useDispatch();

  const { id } = useParams();

  const [selectedTab, setSelectedTab] = useState('1');

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [initialValues, setInitialValues] = useState({
    name: '',
    barcode: '',
    description: '',
    active: true,
  });

  const handleChangeTab = (_e, newValue) => {
    setSelectedTab(newValue);
  };

  const loadValues = useCallback(async () => {
    if (id) {
      const res = await api.get(`products/${id}`);
      if (res.data) {
        const { name, description, active } = res.data;
        setInitialValues({ name, description, active });
      }
    }
  }, [id]);

  const validationSchema = Yup.object().shape({
    name: Yup.string().required('Obrigatório.'),
  });

  const handleSubmit = async (values) => {
    try {
      setIsSubmitting(true);
      if (id) {
        await api.put(`products/${id}`, values);
      } else {
        await api.post('/products', values);
      }
      setIsSubmitting(false);
      dispatch(showSnackbar('success', 'Salvo com sucesso.'));
      history.push('/products');
    } catch (error) {
      setIsSubmitting(false);
      dispatch(showSnackbar('error', 'Não foi possível salvar.'));
    }
  };

  return (
    <Paper>
      <Typography variant="h6" color="primary" className={classes.title}>
        Produto {!id && '(Novo)'}
      </Typography>
      <Loader loadFunction={loadValues}>
        <TabContext value={selectedTab}>
          <Tabs
            value={selectedTab}
            onChange={handleChangeTab}
            indicatorColor="primary"
            textColor="primary"
            centered
          >
            <Tab label="Dados" value="1" />
            <Tab label="Preços" value="2" disabled={!id} />
            <Tab label="Imagens" value="3" disabled={!id} />
          </Tabs>
          <TabPanel value="1" className={classes.tabs}>
            <Formik
              enableReinitialize
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
            >
              <Form>
                <Grid container spacing={1} className={classes.container}>
                  <Grid item xs={9}>
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
                      label="Código de Barras"
                      name="barcode"
                      variant="outlined"
                      size="small"
                      fullWidth
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
                  <Grid item xs={12}>
                    <FormControlLabel
                      control={
                        <Field
                          component={Switch}
                          name="active"
                          type="checkbox"
                        />
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
                      startIcon={<Save />}
                    >
                      Salvar
                    </Button>
                    <Button
                      type="button"
                      variant="outlined"
                      color="primary"
                      component={Link}
                      to="/products"
                    >
                      Voltar
                    </Button>
                  </Grid>
                </Grid>
              </Form>
            </Formik>
          </TabPanel>
          <TabPanel value="2" className={classes.tabs}>
            <ProductPrices />
          </TabPanel>
          <TabPanel value="3" className={classes.tabs}>
            <ProductImages />
          </TabPanel>
        </TabContext>
      </Loader>
      <Backdrop open={isSubmitting} className={classes.backdrop}>
        <CircularProgress color="primary" />
      </Backdrop>
    </Paper>
  );
}

export default ProductForm;
