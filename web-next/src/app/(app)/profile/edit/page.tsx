"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
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

const schema = z
  .object({
    name: z.string().min(1, "Obrigatório."),
    email: z.string().email("E-mail inválido."),
    oldPassword: z.string().min(6, "Mínimo de 6 caracteres.").optional().or(z.literal("")),
    password: z.string().min(6, "Mínimo de 6 caracteres.").optional().or(z.literal("")),
    confirmPassword: z.string().optional().or(z.literal("")),
  })
  .refine((values) => {
    if (values.oldPassword && !values.password) return false;
    return true;
  }, {
    message: "Obrigatório.",
    path: ["password"],
  })
  .refine((values) => {
    if (values.password && values.confirmPassword !== values.password) return false;
    return true;
  }, {
    message: "Confirmação de senha deve ser igual a nova senha.",
    path: ["confirmPassword"],
  });

type FormValues = z.infer<typeof schema>;

export default function ProfileEditPage() {
  const router = useRouter();
  const isGuest = useAuthStore((state) => Boolean(state.user?.guest));

  const profileQuery = useQuery({
    queryKey: queryKeys.profile,
    queryFn: async () => {
      const response = await api.get("profile");
      return response.data;
    },
  });

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      email: "",
      oldPassword: "",
      password: "",
      confirmPassword: "",
    },
  });

  useEffect(() => {
    if (profileQuery.data) {
      form.reset({
        name: profileQuery.data.name ?? "",
        email: profileQuery.data.email ?? "",
        oldPassword: "",
        password: "",
        confirmPassword: "",
      });
    }
  }, [profileQuery.data, form]);

  useEffect(() => {
    if (isGuest) {
      toast.warning("Visitantes não podem alterar o perfil.");
      router.replace("/profile");
    }
  }, [isGuest, router]);

  const mutation = useMutation({
    mutationFn: async (values: FormValues) => {
      await api.put("profile", values);
    },
    onSuccess: () => {
      toast.success("Salvo com sucesso.");
      router.push("/profile");
    },
    onError: () => toast.error("Não foi possível salvar."),
  });

  if (isGuest) {
    return null;
  }

  if (profileQuery.isLoading) {
    return (
      <Card className="max-w-2xl">
        <CardContent className="space-y-6 p-8">
          <div className="space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-8 w-40" />
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
    <Card className="max-w-2xl">
      <CardContent className="space-y-6 p-8">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
            Perfil
          </p>
          <h1 className="text-2xl font-semibold">Editar</h1>
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
                    <Input {...field} />
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
                    <Input type="email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="oldPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Senha atual</FormLabel>
                  <FormControl>
                    <Input type="password" autoComplete="off" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nova senha</FormLabel>
                  <FormControl>
                    <Input type="password" autoComplete="off" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirmação de senha</FormLabel>
                  <FormControl>
                    <Input type="password" autoComplete="off" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex flex-wrap gap-3">
              <Button type="submit" disabled={mutation.isPending}>
                Salvar
              </Button>
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
