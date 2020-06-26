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
          th('Qtd. Total'),
          th('Total Bruto'),
          th('Total Líquido'),
          th('Desc. Total'),
          th('F. de Pgto.'),
        ],
      ];

      rows.forEach((row, index) => {
        const tableRow = [];
        tableRow.push(
          td(row.date, index),
          td(row.status, index),
          td(row.customer, index),
          td(row.total_amount, index),
          td(row.gross_total, index),
          td(row.net_total, index),
          td(row.total_discount, index),
          td(row.payment_method, index)
        );
        body.push(tableRow);
      });

      return body;
    };

    const periodStart = format(startingDate, 'dd/MM/yy', { locale: ptBR });
    const periodEnd = format(endingDate, 'dd/MM/yy', { locale: ptBR });

    generateReport(
      `Vendas por Período (${periodStart} à ${periodEnd})`,
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

        const data = response.data.map((r) => ({
          date: format(
            utcToZonedTime(parseISO(r.date), timezone),
            'dd/MM/yyyy HH:mm',
            {
              locale: ptBR,
            }
          ),
          status: () => {
            switch (r.status) {
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
          },
          customer: r.customer.name,
          total_amount: r.total_amount,
          gross_total: formatCurrency(r.gross_total),
          net_total: formatCurrency(r.net_total),
          total_discount: formatCurrency(r.total_discount),
          payment_method: r.payment_method.name,
        }));

        report(data);
      }
    } catch (err) {
      dispatch(showSnackbar('error', 'Não foi possível gerar relatório.'));
    }
  };

  return (
    <Paper>
      <Typography variant="h6" color="primary" className={classes.title}>
        Relatório de Vendas
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
