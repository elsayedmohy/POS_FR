import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonModule } from 'primeng/button';
import { AvatarModule } from 'primeng/avatar';
import { MenuModule } from 'primeng/menu';
import { TooltipModule } from 'primeng/tooltip';
import { MenuItem } from 'primeng/api';
import { LocalizationService } from '../../core/services/localization.service';
import { ThemeService } from '../../core/services/theme.service';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, TranslateModule, ButtonModule, AvatarModule, MenuModule, TooltipModule],
  styles: [
    `
      .header {
        position: fixed;
        top: 0;
        right: 0;
        left: var(--sidebar-width);
        height: var(--header-height);
        z-index: 99;
        background: var(--surface-card);
        border-bottom: 1px solid var(--surface-border);
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0 1.5rem;
        transition: left 0.3s;
      }
      .header.collapsed {
        left: var(--sidebar-collapsed-width);
      }
      :host-context(body.rtl) .header {
        left: 0;
        right: var(--sidebar-width);
      }
      :host-context(body.rtl) .header.collapsed {
        right: var(--sidebar-collapsed-width);
      }
      .header-left {
        display: flex;
        align-items: center;
        gap: 0.75rem;
      }
      .header-right {
        display: flex;
        align-items: center;
        gap: 0.75rem;
      }
      .page-title {
        font-weight: 600;
        font-size: 1.2rem;
        color: var(--text-color);
      }
      .lang-badge {
        padding: 4px 10px;
        border-radius: 8px;
        cursor: pointer;
        font-weight: 700;
        font-size: 0.8rem;
        border: 1px solid var(--primary-200);
        transition: all 0.2s;
      }
      .user-info {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        cursor: pointer;
        padding: 4px 8px;
        border-radius: 8px;
        transition: background 0.2s;
      }
      .user-name {
        font-weight: 600;
        font-size: 0.9rem;
      }
      .user-role {
        font-size: 0.75rem;
        color: var(--text-color-secondary);
      }
    `,
  ],
  template: `
    <header class="header" [class.collapsed]="sidebarCollapsed">
      <div class="header-left">
        <p-button
          icon="pi pi-bars"
          [text]="true"
          [rounded]="true"
          severity="primary"
          (onClick)="toggleSidebar.emit()"
        />
<!--        <span class="page-title">{{ 'APP.NAME' | translate }}</span>-->
        <span class="page-title">{{ user.storeName }}</span>
      </div>
      <div class="header-right">
        <div class="lang-badge" (click)="localization.toggleLang()">
          {{ localization.currentLang() === 'en' ? 'عربي' : 'EN' }}
        </div>
        <p-button
          [icon]="theme.isDark() ? 'pi pi-sun' : 'pi pi-moon'"
          [text]="true"
          [rounded]="true"
          severity="primary"
          (onClick)="theme.toggle()"
          [pTooltip]="theme.isDark() ? 'Light Mode' : 'Dark Mode'"
        />
        <div class="user-info">
          <p-avatar
            [label]="(user?.name || 'U').charAt(0).toUpperCase()"
            [style]="{ 'background-color': 'var(--primary-500)', color: 'var(--primary-900)' }"
            shape="circle"
          />
          <div class="d-none d-md-block">
            <div class="user-name">{{ user?.name }}</div>
            <div class="user-role">{{ user?.role | titlecase }}</div>
          </div>
        </div>
      </div>
    </header>
  `,
})
export class HeaderComponent {
  @Input() sidebarCollapsed = false;
  @Output() toggleSidebar = new EventEmitter<void>();

  get user() {
    return this.auth.currentUser();
  }

  constructor(
    public localization: LocalizationService,
    public theme: ThemeService,
    private auth: AuthService,
  ) {}
}
