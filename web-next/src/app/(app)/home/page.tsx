export default function HomePage() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center rounded-3xl border bg-card p-8 text-center">
      <div className="space-y-3">
        <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
          GoBrewery
        </p>
        <h1 className="text-3xl font-semibold">Bem-vindo</h1>
        <p className="text-sm text-muted-foreground">
          Acompanhe suas operações e cadastros da cervejaria.
        </p>
      </div>
    </div>
  );
}
