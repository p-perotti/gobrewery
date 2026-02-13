import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-muted/30 px-6 py-16">
      <div className="w-full max-w-md space-y-4 rounded-3xl border bg-card p-8 text-center">
        <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
          GoBrewery
        </p>
        <h1 className="text-3xl font-semibold">Página não encontrada</h1>
        <p className="text-sm text-muted-foreground">
          A rota solicitada não existe ou foi movida.
        </p>
        <Button asChild>
          <Link href="/home">Voltar</Link>
        </Button>
      </div>
    </main>
  );
}
