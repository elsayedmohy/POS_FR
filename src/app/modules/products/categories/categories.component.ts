import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { ColorPickerModule } from 'primeng/colorpicker';
import { FormsModule, ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { MessageService, ConfirmationService } from 'primeng/api';
import { TranslateService } from '@ngx-translate/core';
import { Category } from '../models/category';
import { CategoryService } from '../services/category.service';
import { ToastService } from '../../../core/services/toast.service';
import { IconField } from 'primeng/iconfield';
import { InputIcon } from 'primeng/inputicon';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    TableModule,
    ButtonModule,
    DialogModule,
    InputTextModule,
    ColorPickerModule,
    FormsModule,
    ReactiveFormsModule,
    IconField,
    InputIcon,
  ],
  template: `
    <div class="page-header">
      <h1>{{ 'CATEGORIES.TITLE' | translate }}</h1>
      <div class="flex-1"></div>
      <p-button
        icon="pi pi-plus"
        [label]="'CATEGORIES.ADD_CATEGORY' | translate"
        (onClick)="openDialog()"
        size="small"
      />
    </div>

    <div class="card">
      <div style="margin-bottom:1.25rem ">
        <p-iconfield>
          <p-inputicon class="pi pi-search" />
          <input
            pInputText
            [(ngModel)]="categories.searchQuery"
            [placeholder]="'COMMON.SEARCH' | translate"
          />
        </p-iconfield>
      </div>
      <p-table
        [value]="categories.filteredCategories()"
        [paginator]="true"
        [rows]="10"
        [rowsPerPageOptions]="[5, 10, 25]"
        [globalFilterFields]="['name']"
      >
        <ng-template pTemplate="header">
          <tr>
            <th pSortableColumn="name">
              {{ 'CATEGORIES.NAME' | translate }}
              <p-sortIcon field="name" />
            </th>
            <th>{{ 'COMMON.ACTIONS' | translate }}</th>
          </tr>
        </ng-template>
        <ng-template pTemplate="body" let-cat>
          <tr>
            <td>
              <div style="display:flex; align-items:center; gap:0.75rem;">
                <div
                  style="width:36px;
                  height:36px;
                  border-radius:8px;
                  display:flex;
                  align-items:center;
                  justify-content:center;
                  font-size:1.2rem;"
                >
                  📦
                </div>
                <span style="font-weight:500;">{{ cat.name }}</span>
              </div>
            </td>

            <td>
              <div style="display:flex; gap:0.5rem;">
                <p-button
                  icon="pi pi-pencil"
                  [text]="true"
                  [rounded]="true"
                  size="small"
                  (onClick)="openDialog(cat)"
                />
                <p-button
                  icon="pi pi-trash"
                  [text]="true"
                  [rounded]="true"
                  size="small"
                  severity="danger"
                  (onClick)="delete(cat)"
                />
              </div>
            </td>
          </tr>
        </ng-template>
      </p-table>
    </div>

    <p-dialog
      [(visible)]="dialogVisible"
      [modal]="true"
      [header]="
        editItem?.id
          ? ('CATEGORIES.EDIT_CATEGORY' | translate)
          : ('CATEGORIES.ADD_CATEGORY' | translate)
      "
      [style]="{ width: '420px' }"
      [draggable]="false"
    >
      <form
        [formGroup]="form"
        (ngSubmit)="save()"
        style="display:flex; flex-direction:column; gap:1.25rem; padding:0.5rem 0;"
      >
        <div>
          <label style="display:block;margin-bottom:0.4rem;font-weight:500;">{{
            'CATEGORIES.NAME' | translate
          }}</label>
          <input
            pInputText
            formControlName="name"
            class="w-full"
            [placeholder]="'CATEGORIES.NAME' | translate"
          />
        </div>
        <div>
          <label style="display:block;margin-bottom:0.4rem;font-weight:500;">{{
            'CATEGORIES.COLOR' | translate
          }}</label>
          <div style="display:flex; align-items:center; gap:0.75rem;">
            <p-color-picker formControlName="color" />
            <span style="font-size:0.9rem;">{{ form.get('color')?.value }}</span>
          </div>
        </div>
      </form>
      <ng-template pTemplate="footer">
        <p-button
          [label]="'COMMON.CANCEL' | translate"
          [outlined]="true"
          (onClick)="dialogVisible = false"
        />
        <p-button
          [label]="'COMMON.SAVE' | translate"
          (onClick)="save()"
          [disabled]="form.invalid"
        />
      </ng-template>
    </p-dialog>
  `,
})
export class CategoriesComponent implements OnInit {
  categories = inject(CategoryService);
  dialogVisible = false;
  editItem: Category | null = null;

  form: any;

  constructor(
    private fb: FormBuilder,
    private msg: ToastService,
    private confirm: ConfirmationService,
  ) {
    this.categories.load();
    this.form = this.fb.group({
      name: ['', Validators.required],
      color: ['#3B82F6'],
    });
  }

  ngOnInit() {}

  openDialog(cat?: Category) {
    this.editItem = cat || null;
    this.form.reset({ name: cat?.name || '' });
    this.dialogVisible = true;
  }

  save() {
    if (this.form.invalid) return;
    const cat: Category = { id: this.editItem?.id || 0, name: this.form.value.name! };
    this.categories.add(cat).subscribe(() => {
      this.msg.success('Saved', 'Category saved');
      this.dialogVisible = false;
    });
  }

  delete(cat: Category) {
    this.confirm.confirm({
      message: `Delete category "${cat.name}"?`,
      accept: () => {
        this.categories.remove(cat.id).subscribe(() => {
          this.msg.success('Deleted', 'Category deleted');
        });
      },
    });
  }
}
