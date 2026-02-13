"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { format, isBefore, parseISO } from "date-fns";
import { toast } from "sonner";
import api from "@/lib/api";
import { queryKeys } from "@/lib/query-keys";
import { useAuthStore } from "@/stores/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
    name: z.string().min(1, "Obrigatório."),
    description: z.string().optional(),
    starting_date: z.string().min(1, "Obrigatório."),
    expiration_date: z.string().min(1, "Obrigatório."),
    type: z.enum(["P", "V"]),
    value: z.string().min(1, "Obrigatório."),
    discount_limitation: z.string().optional(),
    use_limit: z.string().optional(),
  })
  .refine((values) => {
    if (!values.starting_date || !values.expiration_date) return true;
    return isBefore(new Date(values.starting_date), new Date(values.expiration_date));
  }, {
    message: "A data inicial deve ser menor que a data de expiração.",
    path: ["expiration_date"],
  });

type FormValues = z.infer<typeof schema>;

export function CouponForm({ couponId }: { couponId?: string }) {
  const router = useRouter();
  const params = useParams();
  const resolvedId = couponId ?? (Array.isArray(params?.id) ? params.id[0] : params?.id);
  const signed = useAuthStore((state) => state.signed);
  const hasHydrated = useAuthStore((state) => state.hasHydrated);
  const isGuest = useAuthStore((state) => Boolean(state.user?.guest));
  const isViewMode = isGuest && Boolean(resolvedId);

  const couponQuery = useQuery({
    queryKey: resolvedId ? queryKeys.coupon(resolvedId) : ["coupons", "new"],
    queryFn: async () => {
      if (!resolvedId) return null;
      const response = await api.get(`coupons/${resolvedId}`);
      return response.data;
    },
    enabled: Boolean(resolvedId) && signed && hasHydrated,
  });

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      description: "",
      starting_date: format(new Date(), "yyyy-MM-dd'T'HH:mm"),
      expiration_date: format(new Date(), "yyyy-MM-dd'T'HH:mm"),
      type: "P",
      value: "",
      discount_limitation: "",
      use_limit: "",
    },
  });

  useEffect(() => {
    if (couponQuery.data) {
      form.reset({
        name: couponQuery.data.name ?? "",
        description: couponQuery.data.description ?? "",
        starting_date: format(parseISO(couponQuery.data.starting_date), "yyyy-MM-dd'T'HH:mm"),
        expiration_date: format(parseISO(couponQuery.data.expiration_date), "yyyy-MM-dd'T'HH:mm"),
        type: couponQuery.data.type ?? "P",
        value: String(couponQuery.data.value ?? ""),
        discount_limitation: couponQuery.data.discount_limitation?.toString() ?? "",
        use_limit: couponQuery.data.use_limit?.toString() ?? "",
      });
    }
  }, [couponQuery.data, form]);

  useEffect(() => {
    if (isGuest && !resolvedId) {
      toast.warning("Visitantes não podem criar registros.");
      router.replace("/coupons");
    }
  }, [isGuest, resolvedId, router]);

  const mutation = useMutation({
    mutationFn: async (values: FormValues) => {
      const payload = {
        name: values.name,
        description: values.description,
        starting_date: values.starting_date,
        expiration_date: values.expiration_date,
        type: values.type,
        value: Number(values.value),
        discount_limitation: values.discount_limitation
          ? Number(values.discount_limitation)
          : null,
        use_limit: values.use_limit ? Number(values.use_limit) : null,
      };
      if (resolvedId) {
        await api.put(`coupons/${resolvedId}`, payload);
      } else {
        await api.post("coupons", payload);
      }
    },
    onSuccess: () => {
      toast.success("Salvo com sucesso.");
      router.push("/coupons");
    },
    onError: () => toast.error("Não foi possível salvar."),
  });

  if (isGuest && !resolvedId) {
    return null;
  }

  return (
    <Card className="max-w-4xl">
      <CardContent className="space-y-6 p-8">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
            Cupons
          </p>
          <h1 className="text-2xl font-semibold">
            {resolvedId ? (isViewMode ? "Visualizar" : "Editar") : "Novo"} cupom
          </h1>
        </div>

        <Form {...form}>
          <form
            className="space-y-4"
            onSubmit={form.handleSubmit((values) => mutation.mutate(values))}
          >
            <div className="grid gap-4 md:grid-cols-2">
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
                name="discount_limitation"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {form.watch("type") === "P"
                        ? "Máximo de desconto"
                        : "Mínimo de venda"}
                    </FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" {...field} disabled={isViewMode} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="use_limit"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Limite de uso</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} disabled={isViewMode} />
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
                      disabled={isViewMode}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="P">Percentual</SelectItem>
                        <SelectItem value="V">Valor</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="value"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Desconto</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" {...field} disabled={isViewMode} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

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
