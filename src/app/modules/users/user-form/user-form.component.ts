import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { MessageService } from 'primeng/api';
import { DataService } from '../../../core/services/data.service';
import { User } from '../../../core/models/models';
import { SelectModule } from 'primeng/select';
import { UserRole } from '../../../core/models/enums';
import { UserService } from '../services/user.service';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    TranslateModule,
    InputTextModule,
    SelectModule,
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
        gap: 0.4rem;
        label {
          font-weight: 500;
          font-size: 0.9rem;
        }
      }
      .form-field.span-2 {
        grid-column: span 2;
      }
    `,
  ],
  template: `
    <div class="page-header">
      <p-button
        icon="pi pi-arrow-left"
        label="Back"
        [outlined]="true"
        [routerLink]="['/users']"
        size="small"
      />
      <h1>{{ isEdit ? ('USERS.EDIT_USER' | translate) : ('USERS.ADD_USER' | translate) }}</h1>
    </div>

    <div class="card" style="max-width:860px;">
      <form [formGroup]="form" (ngSubmit)="onSubmit()">
        <div class="form-grid">
          <div class="form-field">
            <label>{{ 'USERS.FULL_NAME' | translate }} *</label>
            <input
              pInputText
              formControlName="name"
              [placeholder]="'USERS.FULL_NAME' | translate"
            />
            <small class="p-error" *ngIf="form.get('name')?.touched && form.get('name')?.invalid">{{
              'VALIDATION.REQUIRED' | translate
            }}</small>
          </div>

          <div class="form-field">
            <label>{{ 'USERS.EMAIL' | translate }} *</label>
            <input
              pInputText
              formControlName="email"
              type="email"
              [placeholder]="'USERS.EMAIL' | translate"
            />
            <small
              class="p-error"
              *ngIf="form.get('email')?.touched && form.get('email')?.invalid"
              >{{ 'VALIDATION.EMAIL_INVALID' | translate }}</small
            >
          </div>

          <div class="form-field">
            <label>{{ 'USERS.PHONE' | translate }}</label>
            <input pInputText formControlName="phone" placeholder="+966 5xx xxx xxx" />
          </div>

          <div class="form-field">
            <label>{{ 'USERS.ROLE' | translate }} *</label>
            <p-select
              formControlName="role"
              [options]="users.roleOptions"
              optionLabel="label"
              optionValue="value"
              [placeholder]="'USERS.ROLE' | translate"
            />
          </div>

          <div
            class="form-field span-2 flex-row"
            style="display:flex; gap:0.75rem; justify-content:center; padding-top:0.5rem;"
          >
            <p-button label="Cancel" [outlined]="true" [routerLink]="['/users']" />
            <p-button
              [label]="isEdit ? 'Update User' : 'Add User'"
              type="submit"
              [loading]="users.loading()"
              [disabled]="form.invalid"
            />
          </div>
        </div>
      </form>
    </div>
  `,
})
export class UserFormComponent implements OnInit {
  users = inject(UserService);
  isEdit = false;

  form: any;

  constructor(
    private fb: FormBuilder,
    private data: DataService,
    private router: Router,
    private route: ActivatedRoute,
    private msg: ToastService,
  ) {
    this.users.load();
    this.form = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: [''],
      role: ['', Validators.required],
    });
  }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEdit = true;
     const user = this.users.users().find((user) => user.id === +id);
     if (user) {
       this.form.patchValue(user)
     }
    }
  }

  onSubmit() {
    if (this.form.invalid) return;
    const v = this.form.value;
    const user: User = {
      id: this.isEdit ? +this.route.snapshot.paramMap.get('id')! : null,
      name: v.name!,
      email: v.email!,
      phone: v.phone || undefined,
      role: v.role as UserRole,
    };

    if(this.isEdit) {
      this.users.update(user).subscribe({
        next: () => {
          this.msg.success('Saved', 'User saved successfully');
          this.router.navigate(['/users']);
        },
        error: (e) => {
          this.msg.error('Error', 'Something went wrong' + e.message);
        },
      });
    } else {
      this.users.add(user).subscribe({
        next: () => {
          this.msg.success('Saved', 'User saved successfully');
          this.router.navigate(['/users']);
        },
        error: (e) => {
          this.msg.error('Error', 'Something went wrong' + e.message);
        },
      });
    }
  }
}
