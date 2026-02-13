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

export default function ProductsPage() {
  const isGuest = useIsGuest();
  const productsQuery = useQuery({
    queryKey: queryKeys.products,
    queryFn: async () => {
      const response = await api.get("products");
      return response.data ?? [];
    },
  });

  if (productsQuery.isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
              Cadastros
            </p>
            <h1 className="text-2xl font-semibold">Produtos</h1>
          </div>
          <Skeleton className="h-9 w-32" />
        </div>
        <div className="rounded-3xl border bg-card p-4">
          <div className="space-y-3">
            <Skeleton className="h-8 w-full" />
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
          <h1 className="text-2xl font-semibold">Produtos</h1>
        </div>
        {!isGuest ? (
          <Button size="icon" asChild aria-label="Novo produto">
            <Link href="/products/new">
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
              <TableHead>Código de barras</TableHead>
              <TableHead>Ativo</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {(productsQuery.data ?? []).map((product: any) => (
              <TableRow key={product.id}>
                <TableCell>{product.name}</TableCell>
                <TableCell>{product.barcode}</TableCell>
                <TableCell>{product.active ? "Sim" : "Não"}</TableCell>
                <TableCell className="text-right">
                  <Button size="icon" asChild aria-label={isGuest ? "Visualizar" : "Editar"}>
                    <Link href={`/products/${product.id}`}>
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
