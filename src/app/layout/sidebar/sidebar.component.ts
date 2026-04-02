import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { TooltipModule } from 'primeng/tooltip';
import { AuthService } from '../../core/services/auth.service';
import { LocalizationService } from '../../core/services/localization.service';

interface NavItem {
    label: string;
    icon: string;
    route: string;
    adminOnly?: boolean;
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, TranslateModule, TooltipModule],
  styles: [
    `
      .sidebar {
        height: 100%;
        background: var(--surface-card);
        border-right: 1px solid var(--surface-border);
        display: flex;
        flex-direction: column;
        overflow: hidden;
        transition: all 0.3s ease;
      }
      :host-context(body.rtl) .sidebar {
        left: unset !important;
        right: 0 !important;
        border-right: none;
        border-left: 1px solid var(--surface-border);
      }
      .sidebar-brand {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        padding: 1.25rem 1rem;
        border-bottom: 1px solid var(--surface-border);
        .brand-icon {
          width: 40px;
          height: 40px;
          background: var(--primary-500);
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 1.25rem;
          flex-shrink: 0;
        }
        .brand-name {
          font-weight: 700;
          font-size: 1.1rem;
          color: var(--text-color);
          white-space: nowrap;
          overflow: hidden;
        }
      }
      .nav-list {
        flex: 1;
        padding: 1rem 0.75rem;
        overflow-y: auto;
      }
      .nav-section-label {
        font-size: 0.7rem;
        font-weight: 600;
        color: var(--text-color-secondary);
        text-transform: uppercase;
        letter-spacing: 0.75px;
        padding: 0.5rem 0.75rem;
        margin-top: 0.5rem;
        white-space: nowrap;
        overflow: hidden;
      }
      .nav-item {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        padding: 0.75rem;
        border-radius: 10px;
        text-decoration: none;
        color: var(--text-color-secondary);
        font-weight: 500;
        font-size: 0.9rem;
        transition: all 0.2s ease;
        margin-bottom: 2px;
        white-space: nowrap;
        overflow: hidden;
        i {
          font-size: 1.1rem;
          flex-shrink: 0;
          width: 24px;
          text-align: center;
        }
        .nav-label {
          overflow: hidden;
        }
        &:hover {
          background: var(--primary-50);
          color: var(--primary-600);
        }
        &.active {
          background: var(--primary-50);
          color: var(--primary-600);
          font-weight: 600;
          box-shadow: inset 3px 0 0 var(--primary-500);
        }
        :host-context(body.rtl) &.active {
          box-shadow: inset -3px 0 0 var(--primary-500);
        }
      }
      .sidebar-footer {
        padding: 1rem 0.75rem;
        border-top: 1px solid var(--surface-border);
      }
      .logout-btn {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        padding: 0.75rem;
        border-radius: 10px;
        cursor: pointer;
        color: var(--red-500);
        font-weight: 500;
        font-size: 0.9rem;
        transition: all 0.2s;
        white-space: nowrap;
        overflow: hidden;
        i {
          font-size: 1.1rem;
          flex-shrink: 0;
          width: 24px;
          text-align: center;
        }
        &:hover {
          background: var(--red-50);
        }
      }
    `,
  ],
  template: `
    <nav class="sidebar">
      <div class="sidebar-brand">
        <div class="brand-icon"><i class="pi pi-shopping-cart"></i></div>
        <span class="brand-name" *ngIf="!collapsed">{{ 'APP.NAME' | translate }}</span>
      </div>

      <div class="nav-list">
        <div class="nav-section-label" *ngIf="!collapsed">{{ 'NAV.DASHBOARD' | translate }}</div>
        <a
          *ngFor="let item of mainItems"
          [routerLink]="item.route"
          routerLinkActive="active"
          class="nav-item"
          [pTooltip]="collapsed ? (item.label | translate) : ''"
          tooltipPosition="right"
        >
          <i [class]="item.icon"></i>
          <span class="nav-label" *ngIf="!collapsed">{{ item.label | translate }}</span>
        </a>

        @if (!collapsed && isAdmin) {
          <div class="nav-section-label" style="margin-top: 1rem;">Admin</div>
        }
        @if (isAdmin) {
          <ng-container>
            @for (item of adminItems; track $index) {
              <a
                [routerLink]="item.route"
                routerLinkActive="active"
                class="nav-item"
                [pTooltip]="collapsed ? (item.label | translate) : ''"
                tooltipPosition="right"
              >
                <i [class]="item.icon"></i>
                @if (!collapsed) {
                  <span class="nav-label">{{ item.label | translate }}</span>
                }
              </a>
            }
          </ng-container>
        }
      </div>

      <div class="sidebar-footer">
        <div
          class="logout-btn"
          (click)="logout()"
          [pTooltip]="collapsed ? ('NAV.LOGOUT' | translate) : ''"
          tooltipPosition="right"
        >
          <i class="pi pi-sign-out"></i>
          @if (!collapsed) {
          <span >{{ 'NAV.LOGOUT' | translate }}</span>
          }
        </div>
      </div>
    </nav>
  `,
})
export class SidebarComponent {
  @Input() collapsed = false;
  @Output() collapsedChange = new EventEmitter<boolean>();

  mainItems: NavItem[] = [
    { label: 'NAV.DASHBOARD', icon: 'pi pi-home', route: '/dashboard' },
    { label: 'NAV.POS', icon: 'pi pi-shopping-cart', route: '/pos' },
    { label: 'NAV.SALES', icon: 'pi pi-receipt', route: '/sales' },
    { label: 'NAV.PRODUCTS', icon: 'pi pi-box', route: '/products' },
    { label: 'NAV.CATEGORIES', icon: 'pi pi-tag', route: '/categories' },
  ];

  adminItems: NavItem[] = [
    { label: 'NAV.USERS', icon: 'pi pi-users', route: '/users' },
    { label: 'NAV.SETTINGS', icon: 'pi pi-cog', route: '/settings' },
  ];

  get isAdmin() {
    return this.auth.isAdmin();
  }

  constructor(private auth: AuthService) {}

  logout() {
    this.auth.logout();
  }
}
