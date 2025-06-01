"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import type { Product } from "@/lib/types";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const productSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(3, "Nome do produto deve ter pelo menos 3 caracteres."),
  category: z.string().min(1, "Categoria é obrigatória."),
  price: z.coerce.number().min(0.01, "Preço deve ser positivo."),
  stock: z.coerce.number().int().min(0, "Estoque não pode ser negativo."),
  description: z.string().optional(),
  lowStockThreshold: z.coerce.number().int().min(0, "Limite de estoque baixo não pode ser negativo.").optional(),
});

type ProductFormData = z.infer<typeof productSchema>;

interface ProductFormProps {
  onSubmit: (data: Product) => Promise<void>;
  initialData?: Product | null;
  onCancel: () => void;
}

const productCategories = ["Salgados", "Hambúrgueres", "Sucos", "Sobremesas", "Bebidas", "Outros"];

export function ProductForm({ onSubmit, initialData, onCancel }: ProductFormProps) {
  const form = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: initialData || {
      name: "",
      category: "",
      price: 0,
      stock: 0,
      description: "",
      lowStockThreshold: 5,
    },
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  
  async function handleSubmit(values: ProductFormData) {
    setIsSubmitting(true);
    const productData: Product = {
      id: initialData?.id || Date.now().toString(), // Generate ID if new
      ...values,
      price: Number(values.price),
      stock: Number(values.stock),
      lowStockThreshold: values.lowStockThreshold ? Number(values.lowStockThreshold) : 5,
    };
    await onSubmit(productData);
    setIsSubmitting(false);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome do Produto</FormLabel>
              <FormControl>
                <Input placeholder="Ex: Coxinha de Frango" {...field} disabled={isSubmitting}/>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Categoria</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isSubmitting}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione uma categoria" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {productCategories.map(cat => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Preço (R$)</FormLabel>
                <FormControl>
                  <Input type="number" step="0.01" placeholder="0.00" {...field} disabled={isSubmitting}/>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="stock"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Estoque Inicial</FormLabel>
                <FormControl>
                  <Input type="number" step="1" placeholder="0" {...field} disabled={isSubmitting}/>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
         <FormField
            control={form.control}
            name="lowStockThreshold"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Alerta de Estoque Baixo (unidades)</FormLabel>
                <FormControl>
                  <Input type="number" step="1" placeholder="5" {...field} disabled={isSubmitting}/>
                </FormControl>
                <FormDescription>Receber alerta quando o estoque atingir este nível.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descrição (Opcional)</FormLabel>
              <FormControl>
                <Textarea placeholder="Detalhes sobre o produto..." {...field} disabled={isSubmitting}/>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end gap-2 pt-4">
          <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
            Cancelar
          </Button>
          <Button type="submit" className="bg-primary hover:bg-primary/90" disabled={isSubmitting}>
            {isSubmitting ? "Salvando..." : (initialData ? "Salvar Alterações" : "Adicionar Produto")}
          </Button>
        </div>
      </form>
    </Form>
  );
}

// Hack to make useState available in this context as it's a component
import { useState } from 'react';
