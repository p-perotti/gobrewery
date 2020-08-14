import React, { useState, useCallback, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Paper, Grid, Typography, Button } from '@material-ui/core';
import { useTheme } from '@material-ui/core/styles';
import {
  ResponsiveContainer,
  BarChart,
  XAxis,
  YAxis,
  Bar,
  Legend,
  Tooltip,
} from 'recharts';
import { MuiPickersUtilsProvider, DatePicker } from '@material-ui/pickers';
import {
  startOfMonth,
  setWeek,
  startOfWeek,
  endOfWeek,
  format,
} from 'date-fns';
import DateFnsUtils from '@date-io/date-fns';
import ptBR from 'date-fns/locale/pt-BR';

import api from '~/services/api';

import { showSnackbar } from '~/store/modules/ui/actions';

import style from './styles';

function MonthlyStockOperationsByWeek() {
  const theme = useTheme();
  const classes = style();

  const dispatch = useDispatch();

  const [monthYearParam, setMonthYearParam] = useState(
    startOfMonth(new Date())
  );
  const [chartData, setChartData] = useState([{}]);

  const generateChart = useCallback(
    async (monthYear) => {
      try {
        const res = await api.get('charts/monthly-stock-operations-by-week', {
          params: { monthYear },
        });

        if (res.data) {
          const formattedData = res.data.map((row) => {
            const weekStart = format(
              startOfWeek(setWeek(new Date(), row.week)),
              'd'
            );
            const weekEnd = format(
              endOfWeek(setWeek(new Date(), row.week)),
              'd'
            );

            return {
              week: `Dias ${weekStart} à ${weekEnd}`,
              inwards: Number(row.inwards),
              outwards: Number(row.outwards),
            };
          });

          setChartData(formattedData);
        }
      } catch (error) {
        dispatch(showSnackbar('error', 'Não foi possível gerar gráfico.'));
      }
    },
    [dispatch]
  );

  useEffect(() => {
    generateChart(startOfMonth(new Date()), new Date());
  }, [generateChart]);

  function handleGenerate() {
    generateChart(monthYearParam);
  }

  return (
    <Paper className={classes.paper}>
      <Typography variant="h6" color="primary" className={classes.title}>
        Movimentações de estoque semanal por mês
      </Typography>
      <MuiPickersUtilsProvider utils={DateFnsUtils} locale={ptBR}>
        <Grid container spacing={1} className={classes.container}>
          <Grid item xs={2}>
            <DatePicker
              views={['year', 'month']}
              label="Mês/Ano"
              inputVariant="outlined"
              size="small"
              fullWidth
              format="MM/yyyy"
              cancelLabel="Cancelar"
              value={monthYearParam}
              onChange={setMonthYearParam}
            />
          </Grid>
          <Grid item xs={10} className={classes.buttons}>
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
      <div className={classes.chart}>
        <ResponsiveContainer>
          <BarChart data={chartData}>
            <XAxis dataKey="week" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar
              dataKey="inwards"
              name="Entradas"
              fill={theme.palette.success.main}
            />
            <Bar
              dataKey="outwards"
              name="Saídas"
              fill={theme.palette.error.main}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Paper>
  );
}

export default MonthlyStockOperationsByWeek;
