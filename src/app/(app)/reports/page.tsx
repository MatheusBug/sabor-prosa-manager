import ReportsClientPage from "@/components/reports/ReportsClientPage";
import { MOCK_SALES, MOCK_PRODUCTS } from "@/lib/constants";

export default async function ReportsPage() {
  // In a real app, fetch data for reports from your backend
  const salesData = MOCK_SALES;
  const productsData = MOCK_PRODUCTS;

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-3xl font-bold font-headline text-foreground">Relatórios</h1>
      <ReportsClientPage sales={salesData} products={productsData} />
    </div>
  );
}
