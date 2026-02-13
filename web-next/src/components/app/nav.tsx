"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useIsAdmin, useIsGuest } from "@/stores/auth";
import {
  BarChart3,
  ClipboardList,
  LayoutGrid,
  Package,
  PieChart,
  Receipt,
  ShoppingBasket,
  Users,
} from "lucide-react";

const baseLinks = [
  { label: "Home", href: "/home", icon: LayoutGrid, adminOnly: false, guestOnly: false },
  { label: "Usuários", href: "/users", icon: Users, adminOnly: true, guestOnly: true },
  { label: "Tamanhos", href: "/sizes", icon: Package, adminOnly: false, guestOnly: false },
  { label: "Produtos", href: "/products", icon: ShoppingBasket, adminOnly: false, guestOnly: false },
  { label: "Cupons", href: "/coupons", icon: Receipt, adminOnly: false, guestOnly: false },
  {
    label: "Movimentações",
    href: "/stock-operations",
    icon: ClipboardList,
    adminOnly: false,
    guestOnly: false,
  },
  { label: "Dashboard", href: "/dashboard", icon: BarChart3, adminOnly: true, guestOnly: false },
];

const chartLinks = [
  { label: "Produtos por L", href: "/charts/best-sellers-by-liter", icon: PieChart },
  {
    label: "Movimentações semanais",
    href: "/charts/monthly-stock-operations-by-week",
    icon: PieChart,
  },
];

const reportsLinks = [
  { label: "Vendas", href: "/reports/sales" },
  { label: "Estoque", href: "/reports/stock-operations" },
  { label: "Desconto por cupom", href: "/reports/total-discount-by-coupon" },
];

export function AppNav() {
  const pathname = usePathname();
  const isAdmin = useIsAdmin();
  const isGuest = useIsGuest();

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
          Navegação
        </p>
        <div className="space-y-1">
          {baseLinks
            .filter((link) => {
              if (isAdmin) return true;
              if (isGuest && link.guestOnly) return true;
              return !link.adminOnly;
            })
            .map((link) => {
              const isActive = pathname === link.href;
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {link.label}
                </Link>
              );
            })}
        </div>
      </div>
      {isAdmin ? (
        <>
          <div className="space-y-2">
            <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
              Gráficos
            </p>
            <div className="space-y-1">
              {chartLinks.map((link) => {
                const isActive = pathname === link.href;
                const Icon = link.icon;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition",
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted"
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    {link.label}
                  </Link>
                );
              })}
            </div>
          </div>
          <div className="space-y-2">
            <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
              Relatórios
            </p>
            <div className="space-y-1">
              {reportsLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      "flex items-center justify-between rounded-lg px-3 py-2 text-sm font-medium transition",
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted"
                    )}
                  >
                    {link.label}
                    <span className="text-xs">→</span>
                  </Link>
                );
              })}
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
}
