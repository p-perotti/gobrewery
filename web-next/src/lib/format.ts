export const { format: formatCurrency } = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

export const formatPercentage = (value: number | string) =>
  value.toString().replace(".", ",").concat("%");
