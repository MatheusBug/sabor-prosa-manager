"use client";

import { useState } from "react";
import type { Product } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { PlusCircle, Edit, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { ProductForm } from "./ProductForm";
import { ProductDataTable, type ProductColumn } from "./ProductDataTable";
import { useToast } from "@/hooks/use-toast";
// Import server actions (to be created)
// import { addProductAction, updateProductAction, deleteProductAction } from "@/app/(app)/products/actions";


export default function ProductClientPage({ initialProducts }: { initialProducts: Product[] }) {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const { toast } = useToast();

  const handleAddProduct = () => {
    setEditingProduct(null);
    setIsFormOpen(true);
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setIsFormOpen(true);
  };
  
  const handleDeleteConfirmation = (product: Product) => {
    setProductToDelete(product);
  };

  const handleDeleteProduct = async () => {
    if (!productToDelete) return;
    // const result = await deleteProductAction(productToDelete.id);
    // For now, simulate:
    const result = { success: true, message: "Produto excluído com sucesso!" };
    await new Promise(resolve => setTimeout(resolve, 500));


    if (result.success) {
      setProducts(products.filter(p => p.id !== productToDelete.id));
      toast({ title: "Sucesso", description: result.message });
    } else {
      toast({ title: "Erro", description: result.message, variant: "destructive" });
    }
    setProductToDelete(null); // Close confirmation dialog
  };

  const handleFormSubmit = async (data: Product) => {
    if (editingProduct) {
      // const result = await updateProductAction(data);
      // For now, simulate:
      const result = { success: true, message: "Produto atualizado com sucesso!", product: data };
      await new Promise(resolve => setTimeout(resolve, 500));

      if (result.success && result.product) {
        setProducts(products.map(p => p.id === result.product!.id ? result.product! : p));
        toast({ title: "Sucesso", description: result.message });
      } else {
        toast({ title: "Erro", description: result.message, variant: "destructive" });
      }
    } else {
      // const result = await addProductAction(data);
      // For now, simulate:
      const newId = (Math.max(...products.map(p => parseInt(p.id)), 0) + 1).toString();
      const newProductWithId = { ...data, id: newId };
      const result = { success: true, message: "Produto adicionado com sucesso!", product: newProductWithId };
      await new Promise(resolve => setTimeout(resolve, 500));
      
      if (result.success && result.product) {
        setProducts([...products, result.product]);
        toast({ title: "Sucesso", description: result.message });
      } else {
        toast({ title: "Erro", description: result.message, variant: "destructive" });
      }
    }
    setIsFormOpen(false);
    setEditingProduct(null);
  };

  const columns: ProductColumn[] = [
    { accessorKey: "name", header: "Nome" },
    { accessorKey: "category", header: "Categoria" },
    { 
      accessorKey: "price", 
      header: "Preço",
      cell: ({ row }) => `R$ ${row.original.price.toFixed(2)}`
    },
    { accessorKey: "stock", header: "Estoque" },
    {
      id: "actions",
      header: "Ações",
      cell: ({ row }) => (
        <div className="flex gap-2">
          <Button variant="outline" size="icon" onClick={() => handleEditProduct(row.original)}>
            <Edit className="h-4 w-4" />
            <span className="sr-only">Editar</span>
          </Button>
          <Button variant="destructive" size="icon" onClick={() => handleDeleteConfirmation(row.original)}>
            <Trash2 className="h-4 w-4" />
            <span className="sr-only">Excluir</span>
          </Button>
        </div>
      ),
    },
  ];


  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <p className="text-muted-foreground">Visualize e gerencie seu catálogo de produtos.</p>
        <Button onClick={handleAddProduct} className="bg-accent text-accent-foreground hover:bg-accent/90">
          <PlusCircle className="mr-2 h-4 w-4" /> Adicionar Produto
        </Button>
      </div>

      <ProductDataTable columns={columns} data={products} />

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{editingProduct ? "Editar Produto" : "Adicionar Novo Produto"}</DialogTitle>
            <DialogDescription>
              {editingProduct ? "Atualize os detalhes do produto." : "Preencha as informações do novo produto."}
            </DialogDescription>
          </DialogHeader>
          <ProductForm
            onSubmit={handleFormSubmit}
            initialData={editingProduct}
            onCancel={() => setIsFormOpen(false)}
          />
        </DialogContent>
      </Dialog>

      {productToDelete && (
        <Dialog open={!!productToDelete} onOpenChange={() => setProductToDelete(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirmar Exclusão</DialogTitle>
              <DialogDescription>
                Tem certeza que deseja excluir o produto "{productToDelete.name}"? Esta ação não pode ser desfeita.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline" onClick={() => setProductToDelete(null)}>Cancelar</Button>
              </DialogClose>
              <Button variant="destructive" onClick={handleDeleteProduct}>Excluir</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
