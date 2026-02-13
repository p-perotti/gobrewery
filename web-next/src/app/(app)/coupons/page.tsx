"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import { queryKeys } from "@/lib/query-keys";
import { useIsGuest } from "@/stores/auth";
import { Button } from "@/components/ui/button";
import { Eye, Pencil, Plus } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function CouponsPage() {
  const isGuest = useIsGuest();
  const couponsQuery = useQuery({
    queryKey: queryKeys.coupons,
    queryFn: async () => {
      const response = await api.get("coupons");
      return response.data ?? [];
    },
  });

  if (couponsQuery.isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
              Cadastros
            </p>
            <h1 className="text-2xl font-semibold">Cupons</h1>
          </div>
          <Skeleton className="h-9 w-32" />
        </div>
        <div className="rounded-3xl border bg-card p-4">
          <div className="space-y-3">
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
            Cadastros
          </p>
          <h1 className="text-2xl font-semibold">Cupons</h1>
        </div>
        {!isGuest ? (
          <Button size="icon" asChild aria-label="Novo cupom">
            <Link href="/coupons/new">
              <Plus className="h-4 w-4" />
            </Link>
          </Button>
        ) : null}
      </div>

      <div className="rounded-3xl border bg-card p-4">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Valor</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {(couponsQuery.data ?? []).map((coupon: any) => (
              <TableRow key={coupon.id}>
                <TableCell>{coupon.name}</TableCell>
                <TableCell>{coupon.type === "P" ? "Percentual" : "Valor"}</TableCell>
                <TableCell>{coupon.value}</TableCell>
                <TableCell className="text-right">
                  <Button size="icon" asChild aria-label={isGuest ? "Visualizar" : "Editar"}>
                    <Link href={`/coupons/${coupon.id}`}>
                      {isGuest ? <Eye className="h-4 w-4" /> : <Pencil className="h-4 w-4" />}
                    </Link>
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
