import React, { useState, useEffect } from 'react';
import { Grid, Paper, Typography } from '@material-ui/core';
import { useTheme } from '@material-ui/core/styles';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Label,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';
import MaterialTable from 'material-table';
import { format, parseISO, startOfDay, subDays, isEqual } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
import { utcToZonedTime } from 'date-fns-tz';

import { formatCurrency } from '~/util/format';

import { localization } from '~/config/MaterialTableConfig';

import Card from './Card';

import api from '~/services/api';

import styles from './styles';

function Dashboard() {
  const theme = useTheme();
  const classes = styles();

  const [sales, setSales] = useState(0);
  const [stockInputs, setStockInputs] = useState(0);
  const [stockOutputs, setStockOutputs] = useState(0);
  const [lastDaysSales, setLastDaysSales] = useState([{}]);
  const [latestSales, setLatestSales] = useState([{}]);
  const [bestSellers, setBestSellers] = useState([{}]);

  useEffect(() => {
    (async () => {
      const response = await api.get('dashboard/total-sales-today');

      if (response.data) {
        setSales(Number(response.data.total));
      }
    })();

    (async () => {
      const response = await api.get('dashboard/total-stock-operations-today', {
        params: { type: 'E' },
      });

      if (response.data) {
        setStockInputs(Number(response.data.total));
      }
    })();

    (async () => {
      const response = await api.get('dashboard/total-stock-operations-today', {
        params: { type: 'S' },
      });

      if (response.data) {
        setStockOutputs(Number(response.data.total));
      }
    })();

    (async () => {
      const today = startOfDay(new Date());

      const lastDays = [
        subDays(today, 6),
        subDays(today, 5),
        subDays(today, 4),
        subDays(today, 3),
        subDays(today, 2),
        subDays(today, 1),
        today,
      ];

      const response = await api.get('dashboard/last-days-total-sales');

      const data = lastDays.map((day) => {
        const result = response.data.find((d) =>
          isEqual(parseISO(d.date), day)
        );

        return {
          date: format(day, 'dd/MM (EEE)', { locale: ptBR }),
          total: result ? result.total : 0,
        };
      });

      setLastDaysSales(data);
    })();

    (async () => {
      const response = await api.get('dashboard/best-sellers-by-amount');

      if (response.data) {
        setBestSellers(response.data);
      }
    })();

    (async () => {
      const response = await api.get('dashboard/latest-sales');

      if (response.data) {
        const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

        const dataFormatted = response.data.map((product) => ({
          ...product,
          formattedDate: format(
            utcToZonedTime(parseISO(product.date), timezone),
            'dd/MM/yyyy HH:mm',
            {
              locale: ptBR,
            }
          ),
          formattedValue: formatCurrency(product.net_total),
        }));

        setLatestSales(dataFormatted);
      }
    })();
  }, [setStockInputs, setStockOutputs]);

  return (
    <Grid container spacing={3}>
      <Grid item xs={4}>
        <Paper className={classes.card}>
          <Card
            title="Vendas"
            value={sales}
            link="/reports/sales"
            currency
            positive
          />
        </Paper>
      </Grid>
      <Grid item xs={4}>
        <Paper className={classes.card}>
          <Card
            title="Estoque (Entradas)"
            value={stockInputs}
            link="/reports/stock-operations"
            positive
          />
        </Paper>
      </Grid>
      <Grid item xs={4}>
        <Paper className={classes.card}>
          <Card
            title="Estoque (Saídas)"
            value={stockOutputs}
            link="/reports/stock-operations"
          />
        </Paper>
      </Grid>
      <Grid item xs={12}>
        <Paper className={classes.chart}>
          <Typography variant="h6" color="primary">
            Vendas
          </Typography>
          <div className={classes.container}>
            <ResponsiveContainer>
              <LineChart
                data={lastDaysSales}
                margin={{
                  top: theme.spacing(2),
                  left: theme.spacing(2),
                }}
              >
                <XAxis dataKey="date" stroke={theme.palette.text.secondary} />
                <YAxis stroke={theme.palette.text.secondary}>
                  <Label
                    value="Vendas (R$)"
                    angle={270}
                    position="left"
                    className={classes.label}
                  />
                </YAxis>
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="total"
                  stroke={theme.palette.primary.main}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Paper>
      </Grid>
      <Grid item xs={5}>
        <MaterialTable
          title={
            <Typography variant="h6" color="primary">
              Mais vendidos (últimos 7 dias)
            </Typography>
          }
          columns={[
            { title: 'Produto', field: 'product.name' },
            { title: 'Tamanho', field: 'size.description' },
            { title: 'Qtd.', field: 'total_amount' },
          ]}
          data={bestSellers}
          localization={localization.ptBR}
          options={{
            search: false,
            draggable: false,
            filtering: false,
            sorting: false,
            grouping: false,
            paging: false,
          }}
        />
      </Grid>
      <Grid item xs={7}>
        <MaterialTable
          title={
            <Typography variant="h6" color="primary">
              Vendas recentes
            </Typography>
          }
          columns={[
            {
              title: 'Data/Hora',
              field: 'formattedDate',
            },
            { title: 'Qtd.', field: 'total_amount' },
            { title: 'Valor', field: 'formattedValue' },
            { title: 'F. de Pgto.', field: 'payment_method.name' },
          ]}
          data={latestSales}
          localization={localization.ptBR}
          options={{
            search: false,
            draggable: false,
            filtering: false,
            sorting: false,
            grouping: false,
            paging: false,
          }}
        />
      </Grid>
    </Grid>
  );
}

export default Dashboard;
