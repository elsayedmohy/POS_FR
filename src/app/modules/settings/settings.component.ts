import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { TextareaModule } from 'primeng/textarea';
import { ButtonModule } from 'primeng/button';
import { TabsModule } from 'primeng/tabs';
import { SelectModule } from 'primeng/select';
import { MessageService } from 'primeng/api';
import { DataService } from '../../core/services/data.service';
import { ThemeService } from '../../core/services/theme.service';
import { LocalizationService } from '../../core/services/localization.service';


@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TranslateModule,
    InputTextModule,
    InputNumberModule,
    TextareaModule,
    ButtonModule,
    TabsModule,
    SelectModule,
  ],
  styles: [
    `
      .settings-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 1.25rem;
      }
      @media (max-width: 768px) {
        .settings-grid {
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
      .theme-card {
        border: 2px solid var(--surface-border);
        border-radius: 16px;
        padding: 1.5rem;
        cursor: pointer;
        transition: all 0.2s;
        text-align: center;
      }
      .theme-card:hover {
        border-color: var(--primary-300);
      }
      .theme-card.selected {
        border-color: var(--primary-500);
        background: var(--primary-50);
      }
      .lang-card {
        border: 2px solid var(--surface-border);
        border-radius: 12px;
        padding: 1rem;
        cursor: pointer;
        transition: all 0.2s;
        display: flex;
        gap: 0.75rem;
        align-items: center;
      }
      .lang-card.selected {
        border-color: var(--primary-500);
        background: var(--primary-50);
      }
    `,
  ],
  template: `
    <div class="page-header">
      <h1>{{ 'SETTINGS.TITLE' | translate }}</h1>
    </div>

    <p-tabs value="0">
      <p-tablist>
        <p-tab value="0">{{ 'SETTINGS.STORE_PROFILE' | translate }}</p-tab>

        <p-tab value="1">{{ 'SETTINGS.PREFERENCES' | translate }}</p-tab>

        <p-tab value="2">{{ 'SETTINGS.THEME' | translate }}</p-tab>
      </p-tablist>
      <p-tabpanels>
        <p-tabpanel value="0">
          <div class="card" style="margin-top:1rem; max-width:800px;" *ngIf="profileForm">
            <form [formGroup]="profileForm" (ngSubmit)="saveProfile()">
              <div class="settings-grid">
                <div class="form-field">
                  <label>{{ 'SETTINGS.STORE_NAME' | translate }} *</label>
                  <input pInputText formControlName="storeName" />
                </div>
                <div class="form-field">
                  <label>{{ 'SETTINGS.CURRENCY' | translate }}</label>
                  <p-select
                    formControlName="currency"
                    [options]="currencies"
                    optionLabel="label"
                    optionValue="value"
                  />
                </div>
                <div class="form-field">
                  <label>{{ 'SETTINGS.PHONE' | translate }}</label>
                  <input pInputText formControlName="phone" />
                </div>
                <div class="form-field">
                  <label>{{ 'SETTINGS.EMAIL' | translate }}</label>
                  <input pInputText formControlName="email" type="email" />
                </div>
                <div class="form-field span-2">
                  <label>{{ 'SETTINGS.ADDRESS' | translate }}</label>
                  <input pInputText formControlName="address" />
                </div>
                <div
                  class="form-field span-2"
                  style="display:flex; justify-content:flex-end; padding-top:0.5rem;"
                >
                  <p-button
                    [label]="'SETTINGS.SAVE' | translate"
                    type="submit"
                    [loading]="loadingProfile"
                    icon="pi pi-save"
                  />
                </div>
              </div>
            </form>
          </div>
        </p-tabpanel>
        <p-tabpanel value="1">
          <div class="card" style="margin-top:1rem; max-width:800px;" *ngIf="prefsForm">
            <form [formGroup]="prefsForm" (ngSubmit)="savePrefs()">
              <div class="settings-grid">
                <div class="form-field">
                  <label>{{ 'SETTINGS.TAX_RATE' | translate }}</label>
                  <p-inputnumber
                    formControlName="taxRate"
                    suffix="%"
                    [min]="0"
                    [max]="100"
                    [maxFractionDigits]="2"
                  />
                </div>
                <div class="form-field">
                  <label style="opacity:0;">placeholder</label>
                  <small
                    style="color:var(--text-color-secondary); line-height:1.5; padding-top:0.5rem;"
                    >Tax is automatically applied to all sales</small
                  >
                </div>
                <div class="form-field span-2">
                  <label>{{ 'SETTINGS.INVOICE_FOOTER' | translate }}</label>
                  <textarea
                    pTextarea
                    formControlName="invoiceFooter"
                    rows="3"
                    placeholder="e.g. Thank you for your business!"
                  ></textarea>
                </div>
                <div
                  class="form-field span-2"
                  style="display:flex; justify-content:flex-end; padding-top:0.5rem;"
                >
                  <p-button
                    [label]="'SETTINGS.SAVE' | translate"
                    type="submit"
                    [loading]="loadingPrefs"
                    icon="pi pi-save"
                  />
                </div>
              </div>
            </form>
          </div>
        </p-tabpanel>
        <p-tabpanel value="2">
          <div class="card" style="margin-top:1rem; max-width:800px;">
            <h3 style="margin-bottom:1rem; font-weight:600;">Theme</h3>
            <div style="display:grid; grid-template-columns:1fr 1fr; gap:1rem; margin-bottom:2rem;">
              <div
                class="theme-card"
                [class.selected]="!theme.isDark()"
                (click)="theme.isDark() && theme.toggle()"
              >
                <div style="font-size:2rem; margin-bottom:0.5rem;">☀️</div>
                <div style="font-weight:600;">{{ 'SETTINGS.LIGHT_THEME' | translate }}</div>
                <div style="font-size:0.8rem; color:var(--text-color-secondary); margin-top:4px;">
                  Clean white interface
                </div>
              </div>
              <div
                class="theme-card"
                [class.selected]="theme.isDark()"
                (click)="!theme.isDark() && theme.toggle()"
              >
                <div style="font-size:2rem; margin-bottom:0.5rem;">🌙</div>
                <div style="font-weight:600;">{{ 'SETTINGS.DARK_THEME' | translate }}</div>
                <div style="font-size:0.8rem; color:var(--text-color-secondary); margin-top:4px;">
                  Easy on the eyes
                </div>
              </div>
            </div>

            <h3 style="margin-bottom:1rem; font-weight:600;">
              {{ 'SETTINGS.LANGUAGE' | translate }}
            </h3>
            <div style="display:grid; grid-template-columns:1fr 1fr; gap:1rem;">
              <div
                class="lang-card"
                [class.selected]="localization.currentLang() === 'en'"
                (click)="localization.setLang('en')"
              >
                <div style="font-size:1.5rem;">🇺🇸</div>
                <div>
                  <div style="font-weight:600;">English</div>
                  <div style="font-size:0.8rem;color:var(--text-color-secondary);">LTR Layout</div>
                </div>
              </div>
              <div
                class="lang-card"
                [class.selected]="localization.currentLang() === 'ar'"
                (click)="localization.setLang('ar')"
              >
                <div style="font-size:1.5rem;">🇸🇦</div>
                <div>
                  <div style="font-weight:600;">العربية</div>
                  <div style="font-size:0.8rem;color:var(--text-color-secondary);">RTL Layout</div>
                </div>
              </div>
            </div>
          </div>
        </p-tabpanel>
      </p-tabpanels>
    </p-tabs>
  `,
})
export class SettingsComponent implements OnInit {
  loadingProfile = false;
  loadingPrefs = false;
  profileForm: any;
  prefsForm: any;

