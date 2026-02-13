"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/auth";

export function AdminGuard({
  children,
  allowGuestReadOnly = false,
}: {
  children: React.ReactNode;
  allowGuestReadOnly?: boolean;
}) {
  const router = useRouter();
  const signed = useAuthStore((state) => state.signed);
  const isAdmin = useAuthStore((state) => Boolean(state.user?.administrator));
  const isGuest = useAuthStore((state) => Boolean(state.user?.guest));
  const hasHydrated = useAuthStore((state) => state.hasHydrated);
  const allowed = isAdmin || (allowGuestReadOnly && isGuest);

  useEffect(() => {
    if (hasHydrated && signed && !allowed) {
      router.replace("/restricted");
    }
  }, [hasHydrated, signed, allowed, router]);

  if (!hasHydrated) {
    return null;
  }

  if (!signed || !allowed) {
    return null;
  }

  return <>{children}</>;
}
