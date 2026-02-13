import { CouponForm } from "@/components/forms/coupon-form";

export default function CouponEditPage({ params }: { params: { id: string } }) {
  return <CouponForm couponId={params.id} />;
}
