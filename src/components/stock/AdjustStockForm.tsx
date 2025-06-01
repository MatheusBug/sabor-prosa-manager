"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import type { Product } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";

const adjustStockSchema = z.object({
  newStockLevel: z.coerce.number().int().min(0, "Estoque não pode ser negativo."),
  reason: z.string().min(5, "Motivo deve ter pelo menos 5 caracteres.").optional(),
});

type AdjustStockFormData = z.infer<typeof adjustStockSchema>;

interface AdjustStockFormProps {
  product: Product;
  onSubmit: (productId: string, newStockLevel: number, reason: string) => Promise<void>;
  onCancel: () => void;
}

export function AdjustStockForm({ product, onSubmit, onCancel }: AdjustStockFormProps) {
  const form = useForm<AdjustStockFormData>({
    resolver: zodResolver(adjustStockSchema),
    defaultValues: {
      newStockLevel: product.stock,
      reason: "",
    },
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(values: AdjustStockFormData) {
    setIsSubmitting(true);
    await onSubmit(product.id, values.newStockLevel, values.reason || "Ajuste manual");
    setIsSubmitting(false);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="newStockLevel"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Novo Nível de Estoque</FormLabel>
              <FormControl>
                <Input type="number" {...field} disabled={isSubmitting}/>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="reason"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Motivo do Ajuste (Opcional)</FormLabel>
              <FormControl>
                <Textarea placeholder="Ex: Recebimento de mercadoria, Perda, etc." {...field} disabled={isSubmitting}/>
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
            {isSubmitting ? "Salvando..." : "Salvar Ajuste"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
