import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Paper, Typography, Grid, Button } from '@material-ui/core';
import { MuiPickersUtilsProvider, DatePicker } from '@material-ui/pickers';
import { startOfMonth, format } from 'date-fns';
import DateFnsUtils from '@date-io/date-fns';
import ptBR from 'date-fns/locale/pt-BR';

import { formatCurrency, formatPercentage } from '~/util/format';

import api from '~/services/api';

import { showSnackbar } from '~/store/modules/ui/actions';

import { th, td, generateReport } from '~/util/report';

import style from './styles';

function TotalDiscountByCoupon() {
  const classes = style();

  const dispatch = useDispatch();

  const [startingDate, setStartingDate] = useState(startOfMonth(new Date()));
  const [endingDate, setEndingDate] = useState(new Date());

  function report(data) {
    const formatType = (type) => {
      switch (type) {
        case 'P':
          return 'Percentual';
        case 'V':
          return 'Valor';
        default:
          return '';
      }
    };

    const formatValue = (type, value) => {
      switch (type) {
        case 'P':
          return formatPercentage(value);
        case 'V':
          return formatCurrency(value);
        default:
          return '';
      }
    };

    const generateReportBody = (rows) => {
      const body = [
        [
          th('Cupom'),
          th('Tipo'),
          th('Desconto'),
          th('Utilizados'),
          th('Desconto Total'),
        ],
      ];

      let totalUsed = 0;
      let totalDiscount = 0;

      rows.forEach((row, index) => {
        const tableRow = [];
        tableRow.push(
          td(row.coupon.name, index),
          td(formatType(row.coupon.type), index),
          td(formatValue(row.coupon.type, row.coupon.value), index),
          td(row.used, index),
          td(formatCurrency(row.total_discount), index)
        );
        body.push(tableRow);

        totalUsed += Number(row.used);
        totalDiscount += Number(row.total_discount);
      });

      body[rows.length + 1] = [
        td('Total', -1, {
          colSpan: 3,
          fillColor: 'black',
          color: 'white',
          alignment: 'right',
        }),
        td(''),
        td(''),
        td(totalUsed, -1, {
          fillColor: 'black',
          color: 'white',
        }),
        td(formatCurrency(totalDiscount), -1, {
          fillColor: 'black',
          color: 'white',
        }),
      ];

      return body;
    };

    const periodStart = format(startingDate, 'dd/MM/yy');
    const periodEnd = format(endingDate, 'dd/MM/yy');

    generateReport(
      `Relatório de desconto total por cupom (${periodStart} à ${periodEnd})`,
      'portrait',
      ['*', 'auto', 'auto', 'auto', 'auto'],
      generateReportBody(data)
    );
  }

  const handleGenerate = async () => {
    try {
      const response = await api.get('reports/total-discount-by-coupon', {
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
        Relatório de desconto total por cupom
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

export default TotalDiscountByCoupon;
