"use client";

import { useEffect, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { format, parseISO, isBefore } from "date-fns";
import { toast } from "sonner";
import api from "@/lib/api";
import { queryKeys } from "@/lib/query-keys";
import { useAuthStore } from "@/stores/auth";
import { Button } from "@/components/ui/button";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const schema = z
  .object({
    size: z.string().min(1, "Obrigatório."),
    starting_date: z.string().min(1, "Obrigatório."),
    expiration_date: z.string().min(1, "Obrigatório."),
    price: z.string().min(1, "Obrigatório."),
    description: z.string().min(1, "Obrigatório."),
  })
  .refine((values) => {
    if (!values.starting_date || !values.expiration_date) return true;
    const start = new Date(values.starting_date);
    const end = new Date(values.expiration_date);
    return isBefore(start, end);
  }, {
    message: "A data de início deve ser menor que a data de expiração.",
    path: ["expiration_date"],
  });

type FormValues = z.infer<typeof schema>;

export function ProductPriceForm({
  productId,
  priceId,
}: {
  productId: string;
  priceId?: string;
}) {
  const router = useRouter();
  const params = useParams();
  const resolvedProductId =
    productId ??
    (Array.isArray(params?.id) ? params.id[0] : params?.id) ??
    (Array.isArray(params?.productId) ? params.productId[0] : params?.productId);
  const resolvedPriceId =
    priceId ??
    (Array.isArray(params?.priceId) ? params.priceId[0] : params?.priceId);
  const signed = useAuthStore((state) => state.signed);
  const hasHydrated = useAuthStore((state) => state.hasHydrated);
  const isGuest = useAuthStore((state) => Boolean(state.user?.guest));
  const isViewMode = isGuest && Boolean(resolvedPriceId);

  const sizesQuery = useQuery({
    queryKey: [...queryKeys.sizes, "active"],
    queryFn: async () => {
      const response = await api.get("sizes", { params: { active: true } });
      return response.data ?? [];
    },
  });

  const productQuery = useQuery({
    queryKey: resolvedProductId
      ? queryKeys.product(resolvedProductId)
      : ["products", "missing"],
    queryFn: async () => {
      if (!resolvedProductId) return null;
      const response = await api.get(`products/${resolvedProductId}`);
      return response.data;
    },
    enabled: Boolean(resolvedProductId) && signed && hasHydrated,
  });

  const priceQuery = useQuery({
    queryKey: resolvedPriceId && resolvedProductId
      ? queryKeys.productPrice(resolvedProductId, resolvedPriceId)
      : ["prices", "new"],
    queryFn: async () => {
      if (!resolvedProductId || !resolvedPriceId) return null;
      const response = await api.get(
        `products/${resolvedProductId}/prices/${resolvedPriceId}`
      );
      return response.data;
    },
    enabled: Boolean(resolvedPriceId) && Boolean(resolvedProductId) && signed && hasHydrated,
  });

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      size: "",
      starting_date: format(new Date(), "yyyy-MM-dd'T'HH:mm"),
      expiration_date: format(new Date(), "yyyy-MM-dd'T'HH:mm"),
      price: "",
      description: "",
    },
  });

  useEffect(() => {
    if (priceQuery.data) {
      form.reset({
        size: String(priceQuery.data.size?.id ?? ""),
        starting_date: format(parseISO(priceQuery.data.starting_date), "yyyy-MM-dd'T'HH:mm"),
        expiration_date: format(parseISO(priceQuery.data.expiration_date), "yyyy-MM-dd'T'HH:mm"),
        price: String(priceQuery.data.price ?? ""),
        description: priceQuery.data.description ?? "",
      });
    }
  }, [priceQuery.data, form]);

  useEffect(() => {
    if (isGuest && !resolvedPriceId) {
      toast.warning("Visitantes não podem criar registros.");
      router.replace(`/products/${resolvedProductId}`);
    }
  }, [isGuest, resolvedPriceId, resolvedProductId, router]);

  const mutation = useMutation({
    mutationFn: async (values: FormValues) => {
      const payload = {
        size_id: Number(values.size),
        starting_date: values.starting_date,
        expiration_date: values.expiration_date,
        price: Number(values.price),
        description: values.description,
      };
      if (resolvedPriceId) {
        await api.put(
          `products/${resolvedProductId}/prices/${resolvedPriceId}`,
          payload
        );
      } else {
        await api.post(`products/${resolvedProductId}/prices`, payload);
      }
    },
    onSuccess: () => {
      toast.success("Salvo com sucesso.");
      router.push(`/products/${resolvedProductId}`);
    },
    onError: () => toast.error("Não foi possível salvar."),
  });

  const sizeOptions = useMemo(() => sizesQuery.data ?? [], [sizesQuery.data]);

  if (isGuest && !resolvedPriceId) {
    return null;
  }

  if (
    (resolvedPriceId || resolvedProductId) &&
    (priceQuery.isLoading || productQuery.isLoading)
  ) {
    return (
      <Card className="max-w-4xl">
        <CardContent className="space-y-6 p-8">
          <div className="space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-8 w-56" />
          </div>
          <div className="space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="max-w-4xl">
      <CardContent className="space-y-6 p-8">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
            Produto
          </p>
          <h1 className="text-2xl font-semibold">
            Preço {resolvedPriceId ? (isViewMode ? "(Visualizar)" : "(Editar)") : "(Novo)"}
          </h1>
          <p className="text-sm text-muted-foreground">
            {productQuery.data?.name ?? ""}
          </p>
        </div>

        <Form {...form}>
          <form
            className="space-y-4"
            onSubmit={form.handleSubmit((values) => mutation.mutate(values))}
          >
            <FormField
              control={form.control}
              name="size"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tamanho</FormLabel>
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                    disabled={isViewMode}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {sizeOptions.map((size: any) => (
                        <SelectItem key={size.id} value={String(size.id)}>
                          {size.description}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="starting_date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Início</FormLabel>
                    <FormControl>
                      <Input type="datetime-local" {...field} disabled={isViewMode} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="expiration_date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Expiração</FormLabel>
                    <FormControl>
                      <Input type="datetime-local" {...field} disabled={isViewMode} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Preço</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" {...field} disabled={isViewMode} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
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
