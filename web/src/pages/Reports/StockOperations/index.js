import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import {
  Paper,
  Typography,
  Grid,
  FormControlLabel,
  Switch,
  Button,
} from '@material-ui/core';
import { MuiPickersUtilsProvider, DatePicker } from '@material-ui/pickers';
import { startOfMonth, format } from 'date-fns';
import DateFnsUtils from '@date-io/date-fns';
import ptBR from 'date-fns/locale/pt-BR';

import api from '~/services/api';

import { showSnackbar } from '~/store/modules/ui/actions';

import { th, td, generateReport } from '~/util/report';

import style from './styles';

function StockOperations() {
  const classes = style();

  const dispatch = useDispatch();

  const [startingDate, setStartingDate] = useState(startOfMonth(new Date()));
  const [endingDate, setEndingDate] = useState(new Date());
  const [synthetic, setSynthetic] = useState(false);

  const handleChangeSynthetic = () => {
    setSynthetic(!synthetic);
  };

  function syntheticReport(data) {
    const generateReportBody = (rows) => {
      const body = [[th('Produto'), th('Tamanho'), th('Saldo Atual')]];

      let currentTotal = 0;

      rows.forEach((row, index) => {
        const tableRow = [];
        tableRow.push(
          td(row.product.name, index),
          td(row.size.description, index),
          td(row.current_balance, index)
        );
        body.push(tableRow);

        currentTotal += Number(row.current_balance);
      });

      body[rows.length + 1] = [
        td('Total', -1, {
          colSpan: 2,
          fillColor: 'black',
          color: 'white',
          alignment: 'right',
        }),
        td(''),
        td(currentTotal, -1, {
          fillColor: 'black',
          color: 'white',
        }),
      ];

      return body;
    };

    generateReport(
      `Relatório resumido de estoque (em ${format(new Date(), 'dd/MM/yy', {
        locale: ptBR,
      })})`,
      'portrait',
      ['*', '*', 'auto'],
      generateReportBody(data)
    );
  }

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
          td(row.previous_balance, index),
          td(row.inward, index),
          td(row.outward, index),
          td(row.current_balance, index)
        );
        body.push(tableRow);

        previousTotal += Number(row.previous_balance);
        totalInwards += Number(row.inward);
        totalOutwards += Number(row.outward);
        currentTotal += Number(row.current_balance);
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
        params: { startingDate, endingDate, synthetic },
      });

      if (response.data && response.data.length > 0) {
        if (synthetic) {
          syntheticReport(response.data);
        } else {
          report(response.data);
        }
      } else {
        dispatch(
          showSnackbar(
            'info',
            'Nenhum resultado obtido com os filtros aplicados.'
          )
        );
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
          {!synthetic && (
            <>
              <Grid item xs={2}>
                <DatePicker
                  label="Data Inicial"
                  inputVariant="outlined"
                  size="small"
                  fullWidth
                  ampm={false}
                  format="dd/MM/yyyy"
                  cancelLabel="Cancelar"
                  maxDate={endingDate}
                  maxDateMessage="Data inicial deve ser menor que a data final."
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
                  minDate={startingDate}
                  minDateMessage="Data final deve ser maior que a data inicial."
                  value={endingDate}
                  onChange={setEndingDate}
                />
              </Grid>
            </>
          )}
          <Grid item xs={2}>
            <FormControlLabel
              control={
                <Switch
                  checked={synthetic}
                  onChange={handleChangeSynthetic}
                  name="synthetic"
                />
              }
              label="Resumido"
            />
          </Grid>
          <Grid item xs={synthetic ? 10 : 6} className={classes.buttons}>
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
