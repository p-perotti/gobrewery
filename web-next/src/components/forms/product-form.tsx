"use client";

import { useEffect, useState } from "react";
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
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProductPrices } from "@/components/products/product-prices";
import { ProductImages } from "@/components/products/product-images";

const schema = z.object({
  name: z.string().min(1, "Obrigatório."),
  barcode: z.string().optional(),
  description: z.string().optional(),
  active: z.boolean().default(true),
});

type FormValues = z.infer<typeof schema>;

export function ProductForm({ productId }: { productId?: string }) {
  const router = useRouter();
  const params = useParams();
  const resolvedId = productId ?? (Array.isArray(params?.id) ? params.id[0] : params?.id);
  const signed = useAuthStore((state) => state.signed);
  const hasHydrated = useAuthStore((state) => state.hasHydrated);
  const isGuest = useAuthStore((state) => Boolean(state.user?.guest));
  const isViewMode = isGuest && Boolean(resolvedId);
  const [tab, setTab] = useState("data");

  const productQuery = useQuery({
    queryKey: resolvedId ? queryKeys.product(resolvedId) : ["products", "new"],
    queryFn: async () => {
      if (!resolvedId) return null;
      const response = await api.get(`products/${resolvedId}`);
      return response.data;
    },
    enabled: Boolean(resolvedId) && signed && hasHydrated,
  });

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      barcode: "",
      description: "",
      active: true,
    },
  });

  useEffect(() => {
    if (productQuery.data) {
      form.reset({
        name: productQuery.data.name ?? "",
        barcode: productQuery.data.barcode ?? "",
        description: productQuery.data.description ?? "",
        active: Boolean(productQuery.data.active),
      });
    }
  }, [productQuery.data, form]);

  useEffect(() => {
    if (isGuest && !resolvedId) {
      toast.warning("Visitantes não podem criar registros.");
      router.replace("/products");
    }
  }, [isGuest, resolvedId, router]);

  const mutation = useMutation({
    mutationFn: async (values: FormValues) => {
      if (resolvedId) {
        await api.put(`products/${resolvedId}`, values);
      } else {
        await api.post("products", values);
      }
    },
    onSuccess: () => {
      toast.success("Salvo com sucesso.");
      router.push("/products");
    },
    onError: () => toast.error("Não foi possível salvar."),
  });

  if (isGuest && !resolvedId) {
    return null;
  }

  if (resolvedId && productQuery.isLoading) {
    return (
      <Card className="max-w-5xl">
        <CardContent className="space-y-6 p-8">
          <div className="space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-8 w-56" />
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
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
              Produtos
            </p>
            <h1 className="text-2xl font-semibold">
              {resolvedId ? (isViewMode ? "Visualizar" : "Editar") : "Novo"} produto
            </h1>
          </div>
        </div>

        <Tabs value={tab} onValueChange={setTab}>
          <TabsList>
            <TabsTrigger value="data">Dados</TabsTrigger>
                <TabsTrigger value="prices" disabled={!resolvedId}>
                  Preços
                </TabsTrigger>
            <TabsTrigger value="images" disabled={!resolvedId}>
              Imagens
            </TabsTrigger>
          </TabsList>

          <TabsContent value="data" className="space-y-4">
            <Form {...form}>
              <form
                className="space-y-4"
                onSubmit={form.handleSubmit((values) => mutation.mutate(values))}
              >
                <div className="grid gap-4 md:grid-cols-3">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem className="md:col-span-2">
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
                    name="barcode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Código de barras</FormLabel>
                        <FormControl>
                          <Input {...field} disabled={isViewMode} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Descrição</FormLabel>
                      <FormControl>
                        <Textarea rows={4} {...field} disabled={isViewMode} />
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
          </TabsContent>

          <TabsContent value="prices">
            {resolvedId ? <ProductPrices productId={resolvedId} isGuest={isGuest} /> : null}
          </TabsContent>
          <TabsContent value="images">
            {resolvedId ? <ProductImages productId={resolvedId} isGuest={isGuest} /> : null}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
