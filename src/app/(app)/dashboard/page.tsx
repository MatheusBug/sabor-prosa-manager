
"use client";

import { useState, useEffect } from 'react';
import { StatCard } from "@/components/dashboard/StatCard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, Package, ShoppingCart, Users, BarChart, LineChart, Activity } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from "@/components/ui/chart"
import { Bar, BarChart as RechartsBarChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer, Line, LineChart as RechartsLineChart, Tooltip as RechartsTooltip } from "recharts"
import type { ChartConfig } from "@/components/ui/chart"

// Mock Data (replace with actual data fetching)
const totalRevenue = "$1,250.75";
const totalSales = "+350";
const activeProducts = "68";
const newCustomers = "+12";

const recentSales = [
  { id: "1", customer: "Alice B.", email: "alice@example.com", amount: "$75.50", status: "Pago", date: "Há 2 horas", avatar: "https://placehold.co/40x40.png?text=AB" },
  { id: "2", customer: "Bob C.", email: "bob@example.com", amount: "$120.00", status: "Pendente", date: "Há 5 horas", avatar: "https://placehold.co/40x40.png?text=BC" },
  { id: "3", customer: "Carlos D.", email: "carlos@example.com", amount: "$45.90", status: "Pago", date: "Ontem", avatar: "https://placehold.co/40x40.png?text=CD" },
];

const lowStockItems = [
  { name: "Suco de Laranja", stock: 5, threshold: 5, category: "Sucos" },
  { name: "Hambúrguer Clássico", stock: 8, threshold: 10, category: "Hambúrgueres" },
  { name: "Batata Frita P", stock: 12, threshold: 15, category: "Acompanhamentos" },
];

const initialSalesDataChart = [
  { month: "Jan", sales: 0 },
  { month: "Fev", sales: 0 },
  { month: "Mar", sales: 0 },
  { month: "Abr", sales: 0 },
  { month: "Mai", sales: 0 },
  { month: "Jun", sales: 0 },
];

const chartConfig = {
  sales: {
    label: "Vendas",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig

const dailySalesData = [
  { date: "01/07", sales: 250 },
  { date: "02/07", sales: 300 },
  { date: "03/07", sales: 280 },
  { date: "04/07", sales: 350 },
  { date: "05/07", sales: 320 },
  { date: "06/07", sales: 400 },
  { date: "07/07", sales: 380 },
];

const lineChartConfig = {
  sales: {
    label: "Vendas Diárias",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig

export default function DashboardPage() {
  const [salesDataChart, setSalesDataChart] = useState(initialSalesDataChart);

  useEffect(() => {
    setSalesDataChart([
      { month: "Jan", sales: Math.floor(Math.random() * 5000) + 1000 },
      { month: "Fev", sales: Math.floor(Math.random() * 5000) + 1000 },
      { month: "Mar", sales: Math.floor(Math.random() * 5000) + 1000 },
      { month: "Abr", sales: Math.floor(Math.random() * 5000) + 1000 },
      { month: "Mai", sales: Math.floor(Math.random() * 5000) + 1000 },
      { month: "Jun", sales: Math.floor(Math.random() * 5000) + 1000 },
    ]);
  }, []);

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-3xl font-bold font-headline text-foreground">Painel de Controle</h1>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Receita Total (Mês)" value={totalRevenue} icon={DollarSign} description="Baseado nas vendas do mês atual" trend="+10.2% vs mês passado" trendColor="text-green-500"/>
        <StatCard title="Vendas (Mês)" value={totalSales} icon={ShoppingCart} description="Número de transações individuais" trend="-1.5% vs mês passado" trendColor="text-red-500"/>
        <StatCard title="Produtos Ativos" value={activeProducts} icon={Package} description="Itens disponíveis no cardápio" />
        <StatCard title="Novos Clientes (Mês)" value={newCustomers} icon={Users} description="Contas de clientes criadas" trend="+3 nos últimos 7 dias"/>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="lg:col-span-4 shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart className="h-5 w-5 text-primary" />
              Visão Geral das Vendas Mensais
            </CardTitle>
            <CardDescription>
              Comparativo de vendas dos últimos 6 meses.
            </CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
             <ChartContainer config={chartConfig} className="h-[300px] w-full">
              <RechartsBarChart accessibilityLayer data={salesDataChart}>
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="month"
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                  tickFormatter={(value) => value.slice(0, 3)}
                />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <ChartLegend content={<ChartLegendContent />} />
                <Bar dataKey="sales" fill="var(--color-sales)" radius={4} />
              </RechartsBarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card className="lg:col-span-3 shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-primary" />
                Atividade Recente de Vendas
            </CardTitle>
            <CardDescription>Você fez {recentSales.length} vendas recentemente.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Valor</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentSales.slice(0, 3).map((sale) => (
                  <TableRow key={sale.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Image src={sale.avatar} alt={sale.customer} width={32} height={32} className="rounded-full" data-ai-hint="person avatar"/>
                        <div>
                          <div className="font-medium">{sale.customer}</div>
                          <div className="text-xs text-muted-foreground">{sale.email}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={sale.status === "Pago" ? "default" : "secondary"} 
                             className={sale.status === "Pago" ? "bg-green-500/20 text-green-700 hover:bg-green-500/30" : "bg-yellow-500/20 text-yellow-700 hover:bg-yellow-500/30"}>
                        {sale.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">{sale.amount}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="lg:col-span-3 shadow-md">
          <CardHeader>
             <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5 text-primary" />
                Itens com Baixo Estoque
            </CardTitle>
            <CardDescription>
              Produtos que precisam de reposição em breve.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {lowStockItems.length > 0 ? (
              <ul className="space-y-3">
                {lowStockItems.map((item) => (
                  <li key={item.name} className="flex justify-between items-center p-2 rounded-md hover:bg-muted/50">
                    <div>
                      <span className="font-medium">{item.name}</span>
                      <span className="text-xs text-muted-foreground ml-2">({item.category})</span>
                    </div>
                    <Badge variant="destructive" className="text-xs">Estoque: {item.stock}</Badge>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground">Nenhum item com baixo estoque no momento.</p>
            )}
          </CardContent>
        </Card>

        <Card className="lg:col-span-4 shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
                <LineChart className="h-5 w-5 text-primary" />
                Tendência de Vendas Diárias (Últimos 7 dias)
            </CardTitle>
            <CardDescription>
              Acompanhe o volume de vendas diárias.
            </CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <ChartContainer config={lineChartConfig} className="h-[300px] w-full">
              <RechartsLineChart
                accessibilityLayer
                data={dailySalesData}
                margin={{
                  left: 12,
                  right: 12,
                }}
              >
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="date"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                />
                <YAxis tickLine={false} axisLine={false} tickMargin={8} />
                <RechartsTooltip cursor={false} content={<ChartTooltipContent indicator="line" />} />
                <Line
                  dataKey="sales"
                  type="monotone"
                  stroke="var(--color-sales)"
                  strokeWidth={2}
                  dot={true}
                />
              </RechartsLineChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

    </div>
  );
}
