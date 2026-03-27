export interface User {
    id: number;
    fullName: string;
    email: string;
    phone?: string;
    role: 'admin' | 'cashier';
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

export interface Product {
    id: number;
    name: string;
    sku: string;
    price: number;
    cost: number;
    stock: number;
    categoryId: number;
    categoryName?: string;
    barcode?: string;
    description?: string;
    image?: string;
    active: boolean;
}

export interface Category {
    id: number;
    name: string;
    color: string;
    productCount?: number;
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
    totalRevenue: number;
    totalProducts: number;
    totalUsers: number;
    todayRevenue: number;
    weekRevenue: number;
    monthRevenue: number;
    salesTrend: { label: string; value: number }[];
    topProducts: { name: string; sold: number; revenue: number }[];
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
