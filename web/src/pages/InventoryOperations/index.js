import React, { useState, useEffect, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import MaterialTable from 'material-table';
import {
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

function InventoryOperations() {
  const classes = style();

  const dispatch = useDispatch();

  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [cancelationId, setCancelationId] = useState();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLoad = useCallback(async () => {
    try {
      setIsLoading(true);

      const response = await api.get('inventory-operations');

      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

      const dataFormatted = response.data.map((inventoryOperation) => ({
        ...inventoryOperation,
        dateFormatted: format(
          utcToZonedTime(parseISO(inventoryOperation.date), timezone),
          'dd/MM/yyyy HH:mm',
          {
            locale: ptBR,
          }
        ),
      }));

      setData(dataFormatted);
      setIsLoading(false);
    } catch (err) {
      setIsLoading(false);
      dispatch(showSnackbar('error', 'Não foi possível carregar os dados.'));
    }
  }, [dispatch]);

  function handleRefresh() {
    handleLoad();
  }

  useEffect(() => {
    handleLoad();
  }, [handleLoad]);

  const [open, setOpen] = React.useState(false);

  const handleCancelRequest = (id) => {
    setCancelationId(id);
    setOpen(true);
  };

  const handleCloseCancelDialog = () => setOpen(false);

  const cancelInventoryOperation = async () => {
    try {
      handleCloseCancelDialog();
      setIsSubmitting(true);
      await api.delete(`/inventory-operations/${cancelationId}`);
      setCancelationId();
      setIsSubmitting(false);
      dispatch(showSnackbar('success', 'Cancelada com sucesso.'));
    } catch (err) {
      setCancelationId();
      setIsSubmitting(false);
      dispatch(showSnackbar('error', 'Não foi possível cancelar.'));
    }
    handleRefresh();
  };

  return (
    <>
      <MaterialTable
        title="Movimentações de Estoque"
        columns={[
          { title: 'Data de Movimentação', field: 'dateFormatted' },
          {
            title: 'Tipo de Movimentação',
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
          { title: 'Usuário', field: 'user.name' },
          {
            title: 'Cancelada',
            field: 'canceled',
            render: (rowData) => (rowData.canceled ? 'Sim' : 'Não'),
          },
          { title: 'Usuário de Cancelamento', field: 'cancelation_user.name' },
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
            onClick: (_event) => history.push('/inventory-operation/new'),
          },
          (rowData) => ({
            icon: 'cancel',
            tooltip: 'Cancelar',
            onClick: (_event) =>
              !rowData.canceled && handleCancelRequest(rowData.id),
            hidden: rowData.canceled,
          }),
        ]}
      />
      <Dialog open={open} onClose={handleCloseCancelDialog}>
        <DialogTitle>
          Confirma o cancelamento da movimentação de estoque?
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
          <Button onClick={cancelInventoryOperation} color="primary">
            Confirmar
          </Button>
        </DialogActions>
      </Dialog>
      {isSubmitting && (
        <Backdrop open className={classes.backdrop}>
          <CircularProgress color="primary" />
        </Backdrop>
      )}
    </>
  );
}

export default InventoryOperations;
