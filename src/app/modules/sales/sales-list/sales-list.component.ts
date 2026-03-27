import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { DatePickerModule } from 'primeng/datepicker';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { DataService } from '../../../core/services/data.service';
import { Sale } from '../../../core/models/models';
import { InputTextModule } from 'primeng/inputtext';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';

@Component({
  selector: 'app-sales-list',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    TableModule,
    ButtonModule,
    TagModule,
    DatePickerModule,
    FormsModule,
    RouterLink,
    InputTextModule,
    IconFieldModule,
    InputIconModule,
  ],
  styles: [
    `
      .filter-bar {
        display: flex;
        gap: 0.75rem;
        flex-wrap: wrap;
        margin-bottom: 1.25rem;
        align-items: center;
      }
    `,
  ],
  template: `
    <div class="page-header">
      <h1>{{ 'SALES.TITLE' | translate }}</h1>
      <p-button icon="pi pi-shopping-cart" label="New Sale" [routerLink]="['/pos']" size="small" />
    </div>

    <div class="card">
      <div class="filter-bar">
        <p-iconfield>
          <p-inputicon class="pi pi-search" />
          <input
            pInputText
            [(ngModel)]="searchQuery"
            placeholder="Search by customer or cashier..."
            (input)="filter()"
          />
        </p-iconfield>
        <p-date-picker
          [(ngModel)]="dateRange"
          selectionMode="range"
          [showIcon]="true"
          placeholder="Filter by date range"
          (onSelect)="filter()"

        />
        <p-button
          *ngIf="dateRange || searchQuery"
          label="Clear"
          severity="secondary"
          [text]="true"
          size="small"
          (onClick)="clearFilter()"
        />
      </div>

      <p-table
        [value]="filtered"
        [paginator]="true"
        [rows]="10"
        [rowsPerPageOptions]="[5, 10, 25]"
      >
        <ng-template pTemplate="header">
          <tr>
            <th>{{ 'SALES.SALE_ID' | translate }}</th>
            <th>{{ 'SALES.DATE' | translate }}</th>
            <th>{{ 'SALES.CUSTOMER' | translate }}</th>
            <th>{{ 'SALES.CASHIER' | translate }}</th>
            <th>{{ 'SALES.ITEMS' | translate }}</th>
            <th>{{ 'SALES.TOTAL' | translate }}</th>
            <th>{{ 'SALES.PAYMENT_METHOD' | translate }}</th>
            <th>{{ 'SALES.STATUS' | translate }}</th>
            <th>{{ 'COMMON.ACTIONS' | translate }}</th>
          </tr>
        </ng-template>
        <ng-template pTemplate="body" let-sale>
          <tr>
            <td style="font-weight:700; color:var(--primary-600);">#{{ sale.id }}</td>
            <td>{{ sale.saleDate | date: 'MMM d, y HH:mm' }}</td>
            <td>{{ sale.customerName || 'Walk-in' }}</td>
            <td>{{ sale.cashierName }}</td>
            <td>{{ sale.items.length }} items</td>
            <td style="font-weight:700;">{{ sale.total | currency: 'SAR' }}</td>
            <td>
              <p-tag
                [value]="sale.paymentMethod | titlecase"
                [severity]="sale.paymentMethod === 'cash' ? 'info' : 'warn'"
                [rounded]="true"
              />
            </td>
            <td>
              <p-tag
                [value]="sale.status | titlecase"
                [severity]="sale.status === 'completed' ? 'success' : 'danger'"
              />
            </td>
            <td>
              <p-button
                icon="pi pi-eye"
                [text]="true"
                [rounded]="true"
                size="small"
                [routerLink]="['/sales', sale.id]"
              />
            </td>
          </tr>
        </ng-template>
        <ng-template pTemplate="emptymessage">
          <tr>
            <td
              colspan="9"
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
export class SalesListComponent implements OnInit {
  sales: Sale[] = [];
  filtered: Sale[] = [];
  searchQuery = '';
  dateRange: Date[] | null = null;

  constructor(private data: DataService) {}

  ngOnInit() {
    this.data.getSales().subscribe((s) => {
      this.sales = s;
      this.filtered = s;
    });
  }

  filter() {
    this.filtered = this.sales.filter((s) => {
      const q = this.searchQuery.toLowerCase();
      const matchText =
        !q ||
        (s.customerName || '').toLowerCase().includes(q) ||
        (s.cashierName || '').toLowerCase().includes(q);
      const matchDate =
        !this.dateRange?.[0] ||
        !this.dateRange?.[1] ||
        (new Date(s.saleDate) >= this.dateRange[0] && new Date(s.saleDate) <= this.dateRange[1]);
      return matchText && matchDate;
    });
  }

  clearFilter() {
    this.searchQuery = '';
    this.dateRange = null;
    this.filtered = this.sales;
  }
}
