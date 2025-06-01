"use client";

import { useState, useMemo } from "react";
import type { Sale, Product, SalesReportData, StockReportData } from "@/lib/types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, PieChart, Package, TrendingUp } from "lucide-react";
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent, type ChartConfig } from "@/components/ui/chart"
import { Bar as RechartsBar, Pie as RechartsPie, ResponsiveContainer, XAxis, YAxis, CartesianGrid, BarChart as RechartsBarChart, PieChart as RechartsPieChart, Cell, Tooltip as RechartsTooltip } from "recharts";

const salesChartConfig = {
  totalSales: { label: "Vendas Totais", color: "hsl(var(--chart-1))" },
  transactions: { label: "Transações", color: "hsl(var(--chart-2))" },
} satisfies ChartConfig;

const productSalesChartConfig = {
  quantitySold: { label: "Quantidade Vendida", color: "hsl(var(--chart-1))" },
} satisfies ChartConfig;

const stockStatusChartConfig = {
  inStock: { label: "Em Estoque", color: "hsl(var(--chart-1))" },
  lowStock: { label: "Estoque Baixo", color: "hsl(var(--chart-2))" },
  outOfStock: { label: "Sem Estoque", color: "hsl(var(--chart-3))" },
} satisfies ChartConfig;


const COLORS = ["hsl(var(--chart-1))", "hsl(var(--chart-2))", "hsl(var(--chart-3))", "hsl(var(--chart-4))", "hsl(var(--chart-5))"];


