export default function RestrictedPage() {
  return (
    <div className="space-y-3 rounded-3xl border bg-card p-8">
      <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
        GoBrewery
      </p>
      <h1 className="text-2xl font-semibold">Acesso restrito</h1>
      <p className="text-sm text-muted-foreground">
        Esta área está disponível apenas para administradores.
      </p>
    </div>
  );
}
