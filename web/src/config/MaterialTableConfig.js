const options = {
  actionsColumnIndex: -1,
  pageSize: 10,
  pageSizeOptions: [10, 25, 50, 100],
  maxBodyHeight: 'calc(100vh - 230px)',
  draggable: false,
};

const localization = {
  ptBR: {
    body: {
      emptyDataSourceMessage: 'Nenhum registro para mostrar.',
      addTooltip: 'Adicionar',
      deleteTooltip: 'Excluir',
      editTooltip: 'Editar',
      filterRow: {
        filterTooltip: 'Filtro',
      },
      editRow: {
        deleteText: 'Confirma a exclusão do registro?',
        cancelTooltip: 'Cancelar',
        saveTooltip: 'Salvar',
      },
    },
    grouping: {
      placeholder: 'Arraste os cabeçalhos...',
    },
    header: {
      actions: '',
    },
    pagination: {
      labelDisplayedRows: '{from}-{to} de {count}',
      labelRowsSelect: 'linhas',
      labelRowsPerPage: 'Linhas por página:',
      firstAriaLabel: 'Primeira',
      firstTooltip: 'Primeira',
      previousAriaLabel: 'Anterior',
      previousTooltip: 'Anterior',
      nextAriaLabel: 'Seguinte',
      nextTooltip: 'Seguinte',
      lastAriaLabel: 'Última',
      lastTooltip: 'Última',
    },
    toolbar: {
      addRemoveColumns: 'Adicionar ou remover colunas',
      nRowsSelected: '{0} linha(s) selecionadas',
      showColumnsTitle: 'Mostrar colunas',
      showColumnsAriaLabel: 'Mostrar colunas',
      exportTitle: 'Exportar',
      exportAriaLabel: 'Exportar',
      exportName: 'Exportar como CSV',
      searchTooltip: 'Pesquisar',
      searchPlaceholder: 'Pesquisar',
    },
  },
};

export { options, localization };
