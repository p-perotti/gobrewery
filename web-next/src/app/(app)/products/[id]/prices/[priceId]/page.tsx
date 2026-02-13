import { ProductPriceForm } from "@/components/products/product-price-form";

export default function ProductPriceEditPage({
  params,
}: {
  params: { id: string; priceId: string };
}) {
  return <ProductPriceForm productId={params.id} priceId={params.priceId} />;
}
