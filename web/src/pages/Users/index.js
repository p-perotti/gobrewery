import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import Typography from '@material-ui/core/Typography';
import MaterialTable from 'material-table';
import { options, localization } from '~/config/MaterialTableConfig';

import api from '~/services/api';
import history from '~/services/history';

import { showSnackbar } from '~/store/modules/ui/actions';

function Users() {
  const dispatch = useDispatch();

  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    (async function loadData() {
      try {
        const response = await api.get('users');
        setData(response.data);
      } catch (error) {
        dispatch(showSnackbar('error', 'Não foi possível carregar os dados.'));
      }
      setIsLoading(false);
    })();
  }, [dispatch]);

  return (
    <MaterialTable
      title={
        <Typography variant="h6" color="primary">
          Usuários
        </Typography>
      }
      columns={[
        { title: 'Nome', field: 'name' },
        { title: 'E-mail', field: 'email' },
        {
          title: 'Ativo',
          field: 'active',
          render: (rowData) => (rowData.active ? 'Sim' : 'Não'),
        },
        {
          title: 'Administrador',
          field: 'administrator',
          render: (rowData) => (rowData.administrator ? 'Sim' : 'Não'),
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
          onClick: (_event) => history.push('/users/new'),
        },
        {
          icon: 'edit',
          tooltip: 'Editar',
          onClick: (_event, rowData) => history.push(`/users/${rowData.id}`),
        },
      ]}
    />
  );
}

export default Users;
