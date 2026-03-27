import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { TextareaModule } from 'primeng/textarea';
import { ButtonModule } from 'primeng/button';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { MessageService } from 'primeng/api';
import { DataService } from '../../../core/services/data.service';
import { Category, Product } from '../../../core/models/models';
import { SelectModule } from 'primeng/select';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, TranslateModule,
    InputTextModule, InputNumberModule, SelectModule, TextareaModule, ButtonModule, ToggleSwitchModule],
  styles: [`
    .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1.25rem; }
    @media (max-width: 768px) { .form-grid { grid-template-columns: 1fr; } }
    .form-field { display: flex; flex-direction: column; gap: 0.5rem; label { font-weight: 500; font-size: 0.9rem; } }
    .form-field.span-2 { grid-column: span 2; }
    @media (max-width: 768px) { .form-field.span-2 { grid-column: span 1; } }
  `],
  template: `
    <div class="page-header">
      <h1>{{ isEdit ? ('PRODUCTS.EDIT_PRODUCT' | translate) : ('PRODUCTS.ADD_PRODUCT' | translate) }}</h1>
      <p-button icon="pi pi-arrow-left" label="Back" severity="secondary" [outlined]="true" [routerLink]="['/products']" size="small" />
    </div>

    <div class="card" style="max-width: 860px;">
      <form [formGroup]="form" (ngSubmit)="onSubmit()">
        <div class="form-grid">
          <div class="form-field">
            <label>{{ 'PRODUCTS.PRODUCT_NAME' | translate }} *</label>
            <input pInputText formControlName="name" [placeholder]="'PRODUCTS.PRODUCT_NAME' | translate" />
            <small class="p-error" *ngIf="form.get('name')?.touched && form.get('name')?.invalid">{{ 'VALIDATION.REQUIRED' | translate }}</small>
          </div>

          <div class="form-field">
            <label>{{ 'PRODUCTS.SKU' | translate }} *</label>
            <input pInputText formControlName="sku" placeholder="e.g. BEV001" />
          </div>

          <div class="form-field">
            <label>{{ 'PRODUCTS.PRICE' | translate }} (SAR) *</label>
            <p-inputnumber formControlName="price" [minFractionDigits]="2" [maxFractionDigits]="2" [min]="0" mode="decimal" />
          </div>

          <div class="form-field">
            <label>{{ 'PRODUCTS.COST' | translate }} (SAR)</label>
            <p-inputnumber formControlName="cost" [minFractionDigits]="2" [maxFractionDigits]="2" [min]="0" mode="decimal" />
          </div>

          <div class="form-field">
            <label>{{ 'PRODUCTS.STOCK' | translate }} *</label>
            <p-inputnumber formControlName="stock" [min]="0" />
          </div>

          <div class="form-field">
            <label>{{ 'PRODUCTS.CATEGORY' | translate }} *</label>
            <p-select formControlName="categoryId" [options]="categories"
              optionLabel="name" optionValue="id" [placeholder]="'PRODUCTS.CATEGORY' | translate" />
          </div>

          <div class="form-field">
            <label>{{ 'PRODUCTS.BARCODE' | translate }}</label>
            <input pInputText formControlName="barcode" placeholder="Optional barcode" />
          </div>

          <div class="form-field" style="justify-content: flex-end; padding-bottom: 0.25rem;">
            <label>{{ 'PRODUCTS.ACTIVE' | translate }}</label>
            <p-toggleswitch formControlName="active" />
          </div>

          <div class="form-field span-2">
            <label>{{ 'PRODUCTS.DESCRIPTION' | translate }}</label>
            <textarea pTextarea formControlName="description" rows="3" [placeholder]="'PRODUCTS.DESCRIPTION' | translate"></textarea>
          </div>

          <div class="form-field span-2" style="display:flex; gap:0.75rem; justify-content: flex-end; padding-top: 0.5rem;">
            <p-button label="Cancel" severity="secondary" [outlined]="true" [routerLink]="['/products']" />
            <p-button [label]="isEdit ? 'Update Product' : 'Add Product'" type="submit" [loading]="loading" [disabled]="form.invalid" />
          </div>
        </div>
      </form>
    </div>
  `
})
export class ProductFormComponent implements OnInit {
  isEdit = false;
  loading = false;
  categories: Category[] = [];

  form: any;

  constructor(
    private fb: FormBuilder,
    private data: DataService,
    private router: Router,
    private route: ActivatedRoute,
    private msg: MessageService
  ) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      sku: ['', Validators.required],
      price: [0, [Validators.required, Validators.min(0.01)]],
      cost: [0],
      stock: [0, Validators.required],
      categoryId: [null as number | null, Validators.required],
      barcode: [''],
      description: [''],
      active: [true]
    });
  }

  ngOnInit() {
    this.data.getCategories().subscribe(c => this.categories = c);
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEdit = true;
      this.data.getProduct(+id).subscribe(p => {
        if (p) this.form.patchValue(p as any);
      });
    }
  }

  onSubmit() {
    if (this.form.invalid) return;
    this.loading = true;
    const product = { ...this.form.value, id: this.isEdit ? +this.route.snapshot.paramMap.get('id')! : 0 } as Product;
    const cat = this.categories.find(c => c.id === product.categoryId);
    product.categoryName = cat?.name;
    this.data.saveProduct(product).subscribe({
      next: () => {
        this.loading = false;
        this.msg.add({ severity: 'success', summary: 'Saved', detail: 'Product saved successfully' });
        this.router.navigate(['/products']);
      },
      error: () => { this.loading = false; }
    });
  }
}
