"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/auth";

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const signed = useAuthStore((state) => state.signed);
  const hasHydrated = useAuthStore((state) => state.hasHydrated);

  useEffect(() => {
    if (hasHydrated && !signed) {
      router.replace("/");
    }
  }, [hasHydrated, signed, router]);

  if (!hasHydrated) {
    return null;
  }

  if (!signed) {
    return null;
  }

  return <>{children}</>;
}
