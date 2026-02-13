import { StockOperationForm } from "@/components/forms/stock-operation-form";

export default function StockOperationViewPage({
  params,
}: {
  params: { id: string };
}) {
  return <StockOperationForm operationId={params.id} />;
}
