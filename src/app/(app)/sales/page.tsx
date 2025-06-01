import SalesClientPage from "@/components/sales/SalesClientPage";
import { MOCK_PRODUCTS, MOCK_SALES } from "@/lib/constants";

export default async function SalesPage() {
  // In a real app, fetch products and sales history from your backend
  const products = MOCK_PRODUCTS;
  const salesHistory = MOCK_SALES;

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-3xl font-bold font-headline text-foreground">Registro de Vendas</h1>
      <SalesClientPage availableProducts={products} initialSalesHistory={salesHistory} />
    </div>
  );
}
