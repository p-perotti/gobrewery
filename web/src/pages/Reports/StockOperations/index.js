import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Paper, Typography, Grid, Button } from '@material-ui/core';
import { MuiPickersUtilsProvider, DatePicker } from '@material-ui/pickers';
import { subMonths, format } from 'date-fns';
import DateFnsUtils from '@date-io/date-fns';
import ptBR from 'date-fns/locale/pt-BR';

import api from '~/services/api';

import { showSnackbar } from '~/store/modules/ui/actions';

import { th, td, generateReport } from '~/util/report';

import style from './styles';

function StockOperations() {
  const classes = style();

  const dispatch = useDispatch();

  const [startingDate, setStartingDate] = useState(subMonths(new Date(), 1));
  const [endingDate, setEndingDate] = useState(new Date());

  function report(data) {
    const generateReportBody = (rows) => {
      const body = [
        [
          th('Produto'),
          th('Tamanho'),
          th('Saldo Anterior'),
          th('Entradas'),
          th('Saídas'),
          th('Saldo Atual'),
        ],
      ];

      let previousTotal = 0;
      let totalInwards = 0;
      let totalOutwards = 0;
      let currentTotal = 0;

      rows.forEach((row, index) => {
        const tableRow = [];
        tableRow.push(
          td(row.product.name, index),
          td(row.size.description, index),
          td(row.previous, index),
          td(row.in, index),
          td(row.out, index),
          td(row.current, index)
        );
        body.push(tableRow);

        previousTotal += Number(row.previous);
        totalInwards += Number(row.in);
        totalOutwards += Number(row.out);
        currentTotal += Number(row.current);
      });

      body[rows.length + 1] = [
        td('Total', -1, {
          colSpan: 2,
          fillColor: 'black',
          color: 'white',
          alignment: 'right',
        }),
        td(''),
        td(previousTotal, -1, {
          fillColor: 'black',
          color: 'white',
        }),
        td(totalInwards, -1, {
          fillColor: 'black',
          color: 'white',
        }),
        td(totalOutwards, -1, {
          fillColor: 'black',
          color: 'white',
        }),
        td(currentTotal, -1, {
          fillColor: 'black',
          color: 'white',
        }),
      ];

      return body;
    };

    const periodStart = format(startingDate, 'dd/MM/yy', { locale: ptBR });
    const periodEnd = format(endingDate, 'dd/MM/yy', { locale: ptBR });

    generateReport(
      `Relatório de estoque (${periodStart} à ${periodEnd})`,
      'portrait',
      ['*', '*', 'auto', 'auto', 'auto', 'auto'],
      generateReportBody(data)
    );
  }

  const handleGenerate = async () => {
    try {
      const response = await api.get('reports/stock-operations', {
        params: { startingDate, endingDate },
      });

      if (response.data) {
        report(response.data);
      }
    } catch (error) {
      dispatch(showSnackbar('error', 'Não foi possível gerar relatório.'));
    }
  };

  return (
    <Paper>
      <Typography variant="h6" color="primary" className={classes.title}>
        Relatório de estoque
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
              value={startingDate}
              onChange={setStartingDate}
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
              value={endingDate}
              onChange={setEndingDate}
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
    </Paper>
  );
}

export default StockOperations;
