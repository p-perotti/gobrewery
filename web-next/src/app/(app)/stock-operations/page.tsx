"use client";

import Link from "next/link";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { format, parseISO } from "date-fns";
import ptBR from "date-fns/locale/pt-BR";
import { toZonedTime } from "date-fns-tz";
import { toast } from "sonner";
import api from "@/lib/api";
import { queryKeys } from "@/lib/query-keys";
import { useIsAdmin, useIsGuest } from "@/stores/auth";
import { Button } from "@/components/ui/button";
import { Eye, Plus, XCircle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function StockOperationsPage() {
  const queryClient = useQueryClient();
  const isAdmin = useIsAdmin();
  const isGuest = useIsGuest();
  const [pendingCancel, setPendingCancel] = useState<number | null>(null);

  const operationsQuery = useQuery({
    queryKey: queryKeys.stockOperations,
    queryFn: async () => {
      const response = await api.get("stock-operations");
      return response.data ?? [];
    },
  });

  const cancelMutation = useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`stock-operations/${id}`);
    },
    onSuccess: () => {
      toast.success("Cancelada com sucesso.");
      queryClient.invalidateQueries({ queryKey: queryKeys.stockOperations });
      setPendingCancel(null);
    },
    onError: () => toast.error("Não foi possível cancelar."),
  });

  if (operationsQuery.isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
              Manutenções
            </p>
            <h1 className="text-2xl font-semibold">Movimentações de estoque</h1>
          </div>
          <Skeleton className="h-9 w-40" />
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

  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
            Manutenções
          </p>
          <h1 className="text-2xl font-semibold">Movimentações de estoque</h1>
        </div>
        {!isGuest ? (
          <Button size="icon" asChild aria-label="Nova movimentação">
            <Link href="/stock-operation/new">
              <Plus className="h-4 w-4" />
            </Link>
          </Button>
        ) : null}
      </div>

      <div className="rounded-3xl border bg-card p-4">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Data/Hora</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Qtd. Total</TableHead>
              <TableHead>Cancelada</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {(operationsQuery.data ?? []).map((operation: any) => (
              <TableRow key={operation.id}>
                <TableCell>
                  {format(
                    toZonedTime(parseISO(operation.date), timezone),
                    "dd/MM/yyyy HH:mm",
                    { locale: ptBR }
                  )}
                </TableCell>
                <TableCell>{operation.type === "E" ? "Entrada" : "Saída"}</TableCell>
                <TableCell>{operation.total_amount}</TableCell>
                <TableCell>{operation.canceled ? "Sim" : "Não"}</TableCell>
                <TableCell className="text-right space-x-2">
                  <Button size="icon" asChild aria-label="Visualizar">
                    <Link href={`/stock-operation/${operation.id}`}>
                      <Eye className="h-4 w-4" />
                    </Link>
                  </Button>
                  {isAdmin && !operation.canceled ? (
                    <Button
                      size="icon"
                      onClick={() => setPendingCancel(operation.id)}
                      aria-label="Cancelar"
                    >
                      <XCircle className="h-4 w-4" />
                    </Button>
                  ) : null}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={pendingCancel !== null} onOpenChange={() => setPendingCancel(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirma o cancelamento?</DialogTitle>
            <DialogDescription>
              As quantidades serão estornadas e a operação não poderá ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setPendingCancel(null)}>
              Voltar
            </Button>
            <Button
              onClick={() => {
                if (pendingCancel) cancelMutation.mutate(pendingCancel);
              }}
            >
              Confirmar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
