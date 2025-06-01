import ForecastClientPage from "@/components/forecast/ForecastClientPage";
import { MOCK_HISTORICAL_SALES_DATA } from "@/lib/constants";

export default async function ForecastPage() {
  // In a real app, you might fetch some default historical data or allow upload
  const historicalData = MOCK_HISTORICAL_SALES_DATA; // Example data

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-3xl font-bold font-headline text-foreground">Previsão de Vendas com IA</h1>
      <ForecastClientPage initialHistoricalData={historicalData} />
    </div>
  );
}
