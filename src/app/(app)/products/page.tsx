import ProductClientPage from "@/components/products/ProductClientPage";
import { MOCK_PRODUCTS } from "@/lib/constants"; // Using mock data for now

export default async function ProductsPage() {
  // In a real app, fetch products from your backend/database here
  const products = MOCK_PRODUCTS;

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-3xl font-bold font-headline text-foreground">Gerenciamento de Produtos</h1>
      <ProductClientPage initialProducts={products} />
    </div>
  );
}
