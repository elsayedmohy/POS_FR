import { Component, inject, OnInit } from '@angular/core';
import { CommonModule, TitleCasePipe } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { TableModule } from 'primeng/table';
import { RouterLink, ActivatedRoute, Router } from '@angular/router';
import { DataService } from '../../../core/services/data.service';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { SalesService } from '../services/sales.service';
import { Sale } from '../models/sales-model';

@Component({
  selector: 'app-sale-details',
  standalone: true,
  imports: [CommonModule, TranslateModule, ButtonModule, TagModule, TableModule, RouterLink],
  styles: [
    `
      .invoice-card {
        max-width: 720px;
        margin: 0 auto;
      }
      .invoice-header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        margin-bottom: 1.5rem;
      }
      .invoice-meta {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 0.5rem 2rem;
        margin-bottom: 1.5rem;
        font-size: 0.9rem;
      }
      .meta-label {
        color: var(--text-color-secondary);
      }
      .meta-value {
        font-weight: 500;
      }
      .total-section {
        max-width: 280px;
        margin-left: auto;
      }
      .total-row {
        display: flex;
        justify-content: space-between;
        padding: 6px 0;
        font-size: 0.9rem;
        border-bottom: 1px solid var(--surface-border);
      }
      .grand-row {
        font-size: 1.1rem;
        font-weight: 800;
        color: var(--p-primary-600);
        border-top: 2px solid var(--primary-200);
        padding-top: 0.75rem;
        margin-top: 0.25rem;
      }
      .invoice-footer {
        text-align: center;
        margin-top: 2rem;
        padding-top: 1rem;
        border-top: 1px dashed var(--surface-border);
        color: var(--text-color-secondary);
        font-size: 0.85rem;
      }
    `,
  ],
  template: `
    <div class="page-header">
      <div class="header-actions">
        <p-button
          icon="pi pi-arrow-left"
          label="Back"
          [outlined]="true"
          [routerLink]="['/sales']"
          size="small"
        />
      </div>
      <h1>Sale #{{ sale?.id }}</h1>
      <div class="flex-1"></div>
      <div class="header-actions">
        <p-button icon="pi pi-download" label="Export PDF" (onClick)="exportPDF()" size="small" />
      </div>
    </div>

    <div class="card invoice-card" *ngIf="sale">
      <div class="invoice-header">
        <div>
          <h2 style="font-weight:800; font-size:1.5rem; margin-bottom:4px;">INVOICE</h2>
          <div style="color:var(--text-color-secondary);">Smart POS Store</div>
        </div>
        <div style="text-align:end;">
          <div style="font-size:1.25rem; font-weight:700; color:var(--p-primary-600);">
            #{{ sale.id }}
          </div>
          <p-tag [value]="'completed' | titlecase" [severity]="'danger'" />
        </div>
      </div>

      <div class="invoice-meta">
        <div style="display:flex;flex-direction:column;gap:4px;">
          <span class="meta-label">Date</span>
          <span class="meta-value">{{ sale.createdAt | date: 'MMMM d, yyyy – h:mm a' }}</span>
        </div>
        <div style="display:flex;flex-direction:column;gap:4px;">
          <span class="meta-label">Customer</span>
          <span class="meta-value">{{ sale.customerName || 'Walk-in Customer' }}</span>
        </div>
        <div style="display:flex;flex-direction:column;gap:4px;">
          <span class="meta-label">Cashier</span>
          <span class="meta-value">{{ sale.createdBy }}</span>
        </div>
        <div style="display:flex;flex-direction:column;gap:4px;">
          <span class="meta-label">Payment</span>
          <p-tag
            [value]="sale.paymentMethod | titlecase"
            [severity]="sale.paymentMethod === 'CASH' ? 'info' : 'warn'"
            [rounded]="true"
          />
        </div>
      </div>

      <p-table [value]="sale.items" style="margin-bottom:1.5rem;">
        <ng-template pTemplate="header">
          <tr>
            <th>Product</th>
            <th style="text-align:center;">Qty</th>
            <th style="text-align:end;">Unit Price</th>
            <th style="text-align:end;">Total</th>
          </tr>
        </ng-template>
        <ng-template pTemplate="body" let-item>
          <tr>
            <td style="font-weight:500;">{{ item.productName }}</td>
            <td style="text-align:center;">{{ item.quantity }}</td>
            <td style="text-align:end;">{{ item.price | currency }}</td>
            <td style="text-align:end; font-weight:600;">
              {{ (item.quantity * item.price) | currency }}
            </td>
          </tr>
        </ng-template>
      </p-table>

      <div class="total-section">
        <div class="total-row">
          <span>Subtotal</span><span>{{ sale.totalAmount - sale.discountValue | currency }}</span>
        </div>
        <div class="total-row" style="color:var(--p-red-500);" *ngIf="sale.discountValue > 0">
          <span>Discount ({{ sale.discountValue }}%)</span
          ><span>-{{ sale.discountValue | currency }}</span>
        </div>
        <!--        <div class="total-row">-->
        <!--          <span>Tax ({{ sale.taxRate }}%)</span><span>{{ sale.taxAmount | currency }}</span>-->
        <!--        </div>-->
        <div class="total-row grand-row">
          <span>Total</span><span>{{ sale.totalAmount | currency }}</span>
        </div>
      </div>

      <div class="invoice-footer">Thank you for your business! 🛍️</div>
    </div>

    <div *ngIf="!sale" style="text-align:center; padding:3rem; color:var(--text-color-secondary);">
      <div style="font-size:3rem;">🔍</div>
      <p>Sale not found</p>
    </div>
  `,
})
export class SaleDetailsComponent implements OnInit {
  sale: Sale | null = null;
  sales = inject(SalesService);
  constructor(
    private data: DataService,
    private route: ActivatedRoute,
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      if (this.sales.loaded()) {
        this.sale = this.sales.filteredSales().find((s) => s.id === +id);
      } else {
        this.sales.getSaleById(+id).subscribe((res) => (this.sale = res));
      }
    }
  }

  exportPDF() {
    if (!this.sale) return;
    const doc = new jsPDF();
    doc.setFontSize(20);
    doc.text('INVOICE', 14, 22);
    doc.setFontSize(12);
    doc.text(`Sale #${this.sale.id}`, 14, 32);
    doc.text(`Date: ${new Date(this.sale.createdAt).toLocaleDateString()}`, 14, 40);
    doc.text(`Customer: ${this.sale.customerName || 'Walk-in'}`, 14, 48);
    doc.text(`Cashier: ${this.sale.createdBy}`, 14, 56);
    autoTable(doc, {
      startY: 65,
      head: [['Product', 'Qty', 'Unit Price', 'Total']],
      body: this.sale.items.map((i) => [i.id, i.quantity, ` ${i.price.toFixed(2)}`]),
    });
    const finalY = (doc as any).lastAutoTable.finalY + 10;
    doc.text(`Subtotal: SAR ${this.sale.totalAmount.toFixed(2)}`, 14, finalY);
    // doc.text(`Tax (${this.sale.taxRate}%): SAR ${this.sale.taxAmount.toFixed(2)}`, 14, finalY + 8);
    doc.setFontSize(14);
    doc.text(`TOTAL: SAR ${this.sale.totalAmount.toFixed(2)}`, 14, finalY + 18);
    doc.save(`invoice-${this.sale.id}.pdf`);
  }
}
