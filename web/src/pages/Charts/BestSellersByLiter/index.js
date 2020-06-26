import React, { useState, useCallback, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Paper, Grid, Typography, Button } from '@material-ui/core';
import { PieChart, Pie, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { getColor } from 'random-material-color';
import { MuiPickersUtilsProvider, DatePicker } from '@material-ui/pickers';
import { subDays, isBefore, isAfter } from 'date-fns';
import DateFnsUtils from '@date-io/date-fns';
import ptBR from 'date-fns/locale/pt-BR';

import api from '~/services/api';

import { showSnackbar } from '~/store/modules/ui/actions';

import style from './styles';

function BestSellersByLiter() {
  const classes = style();

  const dispatch = useDispatch();

  const [startingDateParam, setStartingDateParam] = useState(
    subDays(new Date(), 6)
  );
  const [endingDateParam, setEndingDateParam] = useState(new Date());
  const [chartData, setChartData] = useState([{}]);

  const generateChart = useCallback(
    async (startingDate, endingDate) => {
      try {
        const res = await api.get('products-best-sellers-by-liter', {
          params: { startingDate, endingDate },
        });

        if (res.data) {
          const formattedData = res.data.map((r) => {
            return {
              name: r.product.name,
              value: Number(r.liters),
              fill: getColor({
                shades: ['500'],
                text: r.product.id.toString(),
              }),
            };
          });

          setChartData(formattedData);
        }
      } catch (err) {
        dispatch(showSnackbar('error', 'Não foi possível gerar gráfico.'));
      }
    },
    [dispatch]
  );

  useEffect(() => {
    generateChart(subDays(new Date(), 6), new Date());
  }, [generateChart]);

  function validateParams() {
    if (isBefore(endingDateParam, startingDateParam)) {
      dispatch(
        showSnackbar('warning', 'Data final deve ser maior que a data inicial.')
      );
      return false;
    }

    if (isAfter(startingDateParam, endingDateParam)) {
      dispatch(
        showSnackbar('warning', 'Data inicial deve ser menor que a data final.')
      );
      return false;
    }

    return true;
  }

  function handleGenerate() {
    if (validateParams()) {
      generateChart(startingDateParam, endingDateParam);
    }
  }

  return (
    <Paper className={classes.paper}>
      <Typography variant="h6" color="primary" className={classes.title}>
        Mais Vendidos (por L)
      </Typography>
      <MuiPickersUtilsProvider utils={DateFnsUtils} locale={ptBR}>
        <Grid container spacing={1} className={classes.container}>
          <Grid item xs={2}>
            <DatePicker
              label="Data Inicial"
              inputVariant="outlined"
              size="small"
              fullWidth
              ampm={false}
              format="dd/MM/yyyy"
              cancelLabel="Cancelar"
              value={startingDateParam}
              onChange={setStartingDateParam}
            />
          </Grid>
          <Grid item xs={2}>
            <DatePicker
              label="Data Final"
              inputVariant="outlined"
              size="small"
              fullWidth
              ampm={false}
              format="dd/MM/yyyy"
              cancelLabel="Cancelar"
              value={endingDateParam}
              onChange={setEndingDateParam}
            />
          </Grid>
          <Grid item xs={8} className={classes.buttons}>
            <Button
              type="button"
              variant="contained"
              color="primary"
              className={classes.button}
              onClick={handleGenerate}
            >
              Gerar
            </Button>
          </Grid>
        </Grid>
      </MuiPickersUtilsProvider>
      <ResponsiveContainer>
        <PieChart>
          <Pie
            data={chartData}
            dataKey="value"
            innerRadius="60%"
            outerRadius="90%"
          />
          <Legend layout="vertical" align="right" verticalAlign="middle" />
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </Paper>
  );
}

export default BestSellersByLiter;
