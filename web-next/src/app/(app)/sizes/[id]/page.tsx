import { SizeForm } from "@/components/forms/size-form";

export default function SizeEditPage({ params }: { params: { id: string } }) {
  return <SizeForm sizeId={params.id} />;
}
