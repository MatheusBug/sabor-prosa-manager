"use client";

import { useState } from "react";
import type { Product, Sale, SaleItem } from "@/lib/types";
import { RecordSaleForm } from "./RecordSaleForm";
import { SalesHistoryTable, type SaleHistoryColumn } from "./SalesHistoryTable";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
// import { recordSaleAction } from "@/app/(app)/sales/actions"; // To be created

export default function SalesClientPage({
  availableProducts,
  initialSalesHistory,
}: {
  availableProducts: Product[];
  initialSalesHistory: Sale[];
}) {
  const [salesHistory, setSalesHistory] = useState<Sale[]>(initialSalesHistory);
  const { toast } = useToast();

  const handleRecordSale = async (items: Omit<SaleItem, 'productName' | 'totalPrice'>[], totalAmount: number, paymentMethod?: string) => {
    const saleItemsWithDetails: SaleItem[] = items.map(item => {
      const product = availableProducts.find(p => p.id === item.productId);
      return {
        ...item,
        productName: product?.name || "Produto Desconhecido",
        totalPrice: item.quantity * item.unitPrice,
      };
    });
    
    const newSale: Sale = {
      id: `sale-${Date.now()}`, // Temporary ID
      items: saleItemsWithDetails,
      totalAmount,
      saleDate: new Date().toISOString(),
      paymentMethod,
    };

    // const result = await recordSaleAction(newSale);
    // For now, simulate:
    const result = { success: true, message: "Venda registrada com sucesso!", sale: newSale };
    await new Promise(resolve => setTimeout(resolve, 500));

    if (result.success && result.sale) {
      setSalesHistory(prev => [result.sale!, ...prev]);
      toast({ title: "Sucesso", description: result.message });
      // Here you would also trigger stock updates
    } else {
      toast({ title: "Erro", description: result.message, variant: "destructive" });
    }
  };

  const salesColumns: SaleHistoryColumn[] = [
    { 
      accessorKey: "saleDate", 
      header: "Data",
      cell: ({ row }) => new Date(row.original.saleDate).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })
    },
    { 
      accessorKey: "items", 
      header: "Itens",
      cell: ({ row }) => row.original.items.map(item => `${item.productName} (x${item.quantity})`).join(", ")
    },
    { 
      accessorKey: "totalAmount", 
      header: "Valor Total",
      cell: ({ row }) => `R$ ${row.original.totalAmount.toFixed(2)}`
    },
    { accessorKey: "paymentMethod", header: "Pagamento" },
  ];

  return (
    <div className="grid md:grid-cols-3 gap-6">
      <div className="md:col-span-1">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Registrar Nova Venda</CardTitle>
            <CardDescription>Selecione os produtos e a quantidade para registrar uma venda.</CardDescription>
          </CardHeader>
          <CardContent>
            <RecordSaleForm products={availableProducts} onSubmit={handleRecordSale} />
          </CardContent>
        </Card>
      </div>
      <div className="md:col-span-2">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Histórico de Vendas</CardTitle>
            <CardDescription>Visualize todas as vendas registradas.</CardDescription>
          </CardHeader>
          <CardContent>
            <SalesHistoryTable columns={salesColumns} data={salesHistory} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
