export interface Sale {
  id: number;
  customerName: string;
  createdBy: string;
  items: SaleItemResponse[];
  discountType: 'PERCENT' | 'FIXED';
  discountValue: number;
  totalAmount: number;
  paymentMethod: 'CASH' | 'CARD';
  createdAt: Date;
}

export interface SaleRequest {
  customerName?: string;
  items: SaleItemRequest[];
  discountType: 'PERCENT' | 'FIXED';
  discountValue: number;
  paymentMethod: 'CASH' | 'CARD';
}

export interface SaleItemRequest {
  productId: number;
  quantity: number;
}

export interface SaleItemResponse {
  id: number;
  quantity: number;
  price: number;
}
