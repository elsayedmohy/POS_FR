import { Injectable, signal } from '@angular/core';
import { Observable, of } from 'rxjs';
import {
    Product, Category, Sale, User, DashboardStats, StoreSettings,
    PaginatedResponse
} from '../models/models';

@Injectable({ providedIn: 'root' })
export class DataService {

    // ─── Mock Data ──────────────────────────────────────────────────
    private categories: Category[] = [
        { id: 1, name: 'Beverages', color: '#3B82F6' },
        { id: 2, name: 'Snacks', color: '#F59E0B' },
        { id: 3, name: 'Electronics', color: '#8B5CF6' },
        { id: 4, name: 'Clothing', color: '#EC4899' },
    ];

    private products: Product[] = [
        { id: 1, name: 'Coca Cola 500ml', sku: 'BEV001', price: 2.5, cost: 1.2, stock: 150, categoryId: 1, categoryName: 'Beverages', barcode: '5000112658579', active: true },
        { id: 2, name: 'Pepsi 500ml', sku: 'BEV002', price: 2.5, cost: 1.1, stock: 120, categoryId: 1, categoryName: 'Beverages', barcode: '0012000001413', active: true },
        { id: 3, name: 'Water 1.5L', sku: 'BEV003', price: 1.0, cost: 0.4, stock: 200, categoryId: 1, categoryName: 'Beverages', active: true },
        { id: 4, name: 'Lays Chips', sku: 'SNK001', price: 3.0, cost: 1.5, stock: 80, categoryId: 2, categoryName: 'Snacks', active: true },
        { id: 5, name: 'Pringles Original', sku: 'SNK002', price: 4.5, cost: 2.5, stock: 60, categoryId: 2, categoryName: 'Snacks', active: true },
        { id: 6, name: 'USB Cable Type-C', sku: 'ELC001', price: 12.0, cost: 5.0, stock: 45, categoryId: 3, categoryName: 'Electronics', active: true },
        { id: 7, name: 'Phone Case', sku: 'ELC002', price: 8.0, cost: 3.0, stock: 35, categoryId: 3, categoryName: 'Electronics', active: true },
        { id: 8, name: 'Cotton T-Shirt', sku: 'CLT001', price: 15.0, cost: 7.0, stock: 90, categoryId: 4, categoryName: 'Clothing', active: true },
        { id: 9, name: 'Baseball Cap', sku: 'CLT002', price: 10.0, cost: 4.5, stock: 55, categoryId: 4, categoryName: 'Clothing', active: true },
        { id: 10, name: 'Orange Juice 1L', sku: 'BEV004', price: 3.5, cost: 1.8, stock: 70, categoryId: 1, categoryName: 'Beverages', active: true },
    ];

    private users: User[] = [
        { id: 1, fullName: 'Ahmed Al-Rashidi', email: 'ahmed@pos.com', phone: '+966501234567', role: 'admin', status: 'active', createdAt: '2024-01-15' },
        { id: 2, fullName: 'Sara Johnson', email: 'sara@pos.com', phone: '+966502345678', role: 'cashier', status: 'active', createdAt: '2024-02-10' },
        { id: 3, fullName: 'Mohammed Ali', email: 'mo@pos.com', phone: '+966503456789', role: 'cashier', status: 'active', createdAt: '2024-03-05' },
        { id: 4, fullName: 'Lina Hassan', email: 'lina@pos.com', phone: '+966504567890', role: 'cashier', status: 'inactive', createdAt: '2024-01-20' },
    ];

    private sales: Sale[] = [
        { id: 1001, saleDate: '2026-03-26T10:30:00', customerName: 'Walk-in Customer', cashierId: 2, cashierName: 'Sara Johnson', items: [{ productId: 1, productName: 'Coca Cola 500ml', quantity: 2, unitPrice: 2.5, totalPrice: 5 }, { productId: 4, productName: 'Lays Chips', quantity: 1, unitPrice: 3.0, totalPrice: 3 }], subtotal: 8, discountType: 'percent', discountValue: 0, discountAmount: 0, taxRate: 15, taxAmount: 1.2, total: 9.2, paymentMethod: 'cash', amountReceived: 10, change: 0.8, status: 'completed' },
        { id: 1002, saleDate: '2026-03-26T11:15:00', customerName: 'Ahmed K.', cashierId: 2, cashierName: 'Sara Johnson', items: [{ productId: 6, productName: 'USB Cable Type-C', quantity: 1, unitPrice: 12, totalPrice: 12 }, { productId: 7, productName: 'Phone Case', quantity: 1, unitPrice: 8, totalPrice: 8 }], subtotal: 20, discountType: 'amount', discountValue: 2, discountAmount: 2, taxRate: 15, taxAmount: 2.7, total: 20.7, paymentMethod: 'card', status: 'completed' },
        { id: 1003, saleDate: '2026-03-25T14:00:00', cashierId: 3, cashierName: 'Mohammed Ali', items: [{ productId: 8, productName: 'Cotton T-Shirt', quantity: 2, unitPrice: 15, totalPrice: 30 }], subtotal: 30, discountType: 'percent', discountValue: 10, discountAmount: 3, taxRate: 15, taxAmount: 4.05, total: 31.05, paymentMethod: 'cash', amountReceived: 35, change: 3.95, status: 'completed' },
        { id: 1004, saleDate: '2026-03-25T09:45:00', cashierId: 2, cashierName: 'Sara Johnson', items: [{ productId: 2, productName: 'Pepsi 500ml', quantity: 3, unitPrice: 2.5, totalPrice: 7.5 }, { productId: 3, productName: 'Water 1.5L', quantity: 2, unitPrice: 1, totalPrice: 2 }], subtotal: 9.5, discountType: 'percent', discountValue: 0, discountAmount: 0, taxRate: 15, taxAmount: 1.43, total: 10.93, paymentMethod: 'cash', amountReceived: 15, change: 4.07, status: 'completed' },
        { id: 1005, saleDate: '2026-03-24T16:20:00', cashierId: 3, cashierName: 'Mohammed Ali', items: [{ productId: 5, productName: 'Pringles Original', quantity: 2, unitPrice: 4.5, totalPrice: 9 }, { productId: 9, productName: 'Baseball Cap', quantity: 1, unitPrice: 10, totalPrice: 10 }], subtotal: 19, discountType: 'percent', discountValue: 5, discountAmount: 0.95, taxRate: 15, taxAmount: 2.71, total: 20.76, paymentMethod: 'card', status: 'completed' },
    ];

