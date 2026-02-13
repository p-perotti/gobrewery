import { ProductForm } from "@/components/forms/product-form";

export default function ProductEditPage({ params }: { params: { id: string } }) {
  return <ProductForm productId={params.id} />;
}
