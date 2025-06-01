"use client";

import { useState } from "react";
import type { Product } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Edit } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { StockTable, type StockColumn } from "./StockTable";
import { AdjustStockForm } from "./AdjustStockForm";
import { useToast } from "@/hooks/use-toast";
// import { adjustStockAction } from "@/app/(app)/stock/actions"; // To be created

export default function StockClientPage({ initialProducts }: { initialProducts: Product[] }) {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [isAdjustFormOpen, setIsAdjustFormOpen] = useState(false);
  const [adjustingProduct, setAdjustingProduct] = useState<Product | null>(null);
  const { toast } = useToast();

  const handleOpenAdjustForm = (product: Product) => {
    setAdjustingProduct(product);
    setIsAdjustFormOpen(true);
  };

  const handleAdjustStock = async (productId: string, newStockLevel: number, reason: string) => {
    // const result = await adjustStockAction(productId, newStockLevel, reason);
    // For now, simulate:
    const result = { success: true, message: "Estoque ajustado com sucesso!", product: products.find(p=>p.id === productId) ? {...products.find(p=>p.id === productId)!, stock: newStockLevel} : null };
    await new Promise(resolve => setTimeout(resolve, 500));


    if (result.success && result.product) {
      setProducts(products.map(p => p.id === result.product!.id ? result.product! : p));
      toast({ title: "Sucesso", description: result.message });
    } else {
      toast({ title: "Erro", description: result.message, variant: "destructive" });
    }
    setIsAdjustFormOpen(false);
    setAdjustingProduct(null);
  };

  const columns: StockColumn[] = [
    { accessorKey: "name", header: "Nome do Produto" },
    { accessorKey: "category", header: "Categoria" },
    { 
      accessorKey: "stock", 
      header: "Estoque Atual",
      cell: ({ row }) => {
        const stock = row.original.stock;
        const lowStockThreshold = row.original.lowStockThreshold || 5; // Default threshold
        let badgeColor = "bg-green-500/20 text-green-700";
        if (stock <= 0) badgeColor = "bg-red-500/20 text-red-700";
        else if (stock <= lowStockThreshold) badgeColor = "bg-yellow-500/20 text-yellow-700";
        
        return <span className={`px-2 py-1 rounded-full text-xs font-medium ${badgeColor}`}>{stock}</span>;
      }
    },
    { 
      accessorKey: "lowStockThreshold", 
      header: "Alerta Estoque Baixo",
      cell: ({ row }) => row.original.lowStockThreshold || 5
    },
    {
      id: "actions",
      header: "Ajustar",
      cell: ({ row }) => (
        <Button variant="outline" size="sm" onClick={() => handleOpenAdjustForm(row.original)}>
          <Edit className="mr-2 h-4 w-4" /> Ajustar
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <p className="text-muted-foreground">Monitore e ajuste os níveis de estoque dos seus produtos.</p>
      
      <StockTable columns={columns} data={products} />

      {adjustingProduct && (
        <Dialog open={isAdjustFormOpen} onOpenChange={setIsAdjustFormOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Ajustar Estoque de: {adjustingProduct.name}</DialogTitle>
              <DialogDescription>
                Estoque atual: {adjustingProduct.stock}. Insira o novo nível de estoque.
              </DialogDescription>
            </DialogHeader>
            <AdjustStockForm
              product={adjustingProduct}
              onSubmit={handleAdjustStock}
              onCancel={() => setIsAdjustFormOpen(false)}
            />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
