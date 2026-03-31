import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { MessageService } from 'primeng/api';
import { DataService } from '../../../core/services/data.service';
import { User } from '../../../core/models/models';
import { SelectModule } from 'primeng/select';

@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, TranslateModule,
    InputTextModule, SelectModule, ButtonModule, ToggleSwitchModule],
  styles: [`
    .form-grid { display:grid; grid-template-columns:1fr 1fr; gap:1.25rem; }
    @media(max-width:768px) { .form-grid { grid-template-columns:1fr; } }
    .form-field { display:flex; flex-direction:column; gap:0.4rem; label { font-weight:500; font-size:0.9rem; } }
    .form-field.span-2 { grid-column:span 2; }
  `],
  template: `
    <div class="page-header">
      <h1>{{ isEdit ? ('USERS.EDIT_USER' | translate) : ('USERS.ADD_USER' | translate) }}</h1>
      <p-button icon="pi pi-arrow-left" label="Back"  [outlined]="true" [routerLink]="['/users']" size="small" />
    </div>

    <div class="card" style="max-width:700px;">
      <form [formGroup]="form" (ngSubmit)="onSubmit()">
        <div class="form-grid">
          <div class="form-field">
            <label>{{ 'USERS.FULL_NAME' | translate }} *</label>
            <input pInputText formControlName="name" [placeholder]="'USERS.FULL_NAME' | translate" />
            <small class="p-error" *ngIf="form.get('name')?.touched && form.get('name')?.invalid">{{ 'VALIDATION.REQUIRED' | translate }}</small>
          </div>

          <div class="form-field">
            <label>{{ 'USERS.EMAIL' | translate }} *</label>
            <input pInputText formControlName="email" type="email" [placeholder]="'USERS.EMAIL' | translate" />
            <small class="p-error" *ngIf="form.get('email')?.touched && form.get('email')?.invalid">{{ 'VALIDATION.EMAIL_INVALID' | translate }}</small>
          </div>

          <div class="form-field">
            <label>{{ 'USERS.PHONE' | translate }}</label>
            <input pInputText formControlName="phone" placeholder="+966 5xx xxx xxx" />
          </div>

          <div class="form-field">
            <label>{{ 'USERS.ROLE' | translate }} *</label>
            <p-select formControlName="role" [options]="roleOptions" optionLabel="label" optionValue="value"
              [placeholder]="'USERS.ROLE' | translate" />
          </div>

          <div class="form-field" style="flex-direction:row; align-items:center; gap:1rem; padding-top:0.5rem;">
            <label style="margin:0;">Active Status</label>
            <p-toggleswitch formControlName="active" />
            <span style="font-size:0.85rem; color:var(--text-color-secondary);">{{ form.get('active')?.value ? 'Active' : 'Inactive' }}</span>
          </div>

          <div class="form-field span-2" style="display:flex; gap:0.75rem; justify-content:flex-end; padding-top:0.5rem;">
            <p-button label="Cancel"  [outlined]="true" [routerLink]="['/users']" />
            <p-button [label]="isEdit ? 'Update User' : 'Add User'" type="submit" [loading]="loading" [disabled]="form.invalid" />
          </div>
        </div>
      </form>
    </div>
  `
})
export class UserFormComponent implements OnInit {
  isEdit = false;
  loading = false;
  roleOptions = [
    { label: 'Admin', value: 'admin' },
    { label: 'Cashier', value: 'cashier' }
  ];

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
      email: ['', [Validators.required, Validators.email]],
      phone: [''],
      role: ['cashier' as 'admin' | 'cashier', Validators.required],
      active: [true]
    });
  }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEdit = true;
      this.data.getUser(+id).subscribe(u => {
        if (u) this.form.patchValue({ ...u, active: u.status === 'active' } as any);
      });
    }
  }

  onSubmit() {
    if (this.form.invalid) return;
    this.loading = true;
    const v = this.form.value;
    const user: User = {
      id: this.isEdit ? +this.route.snapshot.paramMap.get('id')! : 0,
      name: v.name!, email: v.email!,
      phone: v.phone || undefined, role: v.role!,
      status: v.active ? 'active' : 'inactive'
    };
    this.data.saveUser(user).subscribe({
      next: () => {
        this.loading = false;
        this.msg.add({ severity: 'success', summary: 'Saved', detail: 'User saved successfully' });
        this.router.navigate(['/users']);
      },
      error: () => { this.loading = false; }
    });
  }
}
