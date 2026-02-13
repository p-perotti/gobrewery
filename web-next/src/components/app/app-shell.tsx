"use client";

import { AppHeader } from "@/components/app/header";
import { AppSidebar, MobileNav } from "@/components/app/sidebar";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen items-stretch bg-muted/30">
      <AppSidebar />
      <div className="flex flex-1 flex-col">
        <div className="flex items-center justify-between gap-3 border-b bg-card/80 px-6 py-4 backdrop-blur lg:hidden">
          <MobileNav />
          <span className="text-sm font-semibold">GoBrewery</span>
        </div>
        <div className="hidden lg:block">
          <AppHeader />
        </div>
        <main className="flex-1 px-6 py-8">
          <div className="mx-auto w-full max-w-6xl">{children}</div>
        </main>
      </div>
    </div>
  );
}
