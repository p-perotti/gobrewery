import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Typography from '@material-ui/core/Typography';
import MaterialTable from 'material-table';

import { options, localization } from '~/config/MaterialTableConfig';

import api from '~/services/api';
import history from '~/services/history';

import { showSnackbar } from '~/store/modules/ui/actions';

function Sizes() {
  const dispatch = useDispatch();
  const guest = useSelector((state) => state.user.guest);

  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    (async function loadData() {
      try {
        const response = await api.get('sizes');
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
          Tamanhos
        </Typography>
      }
      column
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
        ...(!guest
          ? [
              {
                icon: 'add_circle',
                tooltip: 'Adicionar',
                isFreeAction: true,
                onClick: (_event) => history.push('/sizes/new'),
              },
            ]
          : []),
        {
          icon: 'edit',
          tooltip: guest ? 'Visualizar' : 'Editar',
          onClick: (_event, rowData) => history.push(`/sizes/${rowData.id}`),
        },
      ]}
    />
  );
}

export default Sizes;
