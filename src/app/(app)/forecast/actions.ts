"use server";

import type { HistoricalSaleData, SalesForecastData } from "@/lib/types";
import { salesForecast } from "@/ai/flows/sales-forecasting";
import type { SalesForecastInput, SalesForecastOutput } from "@/ai/flows/sales-forecasting";

interface ForecastResult {
  success: boolean;
  data?: SalesForecastData[];
  message?: string;
}

export async function getSalesForecastAction(
  historicalData: HistoricalSaleData[]
): Promise<ForecastResult> {
  if (!historicalData || historicalData.length === 0) {
    return { success: false, message: "Dados históricos de vendas são necessários." };
  }

  const input: SalesForecastInput = {
    salesData: historicalData.map(d => ({ date: d.date, totalSales: d.totalSales })),
  };

  try {
    const output: SalesForecastOutput = await salesForecast(input);
    if (output && output.forecast) {
      return {
        success: true,
        data: output.forecast.map(f => ({ date: f.date, predictedSales: f.predictedSales })),
      };
    } else {
      return { success: false, message: "A previsão da IA não retornou dados válidos." };
    }
  } catch (error) {
    console.error("Erro na previsão de vendas IA:", error);
    // Check if error is an instance of Error to safely access message property
    const errorMessage = error instanceof Error ? error.message : "Ocorreu um erro desconhecido.";
    return { success: false, message: `Falha ao gerar previsão: ${errorMessage}` };
  }
}
