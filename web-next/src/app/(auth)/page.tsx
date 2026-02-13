"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import api from "@/lib/api";
import { useAuthStore } from "@/stores/auth";
import { useShallow } from "zustand/react/shallow";
import { Button } from "@/components/ui/button";
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
  email: z.string().email("E-mail inválido.").min(1, "Obrigatório."),
  password: z.string().min(1, "Obrigatório."),
});

type FormValues = z.infer<typeof schema>;

export default function SignInPage() {
  const router = useRouter();
  const { signIn, signed, hasHydrated, user } = useAuthStore(
    useShallow((state) => ({
      signIn: state.signIn,
      signed: state.signed,
      hasHydrated: state.hasHydrated,
      user: state.user,
    }))
  );

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { email: "", password: "" },
  });

  const mutation = useMutation({
    mutationFn: async (values: FormValues) => {
      const response = await api.post("sessions", values);
      return response.data as {
        token: string;
        user: { administrator?: boolean; guest?: boolean };
      };
    },
    onSuccess: (data) => {
      signIn(data.token, data.user);
      if (data.user?.administrator) {
        router.replace("/dashboard");
      } else {
        router.replace("/home");
      }
    },
    onError: () => {
      toast.warning("Verifique os dados e tente novamente.");
    },
  });

  const guestMutation = useMutation({
    mutationFn: async () => {
      const response = await api.post("sessions/guest");
      return response.data as {
        token: string;
        user: { administrator?: boolean; guest?: boolean };
      };
    },
    onSuccess: (data) => {
      signIn(data.token, data.user);
      if (data.user?.administrator) {
        router.replace("/dashboard");
      } else {
        router.replace("/home");
      }
    },
    onError: () => {
      toast.warning("Acesso de visitante indisponível.");
    },
  });

  useEffect(() => {
    if (hasHydrated && signed) {
      router.replace(user?.administrator ? "/dashboard" : "/home");
    }
  }, [hasHydrated, signed, user, router]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-muted/30 px-6 py-16">
      <div className="w-full max-w-md rounded-3xl border bg-card p-8 shadow-sm">
        <div className="space-y-2">
          <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
            GoBrewery
          </p>
          <h1 className="text-3xl font-semibold">Acesso ao painel</h1>
          <p className="text-sm text-muted-foreground">
            Entre com seu e-mail e senha para continuar.
          </p>
        </div>

        <Form {...form}>
          <form
            className="mt-8 space-y-6"
            onSubmit={form.handleSubmit((values) => mutation.mutate(values))}
          >
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>E-mail</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="voce@exemplo.com" {...field} />
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
                  <FormLabel>Senha</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="Sua senha" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={mutation.isPending}>
              {mutation.isPending ? "Entrando..." : "Entrar"}
            </Button>
            <Button
              type="button"
              variant="outline"
              className="w-full"
              disabled={guestMutation.isPending || mutation.isPending}
              onClick={() => guestMutation.mutate()}
            >
              {guestMutation.isPending ? "Entrando..." : "Entrar como convidado"}
            </Button>
          </form>
        </Form>
      </div>
    </main>
  );
}
