import pdfMake from 'pdfmake/build/pdfmake';
import vfsFonts from 'pdfmake/build/vfs_fonts';
import { format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';

function makeCell(content, rowIndex = -1, options = {}) {
  return {
    text: content,
    fillColor: rowIndex % 2 ? 'white' : '#e8e8e8',
    ...options,
  };
}

function th(content, rowIndex = -1, options = {}) {
  return makeCell(content, rowIndex, {
    bold: true,
    fontSize: 9,
    fillColor: 'black',
    color: 'white',
    ...options,
  });
}

function td(content, rowIndex = -1, options = {}) {
  return makeCell(content, rowIndex, {
    bold: false,
    fontSize: 9,
    ...options,
  });
}

function generateReport(
  reportTitle,
  pageOrientation,
  columnsWidth,
  reportRows
) {
  const { vfs } = vfsFonts.pdfMake;
  pdfMake.vfs = vfs;

  const createDocumentDefinition = (
    reportDate,
    subHeading,
    ...contentParts
  ) => {
    const baseDocDefinition = {
      pageSize: 'A4',
      pageOrientation,
      footer: (currentPage, pageCount) => {
        return {
          text: `${reportDate} - Página ${currentPage.toString()} de ${pageCount.toString()}`,
          alignment: 'center',
          fontSize: 7,
        };
      },
      styles: {
        title: {
          fontSize: 24,
        },
        titleSub: {
          fontSize: 18,
        },
        titleDate: {
          fontSize: 9,
          alignment: 'right',
          bold: true,
        },
      },
      content: [
        {
          columns: [
            {
              text: 'GoBrewery',
              style: 'title',
              width: '*',
            },
            { text: reportDate, style: 'titleDate', width: '160' },
          ],
        },
        { text: `${subHeading}\n\n`, style: 'titleSub' },
      ],
    };
    const docDefinition = JSON.parse(JSON.stringify(baseDocDefinition));
    docDefinition.footer = baseDocDefinition.footer;
    if (contentParts) {
      docDefinition.content.push(...contentParts);
    }
    return docDefinition;
  };

  const tableData = {
    table: {
      headerRows: 1,
      widths: columnsWidth,
      body: reportRows,
    },
  };

  const documentDefinition = createDocumentDefinition(
    format(new Date(), "d 'de' MMMM 'de' yyyy", { locale: ptBR }),
    reportTitle,
    tableData
  );

  pdfMake.createPdf(documentDefinition).open();
}

export { th, td, generateReport };
