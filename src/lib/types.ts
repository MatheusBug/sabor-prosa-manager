export interface NavItem {
  title: string;
  href: string;
  icon: React.ElementType;
  disabled?: boolean;
}

export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  description?: string;
  imageUrl?: string; // Optional: if products have images
  lowStockThreshold?: number; // Optional: for low stock alerts
}

export interface SaleItem {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface Sale {
  id: string;
  items: SaleItem[];
  totalAmount: number;
  saleDate: string; // ISO string or Date object
  paymentMethod?: string; // e.g., 'cash', 'card'
  employeeId?: string; // Who made the sale
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'employee'; 
}

export type HistoricalSaleData = {
  date: string; // YYYY-MM-DD
  totalSales: number;
};

export type SalesForecastData = {
  date: string; // YYYY-MM-DD
  predictedSales: number;
};

export type SalesReportData = {
  period: string;
  totalSales: number;
  numberOfTransactions: number;
  averageTransactionValue: number;
  topSellingProducts: { name: string; quantitySold: number }[];
};

export type StockReportData = {
  productName: string;
  currentStock: number;
  status: 'In Stock' | 'Low Stock' | 'Out of Stock';
};
