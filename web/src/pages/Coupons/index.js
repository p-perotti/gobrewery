import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import MaterialTable from 'material-table';
import { format, parseISO } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
import { utcToZonedTime } from 'date-fns-tz';

import { formatPrice, formatPercentage } from '~/util/format';

import { options, localization } from '~/config/MaterialTableConfig';

import api from '~/services/api';
import history from '~/services/history';

import { showSnackbar } from '~/store/modules/ui/actions';

function Coupons() {
  const dispatch = useDispatch();

  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    (async function loadData() {
      try {
        const response = await api.get('coupons');

        const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

        const dataFormatted = response.data.map((coupons) => ({
          ...coupons,
          startingDateFormatted: format(
            utcToZonedTime(parseISO(coupons.starting_date), timezone),
            'dd/MM/yyyy HH:mm',
            {
              locale: ptBR,
            }
          ),
          expirationDateFormatted: format(
            utcToZonedTime(parseISO(coupons.expiration_date), timezone),
            'dd/MM/yyyy HH:mm',
            {
              locale: ptBR,
            }
          ),
          valueFormatted: formatPrice(coupons.value),
        }));

        setData(dataFormatted);
      } catch (err) {
        dispatch(showSnackbar('error', 'Não foi possível carregar os dados.'));
      }
      setIsLoading(false);
    })();
  }, [dispatch]);

  return (
    <MaterialTable
      title="Cupons de Desconto"
      columns={[
        { title: 'Nome', field: 'name' },
        { title: 'Início', field: 'startingDateFormatted' },
        { title: 'Expiração', field: 'expirationDateFormatted' },
        {
          title: 'Tipo de Desconto',
          field: 'type',
          render: (rowData) => {
            switch (rowData.type) {
              case 'P':
                return 'Percentual';
              case 'V':
                return 'Valor';
              default:
                return '';
            }
          },
        },
        {
          title: 'Valor',
          field: 'value',
          render: (rowData) => {
            switch (rowData.type) {
              case 'P':
                return formatPercentage(rowData.value);
              case 'V':
                return formatPrice(rowData.value);
              default:
                return '';
            }
          },
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
          onClick: (_event) => history.push('/coupons/new'),
        },
        {
          icon: 'edit',
          tooltip: 'Editar',
          onClick: (_event, rowData) => history.push(`/coupons/${rowData.id}`),
        },
      ]}
    />
  );
}

export default Coupons;
