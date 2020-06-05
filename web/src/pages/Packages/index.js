import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import MaterialTable from 'material-table';
import { options, localization } from '~/config/MaterialTableConfig';

import api from '~/services/api';
import history from '~/services/history';

import { showSnackbar } from '~/store/modules/ui/actions';

function Packages() {
  const dispatch = useDispatch();

  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    (async function loadData() {
      try {
        const response = await api.get('packages');
        setData(response.data);
      } catch (err) {
        dispatch(showSnackbar('error', 'Não foi possível carregar os dados.'));
      }
      setIsLoading(false);
    })();
  }, [dispatch]);

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
      isLoading={isLoading}
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
