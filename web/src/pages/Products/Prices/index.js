import React, { useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import MaterialTable from 'material-table';
import { format, parseISO } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
import { utcToZonedTime } from 'date-fns-tz';

import Loader from '~/components/Loader';

import { formatPrice } from '~/util/format';

import { options, localization } from '~/config/MaterialTableConfig';

import api from '~/services/api';
import history from '~/services/history';

function Prices() {
  const { id } = useParams();

  const [data, setData] = useState([]);

  const loadValues = useCallback(async () => {
    const response = await api.get(`products/${id}/prices`);

    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    const dataFormatted = response.data.map((prices) => ({
      ...prices,
      startingDateFormatted: format(
        utcToZonedTime(parseISO(prices.starting_date), timezone),
        'dd/MM/yyyy HH:mm',
        {
          locale: ptBR,
        }
      ),
      expirationDateFormatted: format(
        utcToZonedTime(parseISO(prices.expiration_date), timezone),
        'dd/MM/yyyy HH:mm',
        {
          locale: ptBR,
        }
      ),
      priceFormatted: formatPrice(prices.price),
    }));

    setData(dataFormatted);
  }, [id]);

  return (
    <Loader loadFunction={loadValues}>
      <MaterialTable
        title=""
        columns={[
          { title: 'Descrição', field: 'description' },
          { title: 'Início', field: 'startingDateFormatted' },
          { title: 'Expiração', field: 'expirationDateFormatted' },
          { title: 'Preço', field: 'priceFormatted' },
        ]}
        data={data}
        localization={localization.ptBR}
        options={{ ...options, maxBodyHeight: 'calc(100vh - 325px)' }}
        actions={[
          {
            icon: 'add',
            tooltip: 'Adicionar',
            isFreeAction: true,
            onClick: (_event) => history.push(`/products/${id}/prices/new`),
          },
          {
            icon: 'edit',
            tooltip: 'Editar',
            onClick: (_event, rowData) =>
              history.push(
                `/products/${rowData.product.id}/prices/${rowData.id}`
              ),
          },
        ]}
        components={{
          // eslint-disable-next-line react/prop-types
          Container: ({ children }) => <div>{children}</div>,
        }}
      />
    </Loader>
  );
}

export default Prices;
