import React, { useState, useEffect } from 'react';
import MaterialTable from 'material-table';
import api from '~/services/api';
import { options, localization } from '~/config/MaterialTableConfig';
import history from '~/services/history';

function Users() {
  const [data, setData] = useState([]);

  useEffect(() => {
    async function loadData() {
      const response = await api.get('users');

      setData(response.data);
    }
    loadData();
  }, []);

  return (
    <MaterialTable
      title="Usuários"
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
      localization={localization.ptBR}
      options={options}
      actions={[
        {
          icon: 'add',
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
