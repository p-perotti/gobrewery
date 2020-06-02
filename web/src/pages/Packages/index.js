import React, { useState, useEffect } from 'react';
import MaterialTable from 'material-table';
import api from '~/services/api';
import { options, localization } from '~/config/MaterialTableConfig';
import history from '~/services/history';

function Packages() {
  const [data, setData] = useState([]);

  useEffect(() => {
    (async function loadData() {
      const response = await api.get('packages');
      setData(response.data);
    })();
  }, []);

  return (
    <MaterialTable
      title="Embalagens"
      columns={[
        { title: 'Descrição', field: 'description' },
        {
          title: 'Ativo',
          field: 'active',
          render: (rowData) => (rowData.active ? 'Sim' : 'Não'),
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
          onClick: (_event) => history.push('/packages/new'),
        },
        {
          icon: 'edit',
          tooltip: 'Editar',
          onClick: (_event, rowData) => history.push(`/packages/${rowData.id}`),
        },
      ]}
    />
  );
}

export default Packages;
