import { Component } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { MessageService } from 'primeng/api';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, TranslateModule,
    InputTextModule, PasswordModule, ButtonModule, CheckboxModule],
  template: `
    <div class="auth-container">
      <div class="auth-card">
        <div class="auth-logo">
          <div class="logo-icon">🛒</div>
          <h2>{{ 'APP.NAME' | translate }}</h2>
          <p>{{ 'APP.TAGLINE' | translate }}</p>
        </div>

        <form [formGroup]="form" (ngSubmit)="onSubmit()">
          <div class="form-group">
            <label>{{ 'AUTH.EMAIL' | translate }}</label>
            <input pInputText formControlName="email" type="email"
              [placeholder]="'AUTH.EMAIL' | translate" class="w-full" />
            <small class="p-error" *ngIf="form.get('email')?.touched && form.get('email')?.invalid">
              {{ 'VALIDATION.EMAIL_INVALID' | translate }}
            </small>
          </div>

          <div class="form-group">
            <label>{{ 'AUTH.PASSWORD' | translate }}</label>
            <p-password formControlName="password" [feedback]="false"
              [placeholder]="'AUTH.PASSWORD' | translate" styleClass="w-full" [toggleMask]="true" />
            <small class="p-error" *ngIf="form.get('password')?.touched && form.get('password')?.invalid">
              {{ 'VALIDATION.REQUIRED' | translate }}
            </small>
          </div>

          <div style="display:flex; justify-content: space-between; align-items: center; margin-bottom: 1.25rem;">
            <div style="display:flex; align-items:center; gap: 0.5rem;">
              <p-checkbox formControlName="rememberMe" [binary]="true" inputId="remember" />
              <label for="remember" style="cursor:pointer; font-size:0.9rem;">{{ 'AUTH.REMEMBER_ME' | translate }}</label>
            </div>
            <a [routerLink]="['/auth/forgot-password']" style="color: var(--p-primary-500); font-size: 0.85rem; text-decoration:none;">
              {{ 'AUTH.FORGOT_PASSWORD' | translate }}
            </a>
          </div>

          <p-button [label]="'AUTH.LOGIN' | translate" type="submit" [loading]="loading"
            [disabled]="form.invalid" styleClass="w-full" size="large" />
        </form>

        <div class="auth-footer">
          {{ 'AUTH.DONT_HAVE_ACCOUNT' | translate }}
          <a [routerLink]="['/auth/register']">&nbsp;{{ 'AUTH.REGISTER' | translate }}</a>
        </div>
      </div>
    </div>
  `
})
export class LoginComponent {
  loading = false;

  form: any;

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router,
    private msg: MessageService
  ) {
    this.form = this.fb.group({
      email: ['admin@pos.com', [Validators.required, Validators.email]],
      password: ['123456', Validators.required],
      rememberMe: [false]
    });
  }

  onSubmit() {
    if (this.form.invalid) return;
    this.loading = true;
    const { email, password } = this.form.value;
    this.auth.login({ email: email!, password: password! }).subscribe({
      next: () => {
        this.loading = false;
        this.router.navigate(['/dashboard']);
      },
      error: () => {
        this.loading = false;
        this.msg.add({ severity: 'error', summary: 'Error', detail: 'Invalid credentials' });
      }
    });
  }
}
