"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import api from "@/lib/api";
import { queryKeys } from "@/lib/query-keys";
import { useAuthStore } from "@/stores/auth";
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
  description: z.string().min(1, "Obrigatório."),
  capacity: z.string().optional(),
  active: z.boolean().default(true),
});

type FormValues = z.infer<typeof schema>;

export function SizeForm({ sizeId }: { sizeId?: string }) {
  const router = useRouter();
  const params = useParams();
  const resolvedId = sizeId ?? (Array.isArray(params?.id) ? params.id[0] : params?.id);
  const signed = useAuthStore((state) => state.signed);
  const hasHydrated = useAuthStore((state) => state.hasHydrated);
  const isGuest = useAuthStore((state) => Boolean(state.user?.guest));
  const isViewMode = isGuest && Boolean(resolvedId);

  const sizeQuery = useQuery({
    queryKey: resolvedId ? queryKeys.size(resolvedId) : ["sizes", "new"],
    queryFn: async () => {
      if (!resolvedId) return null;
      const response = await api.get(`sizes/${resolvedId}`);
      return response.data;
    },
    enabled: Boolean(resolvedId) && signed && hasHydrated,
  });

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      description: "",
      capacity: "",
      active: true,
    },
  });

  useEffect(() => {
    if (sizeQuery.data) {
      form.reset({
        description: sizeQuery.data.description ?? "",
        capacity: sizeQuery.data.capacity?.toString() ?? "",
        active: Boolean(sizeQuery.data.active),
      });
    }
  }, [sizeQuery.data, form]);

  useEffect(() => {
    if (isGuest && !resolvedId) {
      toast.warning("Visitantes não podem criar registros.");
      router.replace("/sizes");
    }
  }, [isGuest, resolvedId, router]);

  const mutation = useMutation({
    mutationFn: async (values: FormValues) => {
      const payload = {
        ...values,
        capacity: values.capacity ? Number(values.capacity) : null,
      };
      if (resolvedId) {
        await api.put(`sizes/${resolvedId}`, payload);
      } else {
        await api.post("sizes", payload);
      }
    },
    onSuccess: () => {
      toast.success("Salvo com sucesso.");
      router.push("/sizes");
    },
    onError: () => toast.error("Não foi possível salvar."),
  });

  if (resolvedId && sizeQuery.isLoading) {
    return (
      <Card className="max-w-3xl">
        <CardContent className="space-y-6 p-8">
          <div className="space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-8 w-48" />
          </div>
          <div className="space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-40" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (isGuest && !resolvedId) {
    return null;
  }

  return (
    <Card className="max-w-3xl">
      <CardContent className="space-y-6 p-8">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
            Tamanhos
          </p>
          <h1 className="text-2xl font-semibold">
            {resolvedId ? (isViewMode ? "Visualizar" : "Editar") : "Novo"} tamanho
          </h1>
        </div>

        <Form {...form}>
          <form
            className="space-y-4"
            onSubmit={form.handleSubmit((values) => mutation.mutate(values))}
          >
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descrição</FormLabel>
                  <FormControl>
                    <Input {...field} disabled={isViewMode} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="capacity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Capacidade (L)</FormLabel>
                  <FormControl>
                    <Input type="number" step="0.001" {...field} disabled={isViewMode} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

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
