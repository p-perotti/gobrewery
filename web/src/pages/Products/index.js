import React, { useState, useEffect } from 'react';
import MaterialTable from 'material-table';
import api from '~/services/api';
import { options, localization } from '~/config/MaterialTableConfig';
import history from '~/services/history';

function Products() {
  const [data, setData] = useState([]);

  useEffect(() => {
    async function loadData() {
      const response = await api.get('products');

      setData(response.data);
    }
    loadData();
  }, []);

  return (
    <MaterialTable
      title="Produtos"
      columns={[
        { title: 'Nome', field: 'name' },
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
          onClick: (_event) => history.push('/products/new'),
        },
        {
          icon: 'edit',
          tooltip: 'Editar',
          onClick: (_event, rowData) => history.push(`/products/${rowData.id}`),
        },
      ]}
    />
  );
}

export default Products;
