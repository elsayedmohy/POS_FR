import { Component } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { MessageService } from 'primeng/api';
import { AuthService } from '../../../core/services/auth.service';

function passwordsMatch(control: AbstractControl): ValidationErrors | null {
    const pass = control.get('password')?.value;
    const confirm = control.get('confirmPassword')?.value;
    return pass === confirm ? null : { passwordsMismatch: true };
}

@Component({
    selector: 'app-register',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, RouterLink, TranslateModule,
        InputTextModule, PasswordModule, ButtonModule],
    template: `
    <div class="auth-container">
      <div class="auth-card">
        <div class="auth-logo">
          <div class="logo-icon">✨</div>
          <h2>{{ 'AUTH.REGISTER' | translate }}</h2>
          <p>{{ 'APP.NAME' | translate }}</p>
        </div>

        <form [formGroup]="form" (ngSubmit)="onSubmit()">
          <div class="form-group">
            <label>{{ 'AUTH.FULL_NAME' | translate }}</label>
            <input pInputText formControlName="fullName" [placeholder]="'AUTH.FULL_NAME' | translate" class="w-full" />
            <small class="p-error" *ngIf="form.get('fullName')?.touched && form.get('fullName')?.invalid">
              {{ 'VALIDATION.REQUIRED' | translate }}
            </small>
          </div>

          <div class="form-group">
            <label>{{ 'AUTH.EMAIL' | translate }}</label>
            <input pInputText formControlName="email" type="email" [placeholder]="'AUTH.EMAIL' | translate" class="w-full" />
            <small class="p-error" *ngIf="form.get('email')?.touched && form.get('email')?.invalid">
              {{ 'VALIDATION.EMAIL_INVALID' | translate }}
            </small>
          </div>

          <div class="form-group">
            <label>{{ 'AUTH.PASSWORD' | translate }}</label>
            <p-password formControlName="password" [placeholder]="'AUTH.PASSWORD' | translate"  [toggleMask]="true" />
            <small class="p-error" *ngIf="form.get('password')?.touched && form.get('password')?.invalid">
              {{ 'VALIDATION.REQUIRED' | translate }}
            </small>
          </div>

          <div class="form-group">
            <label>{{ 'AUTH.CONFIRM_PASSWORD' | translate }}</label>
            <p-password formControlName="confirmPassword" [feedback]="false" [placeholder]="'AUTH.CONFIRM_PASSWORD' | translate"  [toggleMask]="true" />
            <small class="p-error" *ngIf="form.hasError('passwordsMismatch') && form.get('confirmPassword')?.touched">
              {{ 'VALIDATION.PASSWORDS_MISMATCH' | translate }}
            </small>
          </div>

          <p-button [label]="'AUTH.REGISTER' | translate" type="submit" [loading]="loading"
            [disabled]="form.invalid" styleClass="w-full" size="large" />
        </form>

        <div class="auth-footer">
          {{ 'AUTH.ALREADY_HAVE_ACCOUNT' | translate }}
          <a [routerLink]="['/auth/login']">&nbsp;{{ 'AUTH.LOGIN' | translate }}</a>
        </div>
      </div>
    </div>
  `
})
export class RegisterComponent {
    loading = false;

    form;

    constructor(
        private fb: FormBuilder,
        private auth: AuthService,
        private router: Router,
        private msg: MessageService
    ) {
      this.form = this.fb.group(
        {
          fullName: ['', Validators.required],
          email: ['', [Validators.required, Validators.email]],
          password: ['', [Validators.required, Validators.minLength(6)]],
          confirmPassword: ['', Validators.required],
        },
        { validators: passwordsMatch },
      );
    }



    onSubmit() {
        if (this.form.invalid) return;
        this.loading = true;
        this.auth.register(this.form.value).subscribe({
            next: () => { this.loading = false; this.router.navigate(['/dashboard']); },
            error: () => { this.loading = false; }
        });
    }
}