  currencies = [
    { label: 'SAR – Saudi Riyal', value: 'SAR' },
    { label: 'USD – US Dollar', value: 'USD' },
    { label: 'EUR – Euro', value: 'EUR' },
    { label: 'AED – UAE Dirham', value: 'AED' },
  ];

  constructor(
    private data: DataService,
    private fb: FormBuilder,
    private msg: MessageService,
    public theme: ThemeService,
    public localization: LocalizationService,
  ) {}

  ngOnInit() {
    this.data.getStoreSettings().subscribe((s) => {
      this.profileForm = this.fb.group({
        storeName: [s.storeName, Validators.required],
        currency: [s.currency],
        phone: [s.phone || ''],
        email: [s.email || ''],
        address: [s.address || ''],
      });
      this.prefsForm = this.fb.group({
        taxRate: [s.taxRate, [Validators.required, Validators.min(0)]],
        invoiceFooter: [s.invoiceFooter || ''],
      });
    });
  }

  saveProfile() {
    this.loadingProfile = true;
    this.data.getStoreSettings().subscribe((s) => {
      this.data.saveStoreSettings({ ...s, ...this.profileForm.value }).subscribe(() => {
        this.loadingProfile = false;
        this.msg.add({ severity: 'success', summary: 'Saved', detail: 'Store profile updated' });
      });
    });
  }

  savePrefs() {
    this.loadingPrefs = true;
    this.data.getStoreSettings().subscribe((s) => {
      this.data.saveStoreSettings({ ...s, ...this.prefsForm.value }).subscribe(() => {
        this.loadingPrefs = false;
        this.msg.add({ severity: 'success', summary: 'Saved', detail: 'Preferences updated' });
      });
    });
  }
}
