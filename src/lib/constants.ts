import type { NavItem, Product, Sale, HistoricalSaleData } from "./types";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Archive,
  BarChart2,
  Brain,
  Users,
  Settings,
  LogOut,
} from "lucide-react";

export const APP_NAME = "Sabor & Prosa Manager";

export const NAV_ITEMS_MAIN: NavItem[] = [
  { title: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { title: "Produtos", href: "/products", icon: Package },
  { title: "Vendas", href: "/sales", icon: ShoppingCart },
  { title: "Estoque", href: "/stock", icon: Archive },
  { title: "Relatórios", href: "/reports", icon: BarChart2 },
  { title: "Previsão IA", href: "/forecast", icon: Brain },
];

export const NAV_ITEMS_USER: NavItem[] = [
  // { title: "Gerenciar Usuários", href: "/users", icon: Users, disabled: true }, // Example for future
  // { title: "Configurações", href: "/settings", icon: Settings, disabled: true },
  { title: "Sair", href: "/login", icon: LogOut }, // Simple logout, redirects to login
];


export const MOCK_PRODUCTS: Product[] = [
  { id: "1", name: "Coxinha de Frango", category: "Salgados", price: 5.00, stock: 50, lowStockThreshold: 10 },
  { id: "2", name: "Hambúrguer Artesanal Clássico", category: "Hambúrgueres", price: 18.00, stock: 30, lowStockThreshold: 5 },
  { id: "3", name: "Suco de Laranja Natural", category: "Sucos", price: 7.00, stock: 20, lowStockThreshold: 5 },
  { id: "4", name: "Empada de Palmito", category: "Salgados", price: 6.00, stock: 40, lowStockThreshold: 10 },
  { id: "5", name: "X-Bacon Artesanal", category: "Hambúrgueres", price: 22.00, stock: 25, lowStockThreshold: 5 },
  { id: "6", name: "Suco de Abacaxi com Hortelã", category: "Sucos", price: 8.00, stock: 15, lowStockThreshold: 5 },
  { id: "7", name: "Kibe", category: "Salgados", price: 5.50, stock: 60, lowStockThreshold: 15 },
];

export const MOCK_SALES: Sale[] = [
  { 
    id: "sale1", 
    items: [
      { productId: "1", productName: "Coxinha de Frango", quantity: 2, unitPrice: 5.00, totalPrice: 10.00 },
      { productId: "3", productName: "Suco de Laranja Natural", quantity: 1, unitPrice: 7.00, totalPrice: 7.00 }
    ], 
    totalAmount: 17.00, 
    saleDate: new Date(Date.now() - 86400000).toISOString(), // Yesterday
    paymentMethod: "card" 
  },
  { 
    id: "sale2", 
    items: [
      { productId: "2", productName: "Hambúrguer Artesanal Clássico", quantity: 1, unitPrice: 18.00, totalPrice: 18.00 }
    ], 
    totalAmount: 18.00, 
    saleDate: new Date(Date.now() - 2*86400000).toISOString(), // Day before yesterday
    paymentMethod: "cash"
  },
];

export const MOCK_HISTORICAL_SALES_DATA: HistoricalSaleData[] = [
  { date: "2024-07-01", totalSales: 350.50 },
  { date: "2024-07-02", totalSales: 420.00 },
  { date: "2024-07-03", totalSales: 380.75 },
  { date: "2024-07-04", totalSales: 450.20 },
  { date: "2024-07-05", totalSales: 510.00 },
  { date: "2024-07-06", totalSales: 480.90 },
  { date: "2024-07-07", totalSales: 390.60 },
  { date: "2024-07-08", totalSales: 410.00 },
  { date: "2024-07-09", totalSales: 430.50 },
  { date: "2024-07-10", totalSales: 470.80 },
];