export default function ReportsClientPage({ sales, products }: { sales: Sale[]; products: Product[] }) {
  
  // Sales Report Logic (Simplified example for "Today")
  const salesReport = useMemo((): SalesReportData => {
    const today = new Date().toISOString().split('T')[0];
    const todaySales = sales.filter(s => s.saleDate.startsWith(today));
    
    const totalSales = todaySales.reduce((sum, s) => sum + s.totalAmount, 0);
    const numberOfTransactions = todaySales.length;
    const averageTransactionValue = numberOfTransactions > 0 ? totalSales / numberOfTransactions : 0;

    const productSalesCount: Record<string, number> = {};
    todaySales.forEach(sale => {
      sale.items.forEach(item => {
        productSalesCount[item.productName] = (productSalesCount[item.productName] || 0) + item.quantity;
      });
    });
    const topSellingProducts = Object.entries(productSalesCount)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([name, quantitySold]) => ({ name, quantitySold }));

    return {
      period: "Hoje",
      totalSales,
      numberOfTransactions,
      averageTransactionValue,
      topSellingProducts,
    };
  }, [sales]);

  // Stock Report Logic
  const stockReport = useMemo((): StockReportData[] => {
    return products.map(product => {
      let status: StockReportData['status'] = "In Stock";
      if (product.stock <= 0) {
        status = "Out of Stock";
      } else if (product.stock <= (product.lowStockThreshold || 5)) {
        status = "Low Stock";
      }
      return {
        productName: product.name,
        currentStock: product.stock,
        status,
      };
    });
  }, [products]);

  const stockStatusCounts = useMemo(() => {
    const counts = { inStock: 0, lowStock: 0, outOfStock: 0 };
    stockReport.forEach(item => {
      if (item.status === "In Stock") counts.inStock++;
      else if (item.status === "Low Stock") counts.lowStock++;
      else counts.outOfStock++;
    });
    return [
      { name: 'Em Estoque', value: counts.inStock, fill: stockStatusChartConfig.inStock.color },
      { name: 'Estoque Baixo', value: counts.lowStock, fill: stockStatusChartConfig.lowStock.color },
      { name: 'Sem Estoque', value: counts.outOfStock, fill: stockStatusChartConfig.outOfStock.color },
    ];
  }, [stockReport]);


  return (
    <Tabs defaultValue="sales" className="space-y-4">
      <TabsList className="grid w-full grid-cols-2 md:w-1/2">
        <TabsTrigger value="sales" className="flex items-center gap-2"><TrendingUp className="h-4 w-4"/> Relatório de Vendas</TabsTrigger>
        <TabsTrigger value="stock" className="flex items-center gap-2"><Package className="h-4 w-4"/> Relatório de Estoque</TabsTrigger>
      </TabsList>

      <TabsContent value="sales" className="space-y-4">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Resumo de Vendas ({salesReport.period})</CardTitle>
            <CardDescription>Principais métricas de vendas para o período selecionado.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-3">
            <StatItem title="Vendas Totais" value={`R$ ${salesReport.totalSales.toFixed(2)}`} />
            <StatItem title="Nº de Transações" value={salesReport.numberOfTransactions.toString()} />
            <StatItem title="Valor Médio/Transação" value={`R$ ${salesReport.averageTransactionValue.toFixed(2)}`} />
          </CardContent>
        </Card>
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Produtos Mais Vendidos ({salesReport.period})</CardTitle>
          </CardHeader>
          <CardContent>
            {salesReport.topSellingProducts.length > 0 ? (
              <ChartContainer config={productSalesChartConfig} className="h-[300px] w-full">
                <RechartsBarChart data={salesReport.topSellingProducts} layout="vertical">
                  <CartesianGrid horizontal={false} />
                  <XAxis type="number" />
                  <YAxis dataKey="name" type="category" width={150} tick={{ fontSize: 12 }}/>
                  <RechartsTooltip content={<ChartTooltipContent />} cursor={{fill: 'hsl(var(--muted))'}}/>
                  <ChartLegend content={<ChartLegendContent />} />
                  <RechartsBar dataKey="quantitySold" name="Quantidade Vendida" fill="var(--color-quantitySold)" radius={4} />
                </RechartsBarChart>
              </ChartContainer>
            ) : (
              <p className="text-muted-foreground">Nenhum dado de vendas para o período.</p>
            )}
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="stock" className="space-y-4">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Status Geral do Estoque</CardTitle>
            <CardDescription>Visão geral da distribuição do status do estoque.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center">
            {stockStatusCounts.some(s => s.value > 0) ? (
              <ChartContainer config={stockStatusChartConfig} className="h-[250px] w-full max-w-xs">
                <RechartsPieChart>
                  <RechartsTooltip content={<ChartTooltipContent hideLabel />} />
                  <RechartsPie data={stockStatusCounts} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                     {stockStatusCounts.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </RechartsPie>
                  <ChartLegend content={<ChartLegendContent nameKey="name" />} className="-translate-y-2 flex-wrap gap-2 [&>*]:basis-1/4 [&>*]:justify-center" />
                </RechartsPieChart>
              </ChartContainer>
            ) : (
               <p className="text-muted-foreground py-10">Nenhum produto cadastrado para exibir status do estoque.</p>
            )}
          </CardContent>
        </Card>
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Detalhes do Estoque por Produto</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="p-2 text-left font-medium">Produto</th>
                    <th className="p-2 text-left font-medium">Estoque Atual</th>
                    <th className="p-2 text-left font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {stockReport.map(item => (
                    <tr key={item.productName} className="border-b hover:bg-muted/50">
                      <td className="p-2">{item.productName}</td>
                      <td className="p-2">{item.currentStock}</td>
                      <td className="p-2">
                        <span className={`px-2 py-0.5 rounded-full text-xs ${
                          item.status === "In Stock" ? "bg-green-500/20 text-green-700" :
                          item.status === "Low Stock" ? "bg-yellow-500/20 text-yellow-700" :
                          "bg-red-500/20 text-red-700"
                        }`}>
                          {item.status === "In Stock" ? "Em Estoque" : item.status === "Low Stock" ? "Estoque Baixo" : "Sem Estoque"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {stockReport.length === 0 && <p className="text-muted-foreground text-center py-4">Nenhum produto para exibir.</p>}
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}

function StatItem({ title, value }: { title: string; value: string }) {
  return (
    <div className="p-4 bg-muted/50 rounded-lg">
      <p className="text-sm text-muted-foreground">{title}</p>
      <p className="text-2xl font-semibold">{value}</p>
    </div>
  );
}
