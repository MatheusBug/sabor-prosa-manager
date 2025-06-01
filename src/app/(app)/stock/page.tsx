import StockClientPage from "@/components/stock/StockClientPage";
import { MOCK_PRODUCTS } from "@/lib/constants"; // Using mock data for now

export default async function StockPage() {
  // In a real app, fetch products from your backend/database here
  const products = MOCK_PRODUCTS;

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-3xl font-bold font-headline text-foreground">Controle de Estoque</h1>
      <StockClientPage initialProducts={products} />
    </div>
  );
}
