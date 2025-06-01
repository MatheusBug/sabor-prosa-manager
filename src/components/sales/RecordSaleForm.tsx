"use client";

import { useState, useEffect } from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import type { Product, SaleItem } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Trash2, PlusCircle, ShoppingCart } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

const saleItemSchema = z.object({
  productId: z.string().min(1, "Produto é obrigatório."),
  quantity: z.coerce.number().min(1, "Quantidade deve ser pelo menos 1."),
  unitPrice: z.coerce.number(), // Will be populated based on selected product
});

const recordSaleSchema = z.object({
  items: z.array(saleItemSchema).min(1, "Adicione pelo menos um item à venda."),
  paymentMethod: z.string().optional(),
});

type RecordSaleFormData = z.infer<typeof recordSaleSchema>;

interface RecordSaleFormProps {
  products: Product[];
  onSubmit: (items: Omit<SaleItem, 'productName' | 'totalPrice'>[], totalAmount: number, paymentMethod?: string) => Promise<void>;
}

export function RecordSaleForm({ products, onSubmit }: RecordSaleFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const form = useForm<RecordSaleFormData>({
    resolver: zodResolver(recordSaleSchema),
    defaultValues: {
      items: [{ productId: "", quantity: 1, unitPrice: 0 }],
      paymentMethod: "Dinheiro",
    },
  });

  const { fields, append, remove, update } = useFieldArray({
    control: form.control,
    name: "items",
  });

  const [totalAmount, setTotalAmount] = useState(0);

  useEffect(() => {
    const subscription = form.watch((values, { name, type }) => {
      const currentItems = values.items || [];
      let currentTotal = 0;
      currentItems.forEach((item, index) => {
        const product = products.find(p => p.id === item.productId);
        if (product) {
          // Update unitPrice if productId changes
          if (name === `items.${index}.productId` && item.unitPrice !== product.price) {
             update(index, { ...item, unitPrice: product.price });
          }
          currentTotal += (item.quantity || 0) * (product.price || 0);
        }
      });
      setTotalAmount(currentTotal);
    });
    return () => subscription.unsubscribe();
  }, [form, products, update]);

  const handleFormSubmit = async (data: RecordSaleFormData) => {
    setIsSubmitting(true);
    const saleItems = data.items.map(item => ({
      productId: item.productId,
      quantity: item.quantity,
      unitPrice: products.find(p => p.id === item.productId)?.price || 0,
    }));
    await onSubmit(saleItems, totalAmount, data.paymentMethod);
    form.reset({
        items: [{ productId: "", quantity: 1, unitPrice: 0 }],
        paymentMethod: "Dinheiro",
    });
    setIsSubmitting(false);
  };
  
  const handleProductChange = (productId: string, index: number) => {
    const product = products.find(p => p.id === productId);
    if (product) {
      const currentItem = form.getValues(`items.${index}`);
      form.setValue(`items.${index}`, { ...currentItem, productId, unitPrice: product.price });
    }
  };


  return (
    <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">
      <ScrollArea className="h-[300px] pr-3">
        <div className="space-y-4">
        {fields.map((field, index) => (
          <div key={field.id} className="p-4 border rounded-md space-y-3 bg-muted/50 relative">
            <div className="grid grid-cols-1 gap-3">
              <Controller
                control={form.control}
                name={`items.${index}.productId`}
                render={({ field: selectField }) => (
                  <div>
                    <Label>Produto</Label>
                    <Select
                      onValueChange={(value) => {
                        selectField.onChange(value);
                        handleProductChange(value, index);
                      }}
                      defaultValue={selectField.value}
                      disabled={isSubmitting}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione um produto" />
                      </SelectTrigger>
                      <SelectContent>
                        {products.map((product) => (
                          <SelectItem key={product.id} value={product.id} disabled={product.stock === 0}>
                            {product.name} (Estoque: {product.stock})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {form.formState.errors.items?.[index]?.productId && <p className="text-sm text-destructive mt-1">{form.formState.errors.items[index]?.productId?.message}</p>}
                  </div>
                )}
              />
              <div>
                <Label htmlFor={`items.${index}.quantity`}>Quantidade</Label>
                <Input
                  id={`items.${index}.quantity`}
                  type="number"
                  min="1"
                  {...form.register(`items.${index}.quantity`, { valueAsNumber: true })}
                  disabled={isSubmitting}
                  className="w-full"
                />
                 {form.formState.errors.items?.[index]?.quantity && <p className="text-sm text-destructive mt-1">{form.formState.errors.items[index]?.quantity?.message}</p>}
              </div>
            </div>
            <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => remove(index)}
                disabled={fields.length <= 1 || isSubmitting}
                className="absolute top-2 right-2 text-muted-foreground hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
          </div>
        ))}
        </div>
      </ScrollArea>

      <Button
        type="button"
        variant="outline"
        onClick={() => append({ productId: "", quantity: 1, unitPrice: 0 })}
        disabled={isSubmitting}
        className="w-full"
      >
        <PlusCircle className="mr-2 h-4 w-4" /> Adicionar Item
      </Button>
      
      {form.formState.errors.items && typeof form.formState.errors.items === 'object' && !Array.isArray(form.formState.errors.items) && (
        <p className="text-sm font-medium text-destructive">{form.formState.errors.items.message}</p>
      )}


      <div>
        <Label htmlFor="paymentMethod">Método de Pagamento</Label>
        <Controller
          control={form.control}
          name="paymentMethod"
          render={({ field }) => (
            <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isSubmitting}>
              <SelectTrigger id="paymentMethod">
                <SelectValue placeholder="Selecione o método" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Dinheiro">Dinheiro</SelectItem>
                <SelectItem value="Cartão de Crédito">Cartão de Crédito</SelectItem>
                <SelectItem value="Cartão de Débito">Cartão de Débito</SelectItem>
                <SelectItem value="Pix">Pix</SelectItem>
              </SelectContent>
            </Select>
          )}
        />
      </div>

      <div className="text-xl font-bold text-right">
        Total: R$ {totalAmount.toFixed(2)}
      </div>

      <Button type="submit" className="w-full bg-primary hover:bg-primary/90" disabled={isSubmitting || fields.length === 0 || totalAmount === 0}>
        {isSubmitting ? "Registrando..." : <><ShoppingCart className="mr-2 h-4 w-4" /> Registrar Venda</> }
      </Button>
    </form>
  );
}
