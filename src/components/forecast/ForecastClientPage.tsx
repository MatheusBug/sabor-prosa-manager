"use client";

import { useState } from "react";
import type { HistoricalSaleData, SalesForecastData } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { getSalesForecastAction } from "@/app/(app)/forecast/actions";
import { Brain, TrendingUp, AlertTriangle, Loader2 } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart"
import { Line, LineChart, CartesianGrid, XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer } from "recharts"


const chartConfig = {
  predictedSales: {
    label: "Vendas Previstas",
    color: "hsl(var(--chart-1))",
  },
  historicalSales: {
    label: "Vendas Históricas",
    color: "hsl(var(--chart-2))",
  }
} satisfies ChartConfig;


export default function ForecastClientPage({ initialHistoricalData }: { initialHistoricalData: HistoricalSaleData[] }) {
  const [historicalDataInput, setHistoricalDataInput] = useState<string>(
    initialHistoricalData.map(d => `${d.date},${d.totalSales}`).join("\n")
  );
  const [forecast, setForecast] = useState<SalesForecastData[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const parseHistoricalData = (input: string): HistoricalSaleData[] => {
    return input
      .split("\n")
      .map(line => line.trim())
      .filter(line => line.includes(","))
      .map(line => {
        const [date, salesStr] = line.split(",");
        const totalSales = parseFloat(salesStr);
        if (date && !isNaN(totalSales) && /^\d{4}-\d{2}-\d{2}$/.test(date.trim())) {
          return { date: date.trim(), totalSales };
        }
        return null;
      })
      .filter((item): item is HistoricalSaleData => item !== null);
  };

  const handleGetForecast = async () => {
    setIsLoading(true);
    setForecast(null);
    const parsedData = parseHistoricalData(historicalDataInput);

    if (parsedData.length < 7) { // GenAI model might need a minimum amount of data
        toast({
            title: "Dados Insuficientes",
            description: "Forneça pelo menos 7 dias de dados históricos no formato AAAA-MM-DD,Vendas (Ex: 2024-01-01,150.50).",
            variant: "destructive",
        });
        setIsLoading(false);
        return;
    }
    
    const result = await getSalesForecastAction(parsedData);
    if (result.success && result.data) {
      setForecast(result.data);
      toast({ title: "Sucesso", description: "Previsão de vendas gerada." });
    } else {
      toast({ title: "Erro na Previsão", description: result.message, variant: "destructive" });
    }
    setIsLoading(false);
  };

  const combinedChartData = forecast ? 
    [
      ...initialHistoricalData.slice(-7).map(d => ({ date: d.date, historicalSales: d.totalSales, predictedSales: null })), // Show last 7 historical actuals
      ...forecast.map(f => ({ date: f.date, historicalSales: null, predictedSales: f.predictedSales }))
    ] : 
    initialHistoricalData.slice(-14).map(d => ({ date: d.date, historicalSales: d.totalSales, predictedSales: null })); // Show last 14 historical actuals if no forecast yet

  return (
    <div className="grid md:grid-cols-3 gap-6">
      <Card className="md:col-span-1 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Brain className="h-5 w-5 text-primary"/> Configurar Previsão</CardTitle>
          <CardDescription>
            Insira os dados históricos de vendas (um por linha, formato: AAAA-MM-DD,VALOR) para gerar a previsão.
            Ex: 2023-01-01,150.75
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="historicalData">Dados Históricos de Vendas</Label>
            <Textarea
              id="historicalData"
              value={historicalDataInput}
              onChange={(e) => setHistoricalDataInput(e.target.value)}
              rows={10}
              placeholder="2023-01-01,150.75\n2023-01-02,220.00\n..."
              className="font-mono text-sm"
              disabled={isLoading}
            />
          </div>
          <Button onClick={handleGetForecast} disabled={isLoading} className="w-full bg-accent text-accent-foreground hover:bg-accent/90">
            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <TrendingUp className="mr-2 h-4 w-4" />}
            {isLoading ? "Gerando Previsão..." : "Gerar Previsão de Vendas"}
          </Button>
        </CardContent>
      </Card>

      <Card className="md:col-span-2 shadow-lg">
        <CardHeader>
          <CardTitle>Resultado da Previsão (Próximos 7 Dias)</CardTitle>
          <CardDescription>
            Estimativa de vendas com base nos dados históricos fornecidos.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading && (
             <div className="flex flex-col items-center justify-center h-64 text-muted-foreground">
                <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
                <p>Processando previsão, por favor aguarde...</p>
             </div>
          )}
          {!isLoading && forecast && forecast.length > 0 && (
            <>
            <ChartContainer config={chartConfig} className="h-[300px] w-full mb-6">
              <LineChart data={combinedChartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false}/>
                <XAxis 
                  dataKey="date" 
                  tickFormatter={(value) => new Date(value).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit'})} 
                  tick={{fontSize: 12}}
                />
                <YAxis tickFormatter={(value) => `R$${value}`} tick={{fontSize: 12}}/>
                <RechartsTooltip 
                  content={<ChartTooltipContent indicator="line" />}
                  formatter={(value, name) => [`R$${(value as number).toFixed(2)}`, name === 'predictedSales' ? 'Vendas Previstas' : 'Vendas Históricas']}
                />
                <ChartLegend content={<ChartLegendContent />} />
                <Line type="monotone" dataKey="historicalSales" stroke="var(--color-historicalSales)" strokeWidth={2} dot={{r: 4}} name="Vendas Históricas" />
                <Line type="monotone" dataKey="predictedSales" stroke="var(--color-predictedSales)" strokeWidth={2} dot={{r: 4}} name="Vendas Previstas" strokeDasharray="5 5"/>
              </LineChart>
            </ChartContainer>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Data</TableHead>
                  <TableHead className="text-right">Vendas Previstas</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {forecast.map((item) => (
                  <TableRow key={item.date}>
                    <TableCell>{new Date(item.date + 'T00:00:00').toLocaleDateString('pt-BR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</TableCell>
                    <TableCell className="text-right font-semibold">R$ {item.predictedSales.toFixed(2)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            </>
          )}
          {!isLoading && (!forecast || forecast.length === 0) && (
            <div className="flex flex-col items-center justify-center h-64 text-center">
              <AlertTriangle className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground">Nenhuma previsão para exibir.</p>
              <p className="text-sm text-muted-foreground">Insira os dados históricos e clique em "Gerar Previsão".</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
