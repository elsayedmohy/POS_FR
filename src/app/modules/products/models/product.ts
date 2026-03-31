import { Category } from './category';

export interface ProductForm {
  id: number;
  name: string;
  price: number;
  stock: number;
  category: Category;
  barcode: string;
}
export interface Product {
  id: number;
  name: string;
  price: number;
  stock: number;
  categoryId: number;
  categoryName?: string;
  barcode?: string;
  active: boolean;
  description: string;
}

export interface ProductRequest {
  id?: number;
  name: string;
  price: number;
  stock: number;
  categoryId: number;
  barcode: string;
  active: boolean;
  description: string;
}
