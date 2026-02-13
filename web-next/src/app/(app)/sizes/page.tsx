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

export default function SizesPage() {
  const isGuest = useIsGuest();
  const sizesQuery = useQuery({
    queryKey: queryKeys.sizes,
    queryFn: async () => {
      const response = await api.get("sizes");
      return response.data ?? [];
    },
  });

  if (sizesQuery.isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
              Cadastros
            </p>
            <h1 className="text-2xl font-semibold">Tamanhos</h1>
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
          <h1 className="text-2xl font-semibold">Tamanhos</h1>
        </div>
        {!isGuest ? (
          <Button size="icon" asChild aria-label="Novo tamanho">
            <Link href="/sizes/new">
              <Plus className="h-4 w-4" />
            </Link>
          </Button>
        ) : null}
      </div>

      <div className="rounded-3xl border bg-card p-4">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Descrição</TableHead>
              <TableHead>Capacidade (L)</TableHead>
              <TableHead>Ativo</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {(sizesQuery.data ?? []).map((size: any) => (
              <TableRow key={size.id}>
                <TableCell>{size.description}</TableCell>
                <TableCell>{size.capacity}</TableCell>
                <TableCell>{size.active ? "Sim" : "Não"}</TableCell>
                <TableCell className="text-right">
                  <Button size="icon" asChild aria-label={isGuest ? "Visualizar" : "Editar"}>
                    <Link href={`/sizes/${size.id}`}>
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
