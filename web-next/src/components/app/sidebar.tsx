"use client";

import Link from "next/link";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { AppNav } from "@/components/app/nav";

export function AppSidebar() {
  return (
    <aside className="hidden w-64 self-stretch border-r bg-card/80 p-6 lg:block">
      <Link href="/home" className="block text-lg font-semibold">
        GoBrewery
      </Link>
      <div className="mt-6">
        <AppNav />
      </div>
    </aside>
  );
}

export function MobileNav() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="lg:hidden">
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-72">
        <Link href="/home" className="text-lg font-semibold">
          GoBrewery
        </Link>
        <div className="mt-6">
          <AppNav />
        </div>
      </SheetContent>
    </Sheet>
  );
}
