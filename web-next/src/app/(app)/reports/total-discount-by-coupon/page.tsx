"use client";

import { useState } from "react";
import { startOfMonth, format } from "date-fns";
import { toast } from "sonner";
import api from "@/lib/api";
import { formatCurrency, formatPercentage } from "@/lib/format";
import { generateReport, td, th } from "@/lib/report";
import { AdminGuard } from "@/components/auth/admin-guard";
import { DatePicker } from "@/components/date-picker";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function TotalDiscountByCouponReportPage() {
  const [startingDate, setStartingDate] = useState<Date | undefined>(
    startOfMonth(new Date())
  );
  const [endingDate, setEndingDate] = useState<Date | undefined>(new Date());

  const report = (data: any[]) => {
    const formatType = (type: string) => (type === "P" ? "Percentual" : "Valor");
    const formatValue = (type: string, value: number) =>
      type === "P" ? formatPercentage(value) : formatCurrency(value);

    const body = [
      [th("Cupom"), th("Tipo"), th("Desconto"), th("Utilizados"), th("Desconto Total")],
    ];

    let totalUsed = 0;
    let totalDiscount = 0;

    data.forEach((row, index) => {
      body.push([
        td(row.coupon?.name, index),
        td(formatType(row.coupon?.type), index),
        td(formatValue(row.coupon?.type, row.coupon?.value), index),
        td(row.used, index),
        td(formatCurrency(row.total_discount), index),
      ]);

      totalUsed += Number(row.used);
      totalDiscount += Number(row.total_discount);
    });

    body[data.length + 1] = [
      td("Total", -1, { colSpan: 3, fillColor: "black", color: "white", alignment: "right" }),
      td(""),
      td(""),
      td(totalUsed, -1, { fillColor: "black", color: "white" }),
      td(formatCurrency(totalDiscount), -1, { fillColor: "black", color: "white" }),
    ];

    const periodStart = startingDate ? format(startingDate, "dd/MM/yy") : "";
    const periodEnd = endingDate ? format(endingDate, "dd/MM/yy") : "";

    generateReport(
      `Relatório de desconto total por cupom (${periodStart} à ${periodEnd})`,
      "portrait",
      ["*", "auto", "auto", "auto", "auto"],
      body
    );
  };

  const handleGenerate = async () => {
    try {
      const response = await api.get("reports/total-discount-by-coupon", {
        params: { startingDate, endingDate },
      });

      if (response.data && response.data.length > 0) {
        report(response.data);
      } else {
        toast.info("Nenhum resultado obtido com os filtros aplicados.");
      }
    } catch (error) {
      toast.error("Não foi possível gerar relatório.");
    }
  };

  return (
    <AdminGuard>
      <Card>
        <CardContent className="space-y-6 p-8">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
              Relatórios
            </p>
            <h1 className="text-2xl font-semibold">Desconto total por cupom</h1>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <DatePicker value={startingDate} onChange={setStartingDate} placeholder="Data inicial" />
            <DatePicker value={endingDate} onChange={setEndingDate} placeholder="Data final" />
            <Button onClick={handleGenerate}>Gerar</Button>
          </div>
        </CardContent>
      </Card>
    </AdminGuard>
  );
}
