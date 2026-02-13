"use client";

import { useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { format, startOfMonth, setWeek, startOfWeek, endOfWeek } from "date-fns";
import { toast } from "sonner";
import {
  ResponsiveContainer,
  BarChart,
  XAxis,
  YAxis,
  Bar,
  Legend,
  Tooltip,
} from "recharts";
import api from "@/lib/api";
import { AdminGuard } from "@/components/auth/admin-guard";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function MonthlyStockOperationsByWeekPage() {
  const [monthYear, setMonthYear] = useState(() => format(startOfMonth(new Date()), "yyyy-MM"));
  const [chartData, setChartData] = useState<any[]>([]);

  const mutation = useMutation({
    mutationFn: async () => {
      const response = await api.get("charts/monthly-stock-operations-by-week", {
        params: { monthYear: new Date(`${monthYear}-01`) },
      });
      return response.data ?? [];
    },
    onSuccess: (data) => {
      const formatted = data.map((row: any) => {
        const weekStart = format(startOfWeek(setWeek(new Date(), row.week)), "d");
        const weekEnd = format(endOfWeek(setWeek(new Date(), row.week)), "d");
        return {
          week: `Dias ${weekStart} à ${weekEnd}`,
          inwards: Number(row.inwards),
          outwards: Number(row.outwards),
        };
      });
      setChartData(formatted);
    },
    onError: () => toast.error("Não foi possível gerar gráfico."),
  });

  useEffect(() => {
    mutation.mutate();
  }, []);

  return (
    <AdminGuard>
      <Card>
        <CardContent className="space-y-6 p-8">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
              Gráficos
            </p>
            <h1 className="text-2xl font-semibold">Movimentações de estoque semanal por mês</h1>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <Input
              type="month"
              value={monthYear}
              onChange={(event) => setMonthYear(event.target.value)}
            />
            <Button onClick={() => mutation.mutate()} disabled={mutation.isPending}>
              Gerar
            </Button>
          </div>

          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <XAxis dataKey="week" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="inwards" name="Entradas" fill="var(--chart-2)" />
                <Bar dataKey="outwards" name="Saídas" fill="var(--chart-5)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </AdminGuard>
  );
}
