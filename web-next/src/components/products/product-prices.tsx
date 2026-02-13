"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale/pt-BR";
import { toZonedTime } from "date-fns-tz";
import api from "@/lib/api";
import { queryKeys } from "@/lib/query-keys";
import { formatCurrency } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { Eye, Pencil, Plus } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export function ProductPrices({
  productId,
  isGuest = false,
}: {
  productId: string;
  isGuest?: boolean;
}) {
  const pricesQuery = useQuery({
    queryKey: queryKeys.productPrices(productId),
    queryFn: async () => {
      const response = await api.get(`products/${productId}/prices`);
      return response.data ?? [];
    },
  });

  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Preços</h2>
        {!isGuest ? (
          <Button asChild size="icon" aria-label="Novo preço">
            <Link href={`/products/${productId}/prices/new`}>
              <Plus className="h-4 w-4" />
            </Link>
          </Button>
        ) : null}
      </div>

      <div className="rounded-2xl border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Tamanho</TableHead>
              <TableHead>Descrição</TableHead>
              <TableHead>Início</TableHead>
              <TableHead>Expiração</TableHead>
              <TableHead>Preço</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {(pricesQuery.data ?? []).map((price: any) => (
              <TableRow key={price.id}>
                <TableCell>{price.size?.description}</TableCell>
                <TableCell>{price.description}</TableCell>
                <TableCell>
                  {format(
                    toZonedTime(parseISO(price.starting_date), timezone),
                    "dd/MM/yyyy HH:mm",
                    { locale: ptBR }
                  )}
                </TableCell>
                <TableCell>
                  {format(
                    toZonedTime(parseISO(price.expiration_date), timezone),
                    "dd/MM/yyyy HH:mm",
                    { locale: ptBR }
                  )}
                </TableCell>
                <TableCell>{formatCurrency(price.price)}</TableCell>
                <TableCell className="text-right">
                  <Button size="icon" asChild aria-label={isGuest ? "Visualizar" : "Editar"}>
                    <Link href={`/products/${productId}/prices/${price.id}`}>
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
