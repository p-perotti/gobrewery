"use client";

import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { format, parseISO, startOfDay, subDays, isSameDay } from "date-fns";
import ptBR from "date-fns/locale/pt-BR";
import { toZonedTime } from "date-fns-tz";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import api from "@/lib/api";
import { queryKeys } from "@/lib/query-keys";
import { formatCurrency } from "@/lib/format";
import { AdminGuard } from "@/components/auth/admin-guard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

function StatCard({ title, value }: { title: string; value: string }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm text-muted-foreground">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-semibold">{value}</div>
      </CardContent>
    </Card>
  );
}

export default function DashboardPage() {
  const salesQuery = useQuery({
    queryKey: [...queryKeys.dashboard, "total-sales"],
    queryFn: async () => {
      const response = await api.get("dashboard/total-sales-today");
      return Number(response.data?.total ?? 0);
    },
  });

  const stockInQuery = useQuery({
    queryKey: [...queryKeys.dashboard, "stock-in"],
    queryFn: async () => {
      const response = await api.get("dashboard/total-stock-operations-today", {
        params: { type: "E" },
      });
      return Number(response.data?.total ?? 0);
    },
  });

  const stockOutQuery = useQuery({
    queryKey: [...queryKeys.dashboard, "stock-out"],
    queryFn: async () => {
      const response = await api.get("dashboard/total-stock-operations-today", {
        params: { type: "S" },
      });
      return Number(response.data?.total ?? 0);
    },
  });

  const lastDaysSalesQuery = useQuery({
    queryKey: [...queryKeys.dashboard, "last-days-sales"],
    queryFn: async () => {
      const response = await api.get("dashboard/last-days-total-sales");
      return response.data ?? [];
    },
  });

  const bestSellersQuery = useQuery({
    queryKey: [...queryKeys.dashboard, "best-sellers"],
    queryFn: async () => {
      const response = await api.get("dashboard/best-sellers-by-amount");
      return response.data ?? [];
    },
  });

  const latestSalesQuery = useQuery({
    queryKey: [...queryKeys.dashboard, "latest-sales"],
    queryFn: async () => {
      const response = await api.get("dashboard/latest-sales");
      return response.data ?? [];
    },
  });

  const isLoading =
    salesQuery.isLoading ||
    stockInQuery.isLoading ||
    stockOutQuery.isLoading ||
    lastDaysSalesQuery.isLoading ||
    bestSellersQuery.isLoading ||
    latestSalesQuery.isLoading;

  const chartData = useMemo(() => {
    const today = startOfDay(new Date());
    const lastDays = [
      subDays(today, 6),
      subDays(today, 5),
      subDays(today, 4),
      subDays(today, 3),
      subDays(today, 2),
      subDays(today, 1),
      today,
    ];
    const data = lastDaysSalesQuery.data ?? [];
    return lastDays.map((day) => {
      const result = data.find((item: { date: string }) =>
        isSameDay(parseISO(item.date), day)
      );
      return {
        date: format(day, "dd/MM (EEE)", { locale: ptBR }),
        total: result ? result.total : 0,
      };
    });
  }, [lastDaysSalesQuery.data]);

  const latestSales = useMemo(() => {
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    return (latestSalesQuery.data ?? []).map((sale: any) => ({
      ...sale,
      formattedDate: format(
        toZonedTime(parseISO(sale.date), timezone),
        "dd/MM/yyyy HH:mm",
        { locale: ptBR }
      ),
      formattedValue: formatCurrency(sale.net_total),
    }));
  }, [latestSalesQuery.data]);

  if (isLoading) {
    return (
      <AdminGuard>
        <div className="space-y-8">
          <div className="grid gap-4 md:grid-cols-3">
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
          </div>
          <Skeleton className="h-96 w-full" />
          <div className="grid gap-6 lg:grid-cols-2">
            <Skeleton className="h-64 w-full" />
            <Skeleton className="h-64 w-full" />
          </div>
        </div>
      </AdminGuard>
    );
  }

  return (
    <AdminGuard>
      <div className="space-y-8">
        <div className="grid gap-4 md:grid-cols-3">
          <StatCard
            title="Vendas"
            value={formatCurrency(salesQuery.data ?? 0)}
          />
          <StatCard title="Estoque (Entradas)" value={String(stockInQuery.data ?? 0)} />
          <StatCard title="Estoque (Saídas)" value={String(stockOutQuery.data ?? 0)} />
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Vendas (últimos 7 dias)</CardTitle>
          </CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="total" stroke="currentColor" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Produtos mais vendidos (7 dias)</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {(bestSellersQuery.data ?? []).map((item: any) => (
                <div key={`${item.product?.name}-${item.size?.description}`}
                     className="flex items-center justify-between rounded-xl border p-3">
                  <div>
                    <p className="text-sm font-medium">{item.product?.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {item.size?.description}
                    </p>
                  </div>
                  <span className="text-sm font-semibold">{item.total_amount}</span>
                </div>
              ))}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Vendas recentes</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {latestSales.map((sale: any, index: number) => (
                <div
                  key={`${sale.id ?? "sale"}-${sale.formattedDate ?? "date"}-${index}`}
                  className="rounded-xl border p-3"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">{sale.formattedDate}</p>
                      <p className="text-xs text-muted-foreground">
                        {sale.payment_method?.name}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold">{sale.formattedValue}</p>
                      <p className="text-xs text-muted-foreground">Qtd: {sale.total_amount}</p>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminGuard>
  );
}
