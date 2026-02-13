"use client";

import { useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { startOfMonth } from "date-fns";
import { toast } from "sonner";
import {
  PieChart,
  Pie,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";
import api from "@/lib/api";
import { AdminGuard } from "@/components/auth/admin-guard";
import { DatePicker } from "@/components/date-picker";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function BestSellersByLiterPage() {
  const [startingDate, setStartingDate] = useState<Date | undefined>(startOfMonth(new Date()));
  const [endingDate, setEndingDate] = useState<Date | undefined>(new Date());
  const [chartData, setChartData] = useState<any[]>([]);

  const mutation = useMutation({
    mutationFn: async () => {
      const response = await api.get("charts/best-sellers-by-liter", {
        params: { startingDate, endingDate },
      });
      return response.data ?? [];
    },
    onSuccess: (data) => {
      const formatted = data.map((row: any, index: number) => ({
        name: row.product?.name,
        value: Number(row.liters),
        fill: `hsl(${(index * 47) % 360} 60% 55%)`,
      }));
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
            <h1 className="text-2xl font-semibold">Produtos mais vendidos (por L)</h1>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <DatePicker value={startingDate} onChange={setStartingDate} placeholder="Data inicial" />
            <DatePicker value={endingDate} onChange={setEndingDate} placeholder="Data final" />
            <Button onClick={() => mutation.mutate()} disabled={mutation.isPending}>
              Gerar
            </Button>
          </div>

          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={chartData} dataKey="value" innerRadius="60%" outerRadius="90%" />
                <Legend layout="vertical" align="right" verticalAlign="middle" />
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </AdminGuard>
  );
}
