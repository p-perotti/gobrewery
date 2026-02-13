"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/auth";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import api from "@/lib/api";
import { queryKeys } from "@/lib/query-keys";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

const schema = z.object({
  name: z.string().min(1, "Obrigatório."),
  email: z.string().email("E-mail inválido."),
  active: z.boolean().default(true),
  administrator: z.boolean().default(false),
});

type FormValues = z.infer<typeof schema>;

export function UserForm({ userId }: { userId?: string }) {
  const router = useRouter();
  const params = useParams();
  const resolvedId = userId ?? (Array.isArray(params?.id) ? params.id[0] : params?.id);
  const signed = useAuthStore((state) => state.signed);
  const hasHydrated = useAuthStore((state) => state.hasHydrated);
  const isGuest = useAuthStore((state) => Boolean(state.user?.guest));
  const isViewMode = isGuest && Boolean(resolvedId);

  const userQuery = useQuery({
    queryKey: resolvedId ? queryKeys.user(resolvedId) : ["users", "new"],
    queryFn: async () => {
      if (!resolvedId) return null;
      const response = await api.get(`users/${resolvedId}`);
      return response.data;
    },
    enabled: Boolean(resolvedId) && signed && hasHydrated,
  });

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      email: "",
      active: true,
      administrator: false,
    },
  });

  useEffect(() => {
    if (userQuery.data) {
      form.reset({
        name: userQuery.data.name ?? "",
        email: userQuery.data.email ?? "",
        active: Boolean(userQuery.data.active),
        administrator: Boolean(userQuery.data.administrator),
      });
    }
  }, [userQuery.data, form]);

  useEffect(() => {
    if (isGuest && !resolvedId) {
      toast.warning("Visitantes não podem criar registros.");
      router.replace("/users");
    }
  }, [isGuest, resolvedId, router]);

  const mutation = useMutation({
    mutationFn: async (values: FormValues) => {
      if (resolvedId) {
        await api.put(`users/${resolvedId}`, values);
      } else {
        await api.post("users", { ...values, password: "gobrewery" });
      }
    },
    onSuccess: () => {
      toast.success("Salvo com sucesso.");
      router.push("/users");
    },
    onError: () => toast.error("Não foi possível salvar."),
  });

  if (isGuest && !resolvedId) {
    return null;
  }

  if (resolvedId && userQuery.isLoading) {
    return (
      <Card className="max-w-3xl">
        <CardContent className="space-y-6 p-8">
          <div className="space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-8 w-48" />
          </div>
          <div className="space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-64" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="max-w-3xl">
      <CardContent className="space-y-6 p-8">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
            Usuários
          </p>
          <h1 className="text-2xl font-semibold">
            {resolvedId ? (isViewMode ? "Visualizar" : "Editar") : "Novo"} usuário
          </h1>
        </div>

        <Form {...form}>
          <form
            className="space-y-4"
            onSubmit={form.handleSubmit((values) => mutation.mutate(values))}
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome</FormLabel>
                  <FormControl>
                    <Input {...field} disabled={isViewMode} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>E-mail</FormLabel>
                  <FormControl>
                    <Input type="email" {...field} disabled={isViewMode} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex flex-wrap gap-6">
              <FormField
                control={form.control}
                name="active"
                render={({ field }) => (
                  <FormItem className="flex items-center gap-3">
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        disabled={isViewMode}
                      />
                    </FormControl>
                    <FormLabel>Ativo</FormLabel>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="administrator"
                render={({ field }) => (
                  <FormItem className="flex items-center gap-3">
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        disabled={isViewMode}
                      />
                    </FormControl>
                    <FormLabel>Administrador</FormLabel>
                  </FormItem>
                )}
              />
            </div>

            <div className="flex flex-wrap gap-3">
              {!isViewMode ? (
                <Button type="submit" disabled={mutation.isPending}>
                  Salvar
                </Button>
              ) : null}
              <Button type="button" variant="ghost" onClick={() => router.back()}>
                Voltar
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
