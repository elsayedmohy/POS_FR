import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { ColorPickerModule } from 'primeng/colorpicker';
import { FormsModule, ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { MessageService, ConfirmationService } from 'primeng/api';
import { DataService } from '../../../core/services/data.service';
import { Category } from '../../../core/models/models';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [CommonModule, TranslateModule, TableModule, ButtonModule, DialogModule,
    InputTextModule, ColorPickerModule, FormsModule, ReactiveFormsModule],
  template: `
    <div class="page-header">
      <h1>{{ 'CATEGORIES.TITLE' | translate }}</h1>
      <p-button icon="pi pi-plus" [label]="'CATEGORIES.ADD_CATEGORY' | translate" (onClick)="openDialog()" size="small" />
    </div>

    <div class="card">
      <p-table [value]="categories" >
        <ng-template pTemplate="header">
          <tr>
            <th>Color</th>
            <th>{{ 'CATEGORIES.NAME' | translate }}</th>
            <th>Products</th>
            <th>{{ 'COMMON.ACTIONS' | translate }}</th>
          </tr>
        </ng-template>
        <ng-template pTemplate="body" let-cat>
          <tr>
            <td><div [style.background]="cat.color" style="width:24px;height:24px;border-radius:6px;border:1px solid rgba(0,0,0,0.1);"></div></td>
            <td style="font-weight:500;">{{ cat.name }}</td>
            <td>{{ cat.productCount || 0 }} products</td>
            <td>
              <div style="display:flex; gap:0.5rem;">
                <p-button icon="pi pi-pencil" [text]="true" [rounded]="true" size="small" (onClick)="openDialog(cat)" />
                <p-button icon="pi pi-trash" [text]="true" [rounded]="true" size="small" severity="danger" (onClick)="delete(cat)" />
              </div>
            </td>
          </tr>
        </ng-template>
      </p-table>
    </div>

    <p-dialog [(visible)]="dialogVisible" [modal]="true" [header]="editItem?.id ? ('CATEGORIES.EDIT_CATEGORY' | translate) : ('CATEGORIES.ADD_CATEGORY' | translate)" [style]="{width: '420px'}" [draggable]="false">
      <form [formGroup]="form" (ngSubmit)="save()" style="display:flex; flex-direction:column; gap:1.25rem; padding:0.5rem 0;">
        <div>
          <label style="display:block;margin-bottom:0.4rem;font-weight:500;">{{ 'CATEGORIES.NAME' | translate }}</label>
          <input pInputText formControlName="name" class="w-full" [placeholder]="'CATEGORIES.NAME' | translate" />
        </div>
        <div>
          <label style="display:block;margin-bottom:0.4rem;font-weight:500;">{{ 'CATEGORIES.COLOR' | translate }}</label>
          <div style="display:flex; align-items:center; gap:0.75rem;">
            <p-color-picker formControlName="color" />
            <span style="font-size:0.9rem; color:var(--text-color-secondary);">{{ form.get('color')?.value }}</span>
          </div>
        </div>
      </form>
      <ng-template pTemplate="footer">
        <p-button [label]="'COMMON.CANCEL' | translate" severity="secondary" [outlined]="true" (onClick)="dialogVisible = false" />
        <p-button [label]="'COMMON.SAVE' | translate" (onClick)="save()" [disabled]="form.invalid" />
      </ng-template>
    </p-dialog>
  `
})
export class CategoriesComponent implements OnInit {
  categories: Category[] = [];
  dialogVisible = false;
  editItem: Category | null = null;

  form: any;

  constructor(
    private data: DataService,
    private fb: FormBuilder,
    private msg: MessageService,
    private confirm: ConfirmationService
  ) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      color: ['#3B82F6']
    });
  }

  ngOnInit() {
    this.data.getCategories().subscribe(c => this.categories = c);
  }

  openDialog(cat?: Category) {
    this.editItem = cat || null;
    this.form.reset({ name: cat?.name || '', color: cat?.color || '#3B82F6' });
    this.dialogVisible = true;
  }

  save() {
    if (this.form.invalid) return;
    const cat: Category = { id: this.editItem?.id || 0, name: this.form.value.name!, color: this.form.value.color! };
    this.data.saveCategory(cat).subscribe(() => {
      this.msg.add({ severity: 'success', summary: 'Saved', detail: 'Category saved' });
      this.data.getCategories().subscribe(c => this.categories = c);
      this.dialogVisible = false;
    });
  }

  delete(cat: Category) {
    this.confirm.confirm({
      message: `Delete category "${cat.name}"?`,
      accept: () => {
        this.data.deleteCategory(cat.id).subscribe(() => {
          this.categories = this.categories.filter(c => c.id !== cat.id);
          this.msg.add({ severity: 'success', summary: 'Deleted', detail: 'Category deleted' });
        });
      }
    });
  }
}
