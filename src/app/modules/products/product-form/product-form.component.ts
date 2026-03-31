import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { TextareaModule } from 'primeng/textarea';
import { ButtonModule } from 'primeng/button';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { SelectModule } from 'primeng/select';
import { MessageService } from 'primeng/api';
import { DataService } from '../../../core/services/data.service';
import { ProductService } from '../services/product.service';
import { CategoryService } from '../services/category.service';
import { Product, ProductRequest } from '../models/product';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    TranslateModule,
    InputTextModule,
    InputNumberModule,
    SelectModule,
    TextareaModule,
    ButtonModule,
    ToggleSwitchModule,
  ],
  styles: [
    `
      .form-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 1.25rem;
      }
      @media (max-width: 768px) {
        .form-grid {
          grid-template-columns: 1fr;
        }
      }
      .form-field {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        label {
          font-weight: 500;
          font-size: 0.9rem;
        }
      }
      .form-field.span-2 {
        grid-column: span 2;
      }
      @media (max-width: 768px) {
        .form-field.span-2 {
          grid-column: span 1;
        }
      }
    `,
  ],
  template: `
    <div class="page-header">
      <p-button
        icon="pi pi-arrow-left"
        label="Back"
        [outlined]="true"
        [routerLink]="['/products']"
        size="small"
      />

      <h1>
        {{ isEdit ? ('PRODUCTS.EDIT_PRODUCT' | translate) : ('PRODUCTS.ADD_PRODUCT' | translate) }}
      </h1>
    </div>

    <div class="card" style="max-width: 860px;">
      <form [formGroup]="form" (ngSubmit)="onSubmit()">
        <div class="form-grid">
          <div class="form-field">
            <label>{{ 'PRODUCTS.PRODUCT_NAME' | translate }} *</label>
            <input
              pInputText
              formControlName="name"
              [placeholder]="'PRODUCTS.PRODUCT_NAME' | translate"
              [class.ng-invalid]="isInvalid('name')"
            />
            <small class="p-error" *ngIf="isInvalid('name')">
              {{ 'VALIDATION.REQUIRED' | translate }}
            </small>
          </div>

          <div class="form-field">
            <label>{{ 'PRODUCTS.SKU' | translate }} *</label>
            <input
              pInputText
              formControlName="barcode"
              placeholder="e.g. BEV001"
              [class.ng-invalid]="isInvalid('barcode')"
            />
            <small class="p-error" *ngIf="isInvalid('barcode')">
              {{ 'VALIDATION.REQUIRED' | translate }}
            </small>
          </div>

          <div class="form-field">
            <label>{{ 'PRODUCTS.PRICE' | translate }}</label>
            <p-inputnumber
              formControlName="price"
              [minFractionDigits]="2"
              [maxFractionDigits]="2"
              [min]="0"
              mode="decimal"
              [class.ng-invalid]="isInvalid('price')"
            />
            <small class="p-error" *ngIf="isInvalid('price')">
              {{ 'VALIDATION.REQUIRED' | translate }}
            </small>
          </div>

          <div class="form-field">
            <label>{{ 'PRODUCTS.STOCK' | translate }} *</label>
            <p-inputnumber
              formControlName="stock"
              [min]="0"
              [class.ng-invalid]="isInvalid('stock')"
            />
            <small class="p-error" *ngIf="isInvalid('stock')">
              {{ 'VALIDATION.REQUIRED' | translate }}
            </small>
          </div>

          <div class="form-field">
            <label>{{ 'PRODUCTS.CATEGORY' | translate }} *</label>
            <p-select
              formControlName="category"
              [options]="categories.filteredCategories()"
              optionLabel="name"
              optionValue="id"
              [placeholder]="'PRODUCTS.CATEGORY' | translate"
              [class.ng-invalid]="isInvalid('category')"
            />
            <small class="p-error" *ngIf="isInvalid('category')">
              {{ 'VALIDATION.REQUIRED' | translate }}
            </small>
          </div>

          <div
            class="form-field flex flex-row"
            style="justify-content: flex-end; padding-bottom: 0.25rem;"
          >
            <label>{{ 'PRODUCTS.ACTIVE' | translate }}</label>
            <p-toggleswitch formControlName="active" />
          </div>

          <div class="form-field span-2">
            <label>{{ 'PRODUCTS.DESCRIPTION' | translate }}</label>
            <textarea
              pTextarea
              formControlName="description"
              rows="3"
              [placeholder]="'PRODUCTS.DESCRIPTION' | translate"
            ></textarea>
          </div>

          <div class="form-field span-2 w-full flex flex-row justify-content-center gap-2">
            <p-button label="Cancel" [outlined]="true" [routerLink]="['/products']" />
            <p-button
              [label]="isEdit ? 'Update Product' : 'Add Product'"
              type="submit"
              [loading]="loading"
              [disabled]="form.invalid"
            />
          </div>
        </div>
      </form>
    </div>
  `,
})
export class ProductFormComponent implements OnInit {
  products = inject(ProductService);
  categories = inject(CategoryService);
  isEdit = false;
  loading = false;

  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private data: DataService,
    private router: Router,
    private route: ActivatedRoute,
    private msg: MessageService,
  ) {
    this.products.load();
    this.categories.load();
    this.form = this.fb.group({
      name: ['', Validators.required],
      barcode: ['', Validators.required],
      price: [null, [Validators.required, Validators.min(0)]],
      stock: [null, [Validators.required, Validators.min(0)]],
      category: [
        {
          id: null,
          name: '',
        },
        Validators.required,
      ],
      active: [false],
      description: [''],
    });
  }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEdit = true;
      const product = this.products.filteredProducts().find((p) => p.id === +id);
      const category = this.categories
        .filteredCategories()
        .find((c) => c.id === product.categoryId);
      if (product) {
        this.form.patchValue({
          name: product.name,
          barcode: product.barcode,
          price: product.price,
          stock: product.stock,
          category: category.id,
          active: product.active,
          description: product.description,
        });
      }
    }
  }

  /** Returns true when a field is invalid AND has been touched */
  isInvalid(field: string): boolean {
    const ctrl = this.form.get(field);
    return !!(ctrl?.invalid && ctrl?.touched);
  }

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    let formValue = this.form.value;

    let productRequest:ProductRequest = {
        id: this.isEdit ? +this.route.snapshot.paramMap.get('id')! : null,
      name : formValue.name,
      price: formValue.price,
      stock: formValue.stock,
      categoryId: formValue.category,
      barcode: formValue.barcode,
      active: formValue.active,
      description: formValue.description,
    }

    this.loading = true;
    if(this.isEdit) {
      this.products.update(productRequest).subscribe({
        next: () => {
          this.loading = false;
          this.msg.add({
            severity: 'success',
            summary: 'Saved',
            detail: 'Product saved successfully',
          });
          this.router.navigate(['/products']);
        },
        error: () => {
          this.loading = false;
        },
      });
    } else {
      this.products.add(productRequest).subscribe({
        next: () => {
          this.loading = false;
          this.msg.add({
            severity: 'success',
            summary: 'Saved',
            detail: 'Product saved successfully',
          });
          this.router.navigate(['/products']);
        },
        error: () => {
          this.loading = false;
        },
      });
    }

  }
}
