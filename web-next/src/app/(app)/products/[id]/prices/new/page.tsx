import { ProductPriceForm } from "@/components/products/product-price-form";

export default function ProductPriceCreatePage({
  params,
}: {
  params: { id: string };
}) {
  return <ProductPriceForm productId={params.id} />;
}
