import { Component } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { MessageService } from 'primeng/api';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    TranslateModule,
    InputTextModule,
    ButtonModule,
  ],
  template: `
    <div class="auth-container">
      <div class="auth-card">
        <div class="auth-logo">
          <div class="logo-icon">🔑</div>
          <h2>{{ 'AUTH.FORGOT_PASSWORD' | translate }}</h2>
          <p>{{ 'AUTH.ENTER_EMAIL_RESET' | translate }}</p>
        </div>

        <div *ngIf="sent; else form">
          <div style="text-align:center; padding: 1rem;">
            <div style="font-size: 3rem; margin-bottom: 1rem;">✅</div>
            <p style="color: var(--text-color-secondary);">Reset link sent! Check your inbox.</p>
          </div>
        </div>
        <ng-template #form>
          <form [formGroup]="resetForm" (ngSubmit)="onSubmit()">
            <div class="form-group">
              <label>{{ 'AUTH.EMAIL' | translate }}</label>
              <input
                pInputText
                formControlName="email"
                type="email"
                [placeholder]="'AUTH.EMAIL' | translate"
                class="w-full"
              />
              <small
                class="p-error"
                *ngIf="resetForm.get('email')?.touched && resetForm.get('email')?.invalid"
              >
                {{ 'VALIDATION.EMAIL_INVALID' | translate }}
              </small>
            </div>
            <p-button
              [label]="'AUTH.SEND_RESET_LINK' | translate"
              type="submit"
              [loading]="loading"
              [disabled]="resetForm.invalid"
              styleClass="w-full"
              size="large"
            />
          </form>
        </ng-template>

        <div class="auth-footer" style="margin-top: 1rem;">
          <a [routerLink]="['/auth/login']">← {{ 'AUTH.BACK_TO_LOGIN' | translate }}</a>
        </div>
      </div>
    </div>
  `,
})
export class ForgotPasswordComponent {
  loading = false;
  sent = false;
  resetForm;
  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
  ) {
    this.resetForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  onSubmit() {
    if (this.resetForm.invalid) return;
    this.loading = true;
    this.auth.forgotPassword(this.resetForm.value.email!).subscribe(() => {
      this.loading = false;
      this.sent = true;
    });
  }
}