    private storeSettings: StoreSettings = {
        storeName: 'Smart POS Store',
        address: '123 Market Street, Riyadh, Saudi Arabia',
        phone: '+966 11 123 4567',
        email: 'info@smartpos.sa',
        currency: 'SAR',
        currencySymbol: '﷼',
        taxRate: 15,
        invoiceFooter: 'Thank you for your business! 🛍️'
    };

    // ─── Dashboard ──────────────────────────────────────────────────
    getDashboardStats(): Observable<DashboardStats> {
        return of({
            totalSales: this.sales.length,
            totalRevenue: this.sales.reduce((s, x) => s + x.total, 0),
            totalProducts: this.products.length,
            totalUsers: this.users.length,
            todayRevenue: 29.9,
            weekRevenue: 92.66,
            monthRevenue: 92.66,
            salesTrend: [
                { label: 'Mon', value: 18.5 }, { label: 'Tue', value: 24.2 },
                { label: 'Wed', value: 31.1 }, { label: 'Thu', value: 20.8 },
                { label: 'Fri', value: 40.3 }, { label: 'Sat', value: 35.7 },
                { label: 'Sun', value: 29.9 },
            ],
            topProducts: [
                { name: 'Cotton T-Shirt', sold: 4, revenue: 60 },
                { name: 'USB Cable Type-C', sold: 3, revenue: 36 },
                { name: 'Coca Cola 500ml', sold: 5, revenue: 12.5 },
                { name: 'Lays Chips', sold: 3, revenue: 9 },
                { name: 'Pringles Original', sold: 2, revenue: 9 },
            ]
        });
    }

    // ─── Products ───────────────────────────────────────────────────
    getProducts(): Observable<Product[]> { return of(this.products); }
    getProduct(id: number): Observable<Product | undefined> {
        return of(this.products.find(p => p.id === id));
    }
    saveProduct(product: Product): Observable<Product> {
        if (product.id) {
            const idx = this.products.findIndex(p => p.id === product.id);
            if (idx > -1) this.products[idx] = product;
        } else {
            product.id = Date.now();
            this.products.push(product);
        }
        return of(product);
    }
    deleteProduct(id: number): Observable<void> {
        this.products = this.products.filter(p => p.id !== id);
        return of(void 0);
    }

    // ─── Categories ─────────────────────────────────────────────────
    getCategories(): Observable<Category[]> { return of(this.categories); }
    saveCategory(cat: Category): Observable<Category> {
        if (cat.id) {
            const idx = this.categories.findIndex(c => c.id === cat.id);
            if (idx > -1) this.categories[idx] = cat;
        } else {
            cat.id = Date.now();
            this.categories.push(cat);
        }
        return of(cat);
    }
    deleteCategory(id: number): Observable<void> {
        this.categories = this.categories.filter(c => c.id !== id);
        return of(void 0);
    }

    // ─── Sales ──────────────────────────────────────────────────────
    getSales(): Observable<Sale[]> { return of(this.sales); }
    getSale(id: number): Observable<Sale | undefined> {
        return of(this.sales.find(s => s.id === id));
    }
    saveSale(sale: Sale): Observable<Sale> {
        sale.id = 1000 + this.sales.length + 1;
        sale.saleDate = new Date().toISOString();
        this.sales.unshift(sale);
        return of(sale);
    }

    // ─── Users ──────────────────────────────────────────────────────
    getUsers(): Observable<User[]> { return of(this.users); }
    getUser(id: number): Observable<User | undefined> {
        return of(this.users.find(u => u.id === id));
    }
    saveUser(user: User): Observable<User> {
        if (user.id) {
            const idx = this.users.findIndex(u => u.id === user.id);
            if (idx > -1) this.users[idx] = user;
        } else {
            user.id = Date.now();
            user.createdAt = new Date().toISOString().split('T')[0];
            this.users.push(user);
        }
        return of(user);
    }
    deleteUser(id: number): Observable<void> {
        this.users = this.users.filter(u => u.id !== id);
        return of(void 0);
    }

    // ─── Settings ───────────────────────────────────────────────────
    getStoreSettings(): Observable<StoreSettings> { return of(this.storeSettings); }
    saveStoreSettings(s: StoreSettings): Observable<StoreSettings> {
        this.storeSettings = { ...s };
        return of(this.storeSettings);
    }
}
