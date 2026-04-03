import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { BadgeModule } from 'primeng/badge';
import { DialogModule } from 'primeng/dialog';
import { TagModule } from 'primeng/tag';
import { RadioButtonModule } from 'primeng/radiobutton';
import { Router } from '@angular/router';
import { DataService } from '../../../core/services/data.service';
import { CartItem, Sale, SaleItem } from '../../../core/models/models';
import { AuthService } from '../../../core/services/auth.service';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { Product } from '../../products/models/product';
import { ProductService } from '../../products/services/product.service';
import { CategoryService } from '../../products/services/category.service';
import { UserRole } from '../../../core/models/enums';
import { SalesService } from '../services/sales.service';
import { SaleRequest } from '../models/sales-model';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-pos-screen',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    FormsModule,
    ButtonModule,
    InputTextModule,
    InputNumberModule,
    BadgeModule,
    DialogModule,
    TagModule,
    RadioButtonModule,
    IconFieldModule,
    InputIconModule,
  ],
  styleUrls: ['./pos-screen.component.scss'],
  templateUrl : './pos-screen.component.html',
})
export class PosScreenComponent implements OnInit {
  sales = inject(SalesService);
  products = inject(ProductService);
  categories = inject(CategoryService);
  auth = inject(AuthService);
  isAdmin = signal(this.auth.isAdmin());
  cart: CartItem[] = [];
  discountValue = 0;
  customerName = '';
  taxRate = 15;
  successDialog = false;
  lastSaleId = 0;

  subtotal = 0;
  discountAmount = 0;
  taxAmount = 0;
  grandTotal = 0;

  get totalItems() {
    return this.cart.reduce((s, i) => s + i.quantity, 0);
  }

  constructor(
    private data: DataService,
    private msg: ToastService,
    private router: Router,
  ) {
    this.categories.load();
    this.products.load();
  }

  ngOnInit() {
    this.data.getStoreSettings().subscribe((s) => (this.taxRate = s.taxRate));
  }

  addToCart(product: Product) {
    if (this.isAdmin()) {
      return;
    }
    const existing = this.cart.find((i) => i.product.id === product.id);
    if (existing) {
      existing.quantity++;
      existing.totalPrice = existing.quantity * existing.unitPrice;
    } else
      this.cart.push({ product, quantity: 1, unitPrice: product.price, totalPrice: product.price });
    this.calcTotals();
  }

  increaseQty(item: CartItem) {
    item.quantity++;
    item.totalPrice = item.quantity * item.unitPrice;
    this.calcTotals();
  }
  decreaseQty(item: CartItem) {
    if (item.quantity === 1) this.removeFromCart(item);
    else {
      item.quantity--;
      item.totalPrice = item.quantity * item.unitPrice;
      this.calcTotals();
    }
  }
  removeFromCart(item: CartItem) {
    this.cart = this.cart.filter((i) => i !== item);
    this.calcTotals();
  }
  clearCart() {
    this.cart = [];
    this.calcTotals();
  }

  calcTotals() {
    this.subtotal = this.cart.reduce((s, i) => s + i.totalPrice, 0);
    this.discountAmount = this.subtotal * (this.discountValue / 100);
    const afterDiscount = this.subtotal - this.discountAmount;
    this.taxAmount = afterDiscount * (this.taxRate / 100);
    this.grandTotal = afterDiscount + this.taxAmount;
  }

  checkout() {
    if (!this.cart.length) return;
    const user = this.auth.currentUser();
    const sale : SaleRequest = {
      customerName: this.customerName,
      items: this.cart.map((i) => ({
        productId: i.product.id,
        quantity: i.quantity,
      })),
      discountType: 'PERCENT',
      discountValue: this.discountAmount,
      paymentMethod: 'CASH',
    };
    console.log(sale);
    this.sales.create(sale).subscribe( {
      next: (res) => {
          this.lastSaleId = res.id;
          this.successDialog = true;
      },
        error: (err) => {this.msg.error("Error", "Sale not saved " + err.message);},
    });
  }

  newSale() {
    this.successDialog = false;
    this.clearCart();
    this.customerName = '';
    this.discountValue = 0;
  }
  goToSales() {
    this.router.navigate(['/sales']);
  }
}
