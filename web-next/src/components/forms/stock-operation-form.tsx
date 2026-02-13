"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { format, parseISO } from "date-fns";
import { toast } from "sonner";
import api from "@/lib/api";
import { queryKeys } from "@/lib/query-keys";
import { useAuthStore } from "@/stores/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const itemSchema = z.object({
  product_id: z.string().min(1, "Obrigatório."),
  size_id: z.string().min(1, "Obrigatório."),
  amount: z.string().min(1, "Obrigatório."),
});

const schema = z.object({
  type: z.enum(["E", "S"]),
  date: z.string().min(1, "Obrigatório."),
  items: z.array(itemSchema).min(1, "Adicione ao menos um produto."),
});

type FormValues = z.infer<typeof schema>;

export function StockOperationForm({ operationId }: { operationId?: string }) {
  const router = useRouter();
  const params = useParams();
  const resolvedId =
    operationId ?? (Array.isArray(params?.id) ? params.id[0] : params?.id);
  const signed = useAuthStore((state) => state.signed);
  const hasHydrated = useAuthStore((state) => state.hasHydrated);
  const isGuest = useAuthStore((state) => Boolean(state.user?.guest));

  const productsQuery = useQuery({
    queryKey: queryKeys.products,
    queryFn: async () => {
      const response = await api.get("products", {
        params: resolvedId ? {} : { active: true },
      });
      return response.data ?? [];
    },
  });

  const sizesQuery = useQuery({
    queryKey: queryKeys.sizes,
    queryFn: async () => {
      const response = await api.get("sizes", {
        params: resolvedId ? {} : { active: true },
      });
      return response.data ?? [];
    },
  });

  const operationQuery = useQuery({
    queryKey: resolvedId ? queryKeys.stockOperation(resolvedId) : ["stock", "new"],
    queryFn: async () => {
      if (!resolvedId) return null;
      const response = await api.get(`stock-operations/${resolvedId}`, {
        params: { products: true },
      });
      return response.data;
    },
    enabled: Boolean(resolvedId) && signed && hasHydrated,
  });

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      type: "E",
      date: format(new Date(), "yyyy-MM-dd'T'HH:mm"),
      items: [],
    },
  });

  const itemsArray = useFieldArray({
    control: form.control,
    name: "items",
  });

  useEffect(() => {
    if (operationQuery.data) {
      form.reset({
        type: operationQuery.data.type ?? "E",
        date: format(parseISO(operationQuery.data.date), "yyyy-MM-dd'T'HH:mm"),
        items: (operationQuery.data.products ?? []).map((row: any) => ({
          product_id: String(row.product.id),
          size_id: String(row.size.id),
          amount: String(row.amount),
        })),
      });
    }
  }, [operationQuery.data, form]);

  useEffect(() => {
    if (isGuest && !resolvedId) {
      toast.warning("Visitantes não podem criar registros.");
      router.replace("/stock-operations");
    }
  }, [isGuest, resolvedId, router]);

  const mutation = useMutation({
    mutationFn: async (values: FormValues) => {
      if (resolvedId) return;

      if (values.type === "S") {
        const checks = await Promise.all(
          values.items.map(async (row) => {
            const response = await api.get("product-stock-amount", {
              params: { productId: row.product_id, sizeId: row.size_id },
            });
            return {
              ok: response.data?.amount >= Number(row.amount),
              available: response.data?.amount ?? 0,
            };
          })
        );

        const failed = checks.find((check) => !check.ok);
        if (failed) {
          throw new Error("Estoque insuficiente.");
        }
      }

      const stock_operation_products = values.items.map((row) => ({
        product_id: Number(row.product_id),
        size_id: Number(row.size_id),
        amount: Number(row.amount || 0),
      }));

      const totalAmount = stock_operation_products.reduce(
        (sum, row) => sum + row.amount,
        0
      );

      await api.post("stock-operations", {
        type: values.type,
        date: values.date,
        total_amount: totalAmount,
        stock_operation_products,
      });
    },
    onSuccess: () => {
      toast.success("Salvo com sucesso.");
      router.push("/stock-operations");
    },
    onError: (error) => {
      if (error instanceof Error && error.message.includes("Estoque")) {
        toast.warning("Ajuste a quantidade dos produtos indicados e tente novamente.");
      } else {
        toast.error("Não foi possível salvar.");
      }
    },
  });

  if (isGuest && !resolvedId) {
    return null;
  }

  if (resolvedId && operationQuery.isLoading) {
    return (
      <Card className="max-w-5xl">
        <CardContent className="space-y-6 p-8">
          <div className="space-y-2">
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-8 w-64" />
          </div>
          <div className="space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-24 w-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="max-w-5xl">
      <CardContent className="space-y-6 p-8">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
            Movimentação de estoque
          </p>
          <h1 className="text-2xl font-semibold">
            {resolvedId ? "Visualizar" : "Nova"} movimentação
          </h1>
          {operationQuery.data?.canceled ? (
            <p className="text-sm text-destructive">Cancelada</p>
          ) : null}
        </div>

        <Form {...form}>
          <form
            className="space-y-6"
            onSubmit={form.handleSubmit((values) => mutation.mutate(values))}
          >
            <div className="grid gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Data</FormLabel>
                    <FormControl>
                      <Input type="datetime-local" disabled={Boolean(resolvedId)} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipo</FormLabel>
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                      disabled={Boolean(resolvedId)}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="E">Entrada</SelectItem>
                        <SelectItem value="S">Saída</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">Produtos</h2>
                {!resolvedId ? (
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() =>
                      itemsArray.append({ product_id: "", size_id: "", amount: "" })
                    }
                  >
                    Adicionar produto
                  </Button>
                ) : null}
              </div>

              <div className="space-y-4">
                {itemsArray.fields.map((field, index) => (
                  <div key={field.id} className="rounded-2xl border p-4">
                    <div className="grid gap-4 md:grid-cols-3">
                      <FormField
                        control={form.control}
                        name={`items.${index}.product_id` as const}
                        render={({ field: itemField }) => (
                          <FormItem>
                            <FormLabel>Produto</FormLabel>
                            <Select
                              value={itemField.value}
                              onValueChange={itemField.onChange}
                              disabled={Boolean(resolvedId)}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Selecione" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {(productsQuery.data ?? []).map((product: any) => (
                                  <SelectItem key={product.id} value={String(product.id)}>
                                    {product.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name={`items.${index}.size_id` as const}
                        render={({ field: itemField }) => (
                          <FormItem>
                            <FormLabel>Tamanho</FormLabel>
                            <Select
                              value={itemField.value}
                              onValueChange={itemField.onChange}
                              disabled={Boolean(resolvedId)}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Selecione" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {(sizesQuery.data ?? []).map((size: any) => (
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
                      <FormField
                        control={form.control}
                        name={`items.${index}.amount` as const}
                        render={({ field: itemField }) => (
                          <FormItem>
                            <FormLabel>Quantidade</FormLabel>
                            <FormControl>
                              <Input type="number" {...itemField} disabled={Boolean(resolvedId)} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    {!resolvedId ? (
                      <div className="mt-3 text-right">
                        <Button
                          type="button"
                          variant="ghost"
                          onClick={() => itemsArray.remove(index)}
                        >
                          Remover
                        </Button>
                      </div>
                    ) : null}
                  </div>
                ))}
              </div>
            </div>

            {!resolvedId ? (
              <div className="flex flex-wrap gap-3">
                <Button type="submit" disabled={mutation.isPending}>
                  Salvar
                </Button>
                <Button type="button" variant="ghost" onClick={() => router.back()}>
                  Voltar
                </Button>
              </div>
            ) : (
              <Button type="button" variant="ghost" onClick={() => router.back()}>
                Voltar
              </Button>
            )}
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
