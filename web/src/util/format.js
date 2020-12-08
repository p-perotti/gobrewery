export const { format: formatCurrency } = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
});

export const formatPercentage = (value) =>
  value.toString().replace('.', ',').concat('%');
