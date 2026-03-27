import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TagModule } from 'primeng/tag';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { FormBuilder, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { DataService } from '../../../core/services/data.service';
import { Product, Category } from '../../../core/models/models';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';

@Component({
  selector: 'app-products-list',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    TableModule,
    ButtonModule,
    InputTextModule,
    TagModule,
    RouterLink,
    ReactiveFormsModule,
    IconFieldModule,
    InputIconModule,
    ConfirmDialogModule,
    FormsModule,
  ],
  template: `
    <div class="page-header">
      <h1>{{ 'PRODUCTS.TITLE' | translate }}</h1>
      <div class="header-actions">
        <p-button
          icon="pi pi-download"
          [label]="'PRODUCTS.EXPORT' | translate"
          severity="secondary"
          [outlined]="true"
          size="small"
          (onClick)="exportCSV()"
        />
        <p-button
          icon="pi pi-plus"
          [label]="'PRODUCTS.ADD_PRODUCT' | translate"
          [routerLink]="['/products/new']"
          size="small"
        />
      </div>
    </div>

    <div class="card">
      <div
        style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1.25rem; flex-wrap:wrap; gap:0.75rem;"
      >
        <p-iconfield>
          <p-inputicon class="pi pi-search" />
          <input
            pInputText
            [(ngModel)]="searchQuery"
            [placeholder]="'COMMON.SEARCH' | translate"
            (input)="filterProducts()"
          />
        </p-iconfield>
        <div style="display:flex; gap:0.5rem; flex-wrap:wrap;">
          <p-button
            *ngFor="let cat of categories"
            [label]="cat"
            [outlined]="selectedCategory !== cat"
            (onClick)="selectedCategory = cat; filterProducts()"
            size="small"
            severity="secondary"
          />
        </div>
      </div>

      <p-table
        [value]="filteredProducts"
        [paginator]="true"
        [rows]="10"
        [rowsPerPageOptions]="[5, 10, 25]"
        [globalFilterFields]="['name', 'sku', 'categoryName']"
      >
        <ng-template pTemplate="header">
          <tr>
            <th pSortableColumn="name">
              {{ 'PRODUCTS.PRODUCT_NAME' | translate }} <p-sortIcon field="name" />
            </th>
            <th>{{ 'PRODUCTS.SKU' | translate }}</th>
            <th>{{ 'PRODUCTS.CATEGORY' | translate }}</th>
            <th pSortableColumn="price">
              {{ 'PRODUCTS.PRICE' | translate }} <p-sortIcon field="price" />
            </th>
            <th pSortableColumn="stock">
              {{ 'PRODUCTS.STOCK' | translate }} <p-sortIcon field="stock" />
            </th>
            <th>{{ 'PRODUCTS.ACTIVE' | translate }}</th>
            <th>{{ 'COMMON.ACTIONS' | translate }}</th>
          </tr>
        </ng-template>
        <ng-template pTemplate="body" let-product>
          <tr>
            <td>
              <div style="display:flex; align-items:center; gap:0.75rem;">
<!--                <div-->
<!--                  style="width:36px;height:36px;border-radius:8px;background:var(&#45;&#45;primary-50);display:flex;align-items:center;justify-content:center;font-size:1.2rem;"-->
<!--                >-->
<!--                  📦-->
<!--                </div>-->
                <span style="font-weight:500;">{{ product.name }}</span>
              </div>
            </td>
            <td>
              <code
                style="background:var(--surface-100);padding:2px 6px;border-radius:4px;font-size:0.8rem;"
                >{{ product.sku }}</code
              >
            </td>
            <td>{{ product.categoryName }}</td>
            <td style="font-weight:600; color:var(--primary-600);">
              {{ product.price | currency: 'SAR' }}
            </td>
            <td>
              <p-tag
                [value]="product.stock + ' units'"
                [severity]="product.stock > 50 ? 'success' : product.stock > 10 ? 'warn' : 'danger'"
              />
            </td>
            <td>
              <p-tag
                [value]="product.active ? 'Active' : 'Inactive'"
                [severity]="product.active ? 'success' : 'secondary'"
              />
            </td>
            <td>
              <div style="display:flex; gap:0.5rem;">
                <p-button
                  icon="pi pi-pencil"
                  [text]="true"
                  [rounded]="true"
                  size="small"
                  [routerLink]="['/products/edit', product.id]"
                />
                <p-button
                  icon="pi pi-trash"
                  [text]="true"
                  [rounded]="true"
                  size="small"
                  severity="danger"
                  (onClick)="deleteProduct(product)"
                />
              </div>
            </td>
          </tr>
        </ng-template>
        <ng-template pTemplate="emptymessage">
          <tr>
            <td
              colspan="7"
              style="text-align:center;padding:2rem;color:var(--text-color-secondary);"
            >
              {{ 'COMMON.NO_DATA' | translate }}
            </td>
          </tr>
        </ng-template>
      </p-table>
    </div>
  `,
})
export class ProductsListComponent implements OnInit {
  products: Product[] = [];
  filteredProducts: Product[] = [];
  categories: string[] = ['All'];
  selectedCategory = 'All';
  searchQuery = '';

  constructor(
    private data: DataService,
    private confirm: ConfirmationService,
    private msg: MessageService,
  ) {}

  ngOnInit() {
    this.data.getProducts().subscribe((p) => {
      this.products = p;
      this.categories = ['All', ...new Set(p.map((x) => x.categoryName || '').filter(Boolean))];
      this.filteredProducts = p;
    });
  }

  filterProducts() {
    this.filteredProducts = this.products.filter((p) => {
      const matchesCat =
        this.selectedCategory === 'All' || p.categoryName === this.selectedCategory;
      const matchesSearch =
        !this.searchQuery ||
        p.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        p.sku.toLowerCase().includes(this.searchQuery.toLowerCase());
      return matchesCat && matchesSearch;
    });
  }

  deleteProduct(product: Product) {
    this.confirm.confirm({
      message: `Delete "${product.name}"?`,
      accept: () => {
        this.data.deleteProduct(product.id).subscribe(() => {
          this.products = this.products.filter((p) => p.id !== product.id);
          this.filterProducts();
          this.msg.add({ severity: 'success', summary: 'Deleted', detail: 'Product deleted' });
        });
      },
    });
  }

  exportCSV() {
    const csv = [
      'Name,SKU,Price,Stock,Category',
      ...this.filteredProducts.map(
        (p) => `${p.name},${p.sku},${p.price},${p.stock},${p.categoryName}`,
      ),
    ].join('\n');
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }));
    a.download = 'products.csv';
    a.click();
  }
}
