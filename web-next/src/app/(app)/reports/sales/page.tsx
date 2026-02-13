"use client";

import { useState } from "react";
import { startOfMonth, format, parseISO } from "date-fns";
import ptBR from "date-fns/locale/pt-BR";
import { toZonedTime } from "date-fns-tz";
import { toast } from "sonner";
import api from "@/lib/api";
import { formatCurrency } from "@/lib/format";
import { generateReport, td, th } from "@/lib/report";
import { AdminGuard } from "@/components/auth/admin-guard";
import { DatePicker } from "@/components/date-picker";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function SalesReportPage() {
  const [startingDate, setStartingDate] = useState<Date | undefined>(
    startOfMonth(new Date())
  );
  const [endingDate, setEndingDate] = useState<Date | undefined>(new Date());
  const [groupBy, setGroupBy] = useState("sale");

  const reportBySale = (data: any[]) => {
    const formatStatus = (status: string) =>
      ({ P: "Processamento", E: "Enviado", F: "Finalizado", C: "Cancelado" } as any)[status] ?? "";

    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    const body = [
      [
        th("Data"),
        th("Status"),
        th("Cliente"),
        th("F. de Pgto."),
        th("Qtd. Total"),
        th("Total Bruto"),
        th("Total Líquido"),
        th("Desc. Total"),
      ],
    ];

    let totalAmount = 0;
    let grossTotal = 0;
    let netTotal = 0;
    let totalDiscount = 0;

    data.forEach((row, index) => {
      body.push([
        td(
          format(toZonedTime(parseISO(row.date), timezone), "dd/MM/yyyy HH:mm", {
            locale: ptBR,
          }),
          index
        ),
        td(formatStatus(row.status), index),
        td(row.customer?.name, index),
        td(row.payment_method?.name, index),
        td(row.total_amount, index),
        td(formatCurrency(row.gross_total), index),
        td(formatCurrency(row.net_total), index),
        td(formatCurrency(row.total_discount), index),
      ]);

      totalAmount += Number(row.total_amount);
      grossTotal += Number(row.gross_total);
      netTotal += Number(row.net_total);
      totalDiscount += Number(row.total_discount);
    });

    body[data.length + 1] = [
      td("Total", -1, { colSpan: 4, fillColor: "black", color: "white", alignment: "right" }),
      td(""),
      td(""),
      td(""),
      td(totalAmount, -1, { fillColor: "black", color: "white" }),
      td(formatCurrency(grossTotal), -1, { fillColor: "black", color: "white" }),
      td(formatCurrency(netTotal), -1, { fillColor: "black", color: "white" }),
      td(formatCurrency(totalDiscount), -1, { fillColor: "black", color: "white" }),
    ];

    const periodStart = startingDate ? format(startingDate, "dd/MM/yy", { locale: ptBR }) : "";
    const periodEnd = endingDate ? format(endingDate, "dd/MM/yy", { locale: ptBR }) : "";

    generateReport(
      `Relatório de vendas (${periodStart} à ${periodEnd})`,
      "landscape",
      ["auto", "auto", "*", "auto", "auto", "auto", "auto", "auto"],
      body
    );
  };

  const reportByProduct = (data: any[]) => {
    const body = [[th("Produto"), th("Tamanho"), th("Preço"), th("Quantidade"), th("Total Bruto")]];

    let totalAmount = 0;
    let grossTotal = 0;

    data.forEach((row, index) => {
      body.push([
        td(row.product?.name, index),
        td(row.size?.description, index),
        td(formatCurrency(row.unit_price), index),
        td(row.amount, index),
        td(formatCurrency(row.total), index),
      ]);

      totalAmount += Number(row.amount);
      grossTotal += Number(row.total);
    });

    body[data.length + 1] = [
      td("Total", -1, { colSpan: 3, fillColor: "black", color: "white", alignment: "right" }),
      td(""),
      td(""),
      td(totalAmount, -1, { fillColor: "black", color: "white" }),
      td(formatCurrency(grossTotal), -1, { fillColor: "black", color: "white" }),
    ];

    const periodStart = startingDate ? format(startingDate, "dd/MM/yy", { locale: ptBR }) : "";
    const periodEnd = endingDate ? format(endingDate, "dd/MM/yy", { locale: ptBR }) : "";

    generateReport(
      `Relatório de vendas por produto (${periodStart} à ${periodEnd})`,
      "portrait",
      ["*", "*", "auto", "auto", "auto"],
      body
    );
  };

  const handleGenerate = async () => {
    try {
      const response = await api.get("reports/sales", {
        params: { startingDate, endingDate, groupBy },
      });
      if (response.data && response.data.length > 0) {
        if (groupBy === "sale") {
          reportBySale(response.data);
        } else {
          reportByProduct(response.data);
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
            <h1 className="text-2xl font-semibold">Relatório de vendas</h1>
          </div>

          <div className="grid gap-4 md:grid-cols-4">
            <DatePicker value={startingDate} onChange={setStartingDate} placeholder="Data inicial" />
            <DatePicker value={endingDate} onChange={setEndingDate} placeholder="Data final" />
            <Select value={groupBy} onValueChange={setGroupBy}>
              <SelectTrigger>
                <SelectValue placeholder="Agrupamento" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sale">Venda</SelectItem>
                <SelectItem value="product">Produto</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={handleGenerate}>Gerar</Button>
          </div>
        </CardContent>
      </Card>
    </AdminGuard>
  );
}
