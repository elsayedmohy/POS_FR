import { Product } from '../../modules/products/models/product';

export interface User {
    id: number;
    name: string;
    storeName?: string;
    email: string;
    phone?: string;
    role: 'ADMIN' | 'CASHIER';
    status: 'active' | 'inactive';
    createdAt?: string;
}

export interface AuthResponse {
    token: string;
    refreshToken: string;
    user: User;
}

export interface LoginRequest {
    email: string;
    password: string;
}





export interface CartItem {
    product: Product;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
}

export interface Sale {
    id: number;
    saleDate: string;
    customerName?: string;
    cashierId: number;
    cashierName?: string;
    items: SaleItem[];
    subtotal: number;
    discountType: 'percent' | 'amount';
    discountValue: number;
    discountAmount: number;
    taxRate: number;
    taxAmount: number;
    total: number;
    paymentMethod: 'cash' | 'card';
    amountReceived?: number;
    change?: number;
    status: 'completed' | 'refunded';
}

export interface SaleItem {
    productId: number;
    productName: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
}

export interface StoreSettings {
    storeName: string;
    logo?: string;
    address?: string;
    phone?: string;
    email?: string;
    currency: string;
    currencySymbol: string;
    taxRate: number;
    invoiceFooter?: string;
}

export interface DashboardStats {
  totalSales: number;
  totalOrders: number;
  totalUsers: number;
  totalProducts: number;
  totalRevenue: number;
  todayRevenue: number;
  weekRevenue: number;
  monthRevenue: number;
  salesTrend: { label: string; value: number }[];
  topProducts: {productId :number,  productName: string; totalQuantity: number }[];
}

export interface ApiResponse<T> {
    data: T;
    message?: string;
    success: boolean;
}

export interface PaginatedResponse<T> {
    data: T[];
    total: number;
    page: number;
    limit: number;
}
