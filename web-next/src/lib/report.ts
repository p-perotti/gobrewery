import pdfMake from "pdfmake/build/pdfmake";
import vfsFonts from "pdfmake/build/vfs_fonts";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale/pt-BR";

function makeCell(content: string | number, rowIndex = -1, options = {}) {
  return {
    text: content,
    fillColor: rowIndex % 2 ? "white" : "#e8e8e8",
    ...options,
  } as const;
}

export function th(content: string, rowIndex = -1, options = {}) {
  return makeCell(content, rowIndex, {
    bold: true,
    fontSize: 9,
    fillColor: "black",
    color: "white",
    ...options,
  });
}

export function td(content: string | number, rowIndex = -1, options = {}) {
  return makeCell(content, rowIndex, {
    bold: false,
    fontSize: 9,
    ...options,
  });
}

export function generateReport(
  reportTitle: string,
  pageOrientation: "portrait" | "landscape",
  columnsWidth: ("auto" | "*" | number)[],
  reportRows: Array<Array<ReturnType<typeof td>>>
) {
  const { vfs } = vfsFonts.pdfMake;
  pdfMake.vfs = vfs;

  const reportDate = format(new Date(), "d 'de' MMMM 'de' yyyy", {
    locale: ptBR,
  });

  const documentDefinition = {
    pageSize: "A4",
    pageOrientation,
    footer: (currentPage: number, pageCount: number) => ({
      text: `${reportDate} - Página ${currentPage.toString()} de ${pageCount.toString()}`,
      alignment: "center",
      fontSize: 7,
    }),
    styles: {
      title: { fontSize: 24 },
      titleSub: { fontSize: 18 },
      titleDate: { fontSize: 9, alignment: "right", bold: true },
    },
    content: [
      {
        columns: [
          { text: "GoBrewery", style: "title", width: "*" },
          { text: reportDate, style: "titleDate", width: 160 },
        ],
      },
      { text: `${reportTitle}\n\n`, style: "titleSub" },
      {
        table: {
          headerRows: 1,
          widths: columnsWidth,
          body: reportRows,
        },
      },
    ],
  };

  pdfMake.createPdf(documentDefinition).open();
}
