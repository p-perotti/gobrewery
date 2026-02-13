"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { AdminGuard } from "@/components/auth/admin-guard";
import api from "@/lib/api";
import { queryKeys } from "@/lib/query-keys";
import { useAuthStore, useIsAdmin, useIsGuest } from "@/stores/auth";
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

type UserRow = {
  id: number;
  name: string;
  email: string;
  active: boolean;
  administrator: boolean;
};

export default function UsersPage() {
  const signed = useAuthStore((state) => state.signed);
  const hasHydrated = useAuthStore((state) => state.hasHydrated);
  const isAdmin = useIsAdmin();
  const isGuest = useIsGuest();
  const usersQuery = useQuery({
    queryKey: queryKeys.users,
    queryFn: async () => {
      const response = await api.get("users");
      return response.data ?? [];
    },
    enabled: hasHydrated && signed && (isAdmin || isGuest),
  });

  if (usersQuery.isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
              Cadastros
            </p>
            <h1 className="text-2xl font-semibold">Usuários</h1>
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
    <AdminGuard allowGuestReadOnly>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
              Cadastros
            </p>
            <h1 className="text-2xl font-semibold">Usuários</h1>
          </div>
          {!isGuest ? (
            <Button size="icon" asChild aria-label="Novo usuário">
              <Link href="/users/new">
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
                <TableHead>E-mail</TableHead>
                <TableHead>Ativo</TableHead>
                <TableHead>Administrador</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {(usersQuery.data ?? []).map((user: UserRow) => (
                <TableRow key={user.id}>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.active ? "Sim" : "Não"}</TableCell>
                  <TableCell>{user.administrator ? "Sim" : "Não"}</TableCell>
                <TableCell className="text-right">
                  <Button size="icon" asChild aria-label={isGuest ? "Visualizar" : "Editar"}>
                    <Link href={`/users/${user.id}`}>
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
    </AdminGuard>
  );
}
