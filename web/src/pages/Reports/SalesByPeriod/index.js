import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Paper, Typography, Grid, Button } from '@material-ui/core';
import { MuiPickersUtilsProvider, DatePicker } from '@material-ui/pickers';
import { subMonths, format, parseISO } from 'date-fns';
import DateFnsUtils from '@date-io/date-fns';
import ptBR from 'date-fns/locale/pt-BR';
import { utcToZonedTime } from 'date-fns-tz';

import { formatCurrency } from '~/util/format';

import api from '~/services/api';

import { showSnackbar } from '~/store/modules/ui/actions';

import { th, td, generateReport } from '~/util/report';

import style from './styles';

function SalesByPeriod() {
  const classes = style();

  const dispatch = useDispatch();

  const [startingDate, setStartingDate] = useState(subMonths(new Date(), 1));
  const [endingDate, setEndingDate] = useState(new Date());

  function report(data) {
    const generateReportBody = (rows) => {
      const body = [
        [
          th('Data'),
          th('Status'),
          th('Cliente'),
          th('F. de Pgto.'),
          th('Qtd. Total'),
          th('Total Bruto'),
          th('Total Líquido'),
          th('Desc. Total'),
        ],
      ];

      let totalAmount = 0;
      let grossTotal = 0;
      let netTotal = 0;
      let totalDiscount = 0;

      rows.forEach((row, index) => {
        const tableRow = [];
        tableRow.push(
          td(row.date, index),
          td(row.status, index),
          td(row.customer, index),
          td(row.payment_method, index),
          td(row.total_amount, index),
          td(formatCurrency(row.gross_total), index),
          td(formatCurrency(row.net_total), index),
          td(formatCurrency(row.total_discount), index)
        );
        body.push(tableRow);

        totalAmount += Number(row.total_amount);
        grossTotal += Number(row.gross_total);
        netTotal += Number(row.net_total);
        totalDiscount += Number(row.total_discount);
      });

      body[rows.length + 1] = [
        td('Total', -1, {
          colSpan: 4,
          fillColor: 'black',
          color: 'white',
          alignment: 'right',
        }),
        td(''),
        td(''),
        td(''),
        td(totalAmount, -1, {
          fillColor: 'black',
          color: 'white',
        }),
        td(formatCurrency(grossTotal), -1, {
          fillColor: 'black',
          color: 'white',
        }),
        td(formatCurrency(netTotal), -1, {
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

    const periodStart = format(startingDate, 'dd/MM/yy', { locale: ptBR });
    const periodEnd = format(endingDate, 'dd/MM/yy', { locale: ptBR });

    generateReport(
      `Vendas por período (${periodStart} à ${periodEnd})`,
      'landscape',
      ['auto', 'auto', '*', 'auto', 'auto', 'auto', 'auto', 'auto'],
      generateReportBody(data)
    );
  }

  const handleGenerate = async () => {
    try {
      const response = await api.get('/sales-by-period', {
        params: { startingDate, endingDate },
      });

      if (response.data) {
        const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

        const formatStatus = (status) => {
          switch (status) {
            case 'P':
              return 'Processamento';
            case 'E':
              return 'Enviado';
            case 'F':
              return 'Finalizado';
            case 'C':
              return 'Cancelado';
            default:
              return '';
          }
        };

        const data = response.data.map((r) => ({
          date: format(
            utcToZonedTime(parseISO(r.date), timezone),
            'dd/MM/yyyy HH:mm',
            {
              locale: ptBR,
            }
          ),
          status: formatStatus(r.status),
          customer: r.customer.name,
          total_amount: r.total_amount,
          gross_total: r.gross_total,
          net_total: r.net_total,
          total_discount: r.total_discount,
          payment_method: r.payment_method.name,
        }));

        report(data);
      }
    } catch (error) {
      dispatch(showSnackbar('error', 'Não foi possível gerar relatório.'));
    }
  };

  return (
    <Paper>
      <Typography variant="h6" color="primary" className={classes.title}>
        Vendas por período
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

export default SalesByPeriod;
