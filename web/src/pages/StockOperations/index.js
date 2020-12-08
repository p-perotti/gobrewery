import React, { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import MaterialTable from 'material-table';
import {
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Backdrop,
  CircularProgress,
} from '@material-ui/core';
import { format, parseISO } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
import { utcToZonedTime } from 'date-fns-tz';

import { options, localization } from '~/config/MaterialTableConfig';

import api from '~/services/api';
import history from '~/services/history';

import { showSnackbar } from '~/store/modules/ui/actions';

import style from './styles';

function StockOperations() {
  const classes = style();

  const dispatch = useDispatch();

  const administrator = useSelector((state) => state.user.administrator);

  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [cancelationId, setCancelationId] = useState();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLoad = useCallback(async () => {
    try {
      setIsLoading(true);

      const response = await api.get('stock-operations');

      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

      const dataFormatted = response.data.map((stockOperation) => ({
        ...stockOperation,
        dateFormatted: format(
          utcToZonedTime(parseISO(stockOperation.date), timezone),
          'dd/MM/yyyy HH:mm',
          {
            locale: ptBR,
          }
        ),
      }));

      setData(dataFormatted);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      dispatch(showSnackbar('error', 'Não foi possível carregar os dados.'));
    }
  }, [dispatch]);

  useEffect(() => {
    handleLoad();
  }, [handleLoad]);

  const handleCancelRequest = (id) => {
    setCancelationId(id);
    setDialogOpen(true);
  };

  const handleCloseCancelDialog = () => setDialogOpen(false);

  const cancelStockOperation = async () => {
    handleCloseCancelDialog();
    try {
      setIsSubmitting(true);
      await api.delete(`stock-operations/${cancelationId}`);
      setCancelationId();
      setIsSubmitting(false);
      dispatch(showSnackbar('success', 'Cancelada com sucesso.'));
    } catch (error) {
      setCancelationId();
      setIsSubmitting(false);
      dispatch(
        showSnackbar(
          'error',
          'Não foi possível cancelar, tente novamente ou realize uma movimentação de ajuste.'
        )
      );
    }
    handleLoad();
  };

  return (
    <>
      <MaterialTable
        title={
          <Typography variant="h6" color="primary">
            Movimentações de estoque
          </Typography>
        }
        column
        columns={[
          { title: 'Data/Hora', field: 'dateFormatted' },
          {
            title: 'Tipo',
            field: 'type',
            render: (rowData) => {
              switch (rowData.type) {
                case 'E':
                  return 'Entrada';
                case 'S':
                  return 'Saída';
                default:
                  return '';
              }
            },
          },
          { title: 'Qtd. Total', field: 'total_amount' },
          {
            title: 'Cancelada',
            field: 'canceled',
            render: (rowData) => (rowData.canceled ? 'Sim' : 'Não'),
          },
        ]}
        data={data}
        isLoading={isLoading}
        localization={localization.ptBR}
        options={options}
        actions={[
          {
            icon: 'add_circle',
            tooltip: 'Adicionar',
            isFreeAction: true,
            onClick: (_event) => history.push('/stock-operation/new'),
          },
          {
            icon: 'visibility',
            tooltip: 'Visualizar',
            onClick: (_event, rowData) =>
              history.push(`/stock-operation/${rowData.id}`),
          },
          (rowData) => ({
            icon: 'cancel',
            tooltip: 'Cancelar',
            onClick: (_event) =>
              !rowData.canceled && handleCancelRequest(rowData.id),
            hidden: !administrator || rowData.canceled,
          }),
        ]}
      />
      <Dialog open={dialogOpen} onClose={handleCloseCancelDialog}>
        <DialogTitle>
          <Typography component="span" variant="h6" color="primary">
            Confirma o cancelamento da movimentação de estoque?
          </Typography>
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Ao cancelar a movimentação de estoque, serão estornadas as
            quantidades movimentadas dos produtos. Essa operação é permanente.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseCancelDialog} autoFocus>
            Voltar
          </Button>
          <Button onClick={cancelStockOperation} color="primary">
            Confirmar
          </Button>
        </DialogActions>
      </Dialog>
      <Backdrop open={isSubmitting} className={classes.backdrop}>
        <CircularProgress color="primary" />
      </Backdrop>
    </>
  );
}

export default StockOperations;
