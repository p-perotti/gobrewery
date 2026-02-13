"use client";

import { useState } from "react";
import { startOfMonth, format } from "date-fns";
import ptBR from "date-fns/locale/pt-BR";
import { toast } from "sonner";
import api from "@/lib/api";
import { generateReport, td, th } from "@/lib/report";
import { AdminGuard } from "@/components/auth/admin-guard";
import { DatePicker } from "@/components/date-picker";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";

export default function StockOperationsReportPage() {
  const [startingDate, setStartingDate] = useState<Date | undefined>(
    startOfMonth(new Date())
  );
  const [endingDate, setEndingDate] = useState<Date | undefined>(new Date());
  const [synthetic, setSynthetic] = useState(false);

  const syntheticReport = (data: any[]) => {
    const body = [[th("Produto"), th("Tamanho"), th("Saldo Atual")]];

    let currentTotal = 0;

    data.forEach((row, index) => {
      body.push([
        td(row.product?.name, index),
        td(row.size?.description, index),
        td(row.current_balance, index),
      ]);

      currentTotal += Number(row.current_balance);
    });

    body[data.length + 1] = [
      td("Total", -1, { colSpan: 2, fillColor: "black", color: "white", alignment: "right" }),
      td(""),
      td(currentTotal, -1, { fillColor: "black", color: "white" }),
    ];

    generateReport(
      `Relatório resumido de estoque (em ${format(new Date(), "dd/MM/yy", { locale: ptBR })})`,
      "portrait",
      ["*", "*", "auto"],
      body
    );
  };

  const report = (data: any[]) => {
    const body = [
      [
        th("Produto"),
        th("Tamanho"),
        th("Saldo Anterior"),
        th("Entradas"),
        th("Saídas"),
        th("Saldo Atual"),
      ],
    ];

    let previousTotal = 0;
    let totalInwards = 0;
    let totalOutwards = 0;
    let currentTotal = 0;

    data.forEach((row, index) => {
      body.push([
        td(row.product?.name, index),
        td(row.size?.description, index),
        td(row.previous_balance, index),
        td(row.inward, index),
        td(row.outward, index),
        td(row.current_balance, index),
      ]);

      previousTotal += Number(row.previous_balance);
      totalInwards += Number(row.inward);
      totalOutwards += Number(row.outward);
      currentTotal += Number(row.current_balance);
    });

    body[data.length + 1] = [
      td("Total", -1, { colSpan: 2, fillColor: "black", color: "white", alignment: "right" }),
      td(""),
      td(previousTotal, -1, { fillColor: "black", color: "white" }),
      td(totalInwards, -1, { fillColor: "black", color: "white" }),
      td(totalOutwards, -1, { fillColor: "black", color: "white" }),
      td(currentTotal, -1, { fillColor: "black", color: "white" }),
    ];

    const periodStart = startingDate ? format(startingDate, "dd/MM/yy", { locale: ptBR }) : "";
    const periodEnd = endingDate ? format(endingDate, "dd/MM/yy", { locale: ptBR }) : "";

    generateReport(
      `Relatório de estoque (${periodStart} à ${periodEnd})`,
      "portrait",
      ["*", "*", "auto", "auto", "auto", "auto"],
      body
    );
  };

  const handleGenerate = async () => {
    try {
      const params = synthetic
        ? { synthetic }
        : { startingDate, endingDate, synthetic };
      const response = await api.get("reports/stock-operations", { params });

      if (response.data && response.data.length > 0) {
        if (synthetic) {
          syntheticReport(response.data);
        } else {
          report(response.data);
        }
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
            <h1 className="text-2xl font-semibold">Relatório de estoque</h1>
          </div>

          <div className="grid gap-4 md:grid-cols-4">
            {!synthetic ? (
              <>
                <DatePicker value={startingDate} onChange={setStartingDate} placeholder="Data inicial" />
                <DatePicker value={endingDate} onChange={setEndingDate} placeholder="Data final" />
              </>
            ) : null}
            <div className="flex items-center gap-2">
              <Switch checked={synthetic} onCheckedChange={setSynthetic} />
              <span className="text-sm">Resumido</span>
            </div>
            <Button onClick={handleGenerate}>Gerar</Button>
          </div>
        </CardContent>
      </Card>
    </AdminGuard>
  );
}
