import { Component, inject, OnInit } from '@angular/core';
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
  styles: [
    `
      .pos-wrapper {
        display: grid;
        grid-template-columns: 1fr 380px;
        gap: 1.5rem;
        height: calc(100vh - 130px);
      }
      :host-context(body.rtl) .pos-wrapper {
        grid-template-columns: 380px 1fr;
      }
      @media (max-width: 1024px) {
        .pos-wrapper {
          grid-template-columns: 1fr;
          height: auto;
        }
      }
      .products-panel {
        overflow-y: auto;
      }
      .cat-filters {
        display: flex;
        gap: 0.5rem;
        flex-wrap: wrap;
        margin-bottom: 1rem;
      }
      .cat-btn {
        padding: 6px 14px;
        border-radius: 20px;
        border: none;
        cursor: pointer;
        font-size: 0.85rem;
        font-weight: 600;
        transition: all 0.2s;
        background: var(--surface-200);
        color: var(--text-color);
      }
      .cat-btn.active {
        background: var(--primary-500);
        color: white;
      }
      .cart-panel {
        background: var(--surface-card);
        border-radius: 16px;
        border: 1px solid var(--surface-border);
        display: flex;
        flex-direction: column;
        overflow: hidden;
      }
      .cart-header {
        padding: 1rem 1.25rem;
        border-bottom: 1px solid var(--surface-border);
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
      .cart-items {
        flex: 1;
        overflow-y: auto;
        padding: 0.75rem;
      }
      .cart-item {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        padding: 0.75rem;
        border-radius: 10px;
        margin-bottom: 0.5rem;
        background: var(--surface-50);
      }
      .item-info {
        flex: 1;
      }
      .item-name {
        font-weight: 500;
        font-size: 0.88rem;
      }
      .item-price {
        font-size: 0.78rem;
        color: var(--text-color-secondary);
      }
      .item-total {
        font-weight: 700;
        color: var(--primary-600);
        min-width: 55px;
        text-align: end;
      }
      .qty-control {
        display: flex;
        align-items: center;
        gap: 0.25rem;
      }
      .qty-btn {
        width: 24px;
        height: 24px;
        border-radius: 6px;
        border: 1px solid var(--surface-300);
        background: var(--surface-card);
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: 700;
        transition: all 0.2s;
      }
      .qty-btn:hover {
        background: var(--primary-50);
        border-color: var(--primary-300);
      }
      .qty-val {
        min-width: 24px;
        text-align: center;
        font-weight: 600;
        font-size: 0.9rem;
      }
      .cart-footer {
        padding: 1rem 1.25rem;
        border-top: 1px solid var(--surface-border);
      }
      .total-row {
        display: flex;
        justify-content: space-between;
        padding: 4px 0;
        font-size: 0.88rem;
      }
      .grand-total {
        font-size: 1.25rem;
        font-weight: 800;
        border-top: 2px solid var(--primary-200);
        padding-top: 0.75rem;
        margin-top: 0.5rem;
        color: var(--primary-600);
      }
      .empty-cart {
        flex: 1;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        color: var(--text-color-secondary);
        padding: 2rem;
        text-align: center;
      }
    `,
  ],
  template: `
    <div class="page-header">
      <h1>{{ 'POS.TITLE' | translate }}</h1>
    </div>

    <div class="pos-wrapper">
      <!-- Products Panel -->
      <div class="products-panel">
        <div style="margin-bottom:1rem;">
          <p-iconfield>
            <p-inputicon class="pi pi-search" />
            <input
              pInputText
              [(ngModel)]="products.searchQuery"
              [placeholder]="'POS.SEARCH_PRODUCTS' | translate"
              class="w-full"
            />
          </p-iconfield>
        </div>
        <div class="cat-filters">
          @for (cat of categories.filteredCategories(); track $index) {
            <p-button
              size="small"
              (click)="categories.updateSelected(cat)"
              [outlined]="products.selectedCategory() !== cat"
              (onClick)="categories.updateSelected(cat)"
            >
              {{ cat.name }}
            </p-button>
          }
        </div>
        <div class="product-grid">
          @for (product of products.filteredActiveProducts(); track $index) {
            <div class="product-card" (click)="addToCart(product)">
              <div class="product-image">📦</div>
              <div class="product-name">{{ product.name }}</div>
              <div class="product-price">{{ product.price | currency }}</div>
              <div class="product-stock">{{ product.stock }} in stock</div>
            </div>
          }
          @if (products.activeProducts().length === 0) {
            <div
              style="grid-column: 1/-1; text-align:center; padding:2rem; color:var(--text-color-secondary);"
            >
              {{ 'COMMON.NO_DATA' | translate }}
            </div>
          }
        </div>
      </div>

      <!-- Cart Panel -->
      <div class="cart-panel">
        <div class="cart-header">
          <h3 style="font-weight:700; display:flex; align-items:center; gap:0.5rem;">
            🛒 {{ 'POS.CART' | translate }}
            <span
              *ngIf="cart.length"
              style="background:var(--primary-500);color:white;border-radius:50%;width:20px;height:20px;font-size:0.75rem;display:flex;align-items:center;justify-content:center;"
              >{{ totalItems }}</span
            >
          </h3>
          <p-button
            *ngIf="cart.length"
            icon="pi pi-trash"
            severity="danger"
            [text]="true"
            size="small"
            (onClick)="clearCart()"
          />
        </div>

        <div *ngIf="!cart.length" class="empty-cart">
          <div style="font-size:3rem; margin-bottom:1rem;">🛒</div>
          <p>{{ 'POS.EMPTY_CART' | translate }}</p>
          <small>Tap a product to add it</small>
        </div>

        <div *ngIf="cart.length" class="cart-items">
          <div *ngFor="let item of cart" class="cart-item">
            <div class="item-info">
              <div class="item-name">{{ item.product.name }}</div>
              <div class="item-price">{{ item.unitPrice | currency: 'SAR' }} each</div>
            </div>
            <div class="qty-control">
              <button class="qty-btn" (click)="decreaseQty(item)">−</button>
              <span class="qty-val">{{ item.quantity }}</span>
              <button class="qty-btn" (click)="increaseQty(item)">+</button>
            </div>
            <div class="item-total">{{ item.totalPrice | currency: 'SAR' }}</div>
            <p-button
              icon="pi pi-times"
              [text]="true"
              severity="danger"
              size="small"
              (onClick)="removeFromCart(item)"
            />
          </div>
        </div>

        <div *ngIf="cart.length" class="cart-footer">
          <div class="total-row">
            <span>{{ 'SALES.SUBTOTAL' | translate }}</span>
            <span>{{ subtotal | currency: 'SAR' }}</span>
          </div>
          <div class="total-row">
            <div style="display:flex; align-items:center; gap:0.5rem;">
              <span>{{ 'SALES.DISCOUNT' | translate }}</span>
              <input
                pInputText
                [(ngModel)]="discountValue"
                type="number"
                min="0"
                max="100"
                style="width:60px; height:28px; font-size:0.8rem; padding:0 6px;"
                (input)="calcTotals()"
              />
              <span>%</span>
            </div>
            <span style="color: var(--red-500);">-{{ discountAmount | currency: 'SAR' }}</span>
          </div>
          <div class="total-row">
            <span>{{ 'SALES.TAX' | translate }} ({{ taxRate }}%)</span>
            <span>{{ taxAmount | currency: 'SAR' }}</span>
          </div>
          <div class="total-row grand-total">
            <span>{{ 'SALES.TOTAL' | translate }}</span>
            <span>{{ grandTotal | currency: 'SAR' }}</span>
          </div>

          <div style="margin:0.75rem 0;">
            <label
              style="display:block; font-size:0.85rem; font-weight:500; margin-bottom:0.4rem;"
              >{{ 'POS.CUSTOMER_NAME' | translate }}</label
            >
            <input pInputText [(ngModel)]="customerName" class="w-full" style="font-size:0.9rem;" />
          </div>

          <p-button
            [label]="'POS.CHECKOUT' | translate"
            icon="pi pi-check"
            styleClass="w-full"
            size="large"
            (onClick)="checkout()"
          />
        </div>
      </div>
    </div>

    <!-- Checkout Success Dialog -->
    <p-dialog
      [(visible)]="successDialog"
      [modal]="true"
      header="Sale Complete!"
      [style]="{ width: '400px' }"
      [closable]="false"
    >
      <div style="text-align:center; padding:1rem 0;">
        <h3 style="margin-bottom:0.5rem;">{{ 'COMMON.SUCCESS' | translate }}</h3>
        <p style="color:var(--text-color-secondary); margin-bottom:1.5rem;">
          Sale #{{ lastSaleId }} completed successfully
        </p>
        <div
          style="background:var(--surface-50); border-radius:12px; padding:1rem; text-align:left;"
        >
          <div
            style="display:flex; justify-content:space-between; font-size:1.1rem; font-weight:700; color:var(--primary-600);"
          >
            <span>Total Paid:</span><span>{{ grandTotal | currency: 'SAR' }}</span>
          </div>
        </div>
      </div>
      <ng-template pTemplate="footer">
        <p-button label="New Sale" icon="pi pi-plus" (onClick)="newSale()" />
        <p-button label="View Sales" icon="pi pi-list" [outlined]="true" (onClick)="goToSales()" />
      </ng-template>
    </p-dialog>
  `,
})
export class PosScreenComponent implements OnInit {
  products = inject(ProductService);
  categories = inject(CategoryService);
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
    private auth: AuthService,
    private router: Router,
  ) {
    this.categories.load();
    this.products.load();
  }

  ngOnInit() {
    this.data.getStoreSettings().subscribe((s) => (this.taxRate = s.taxRate));
  }

  addToCart(product: Product) {
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
    const sale: Sale = {
      id: 0,
      saleDate: new Date().toISOString(),
      customerName: this.customerName,
      cashierId: user?.id || 1,
      cashierName: user?.name,
      items: this.cart.map(
        (i) =>
          ({
            productId: i.product.id,
            productName: i.product.name,
            quantity: i.quantity,
            unitPrice: i.unitPrice,
            totalPrice: i.totalPrice,
          }) as SaleItem,
      ),
      subtotal: this.subtotal,
      discountType: 'percent',
      discountValue: this.discountValue,
      discountAmount: this.discountAmount,
      taxRate: this.taxRate,
      taxAmount: this.taxAmount,
      total: this.grandTotal,
      paymentMethod: 'cash',
      status: 'completed',
    };
    console.log(sale);
    // this.data.saveSale(sale).subscribe((s) => {
    //   this.lastSaleId = s.id;
    //   this.successDialog = true;
    // });
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
