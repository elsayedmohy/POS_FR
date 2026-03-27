import { Component, computed } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { HeaderComponent } from '../header/header.component';
import { LocalizationService } from '../../core/services/localization.service';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, SidebarComponent, HeaderComponent, ButtonModule],
  styles: [`
    .app-wrapper {
      display: flex;
      min-height: 100vh;
    }

    .sidebar-area {
      width: var(--sidebar-width);
      flex-shrink: 0;
      transition: width 0.3s;
      position: fixed;
      top: 0;
      bottom: 0;
      left: 0;
      z-index: 100;
    }

    .sidebar-area.collapsed {
      width: var(--sidebar-collapsed-width);
    }

    :host-context(body.rtl) .sidebar-area {
      left: unset !important;
      right: 0 !important;
    }

    .content-wrapper {
      flex: 1;
      margin-left: var(--sidebar-width);
      transition: margin 0.3s;
      display: flex;
      flex-direction: column;
      min-height: 100vh;
    }

    .content-wrapper.collapsed {
      margin-left: var(--sidebar-collapsed-width);
    }

    :host-context(body.rtl) .content-wrapper {
      margin-left: 0;
    }

    :host-context(body.rtl) .content-wrapper .collapsed {
      margin-right: var(--sidebar-collapsed-width);
    }

    .main-content {
      flex: 1;
      padding: 1.5rem;
      padding-top: calc(var(--header-height) + 1.5rem);
    }

    @media (max-width: 768px) {
      .sidebar-area {
        width: 0;
      }
      .content-wrapper {
        margin-left: 0;
      }
      .sidebar-area.collapsed {
        width: var(--sidebar-width);
      }
      .content-wrapper.collapsed {
        margin-left: var(--sidebar-width);
      }
    }
  `],
  template: `
  <div class="app-wrapper">
    <div class="sidebar-area" [class.collapsed]="sidebarCollapsed">
      <app-sidebar [collapsed]="sidebarCollapsed" (collapsedChange)="sidebarCollapsed = $event" />
    </div>
    <div class="content-wrapper" [class.collapsed]="sidebarCollapsed">
      <app-header [sidebarCollapsed]="sidebarCollapsed" (toggleSidebar)="toggleSidebar()" />
      <main class="main-content">
        <router-outlet />
      </main>
    </div>
  </div>
`
})
export class MainLayoutComponent {
  sidebarCollapsed = false;

  toggleSidebar() {
    this.sidebarCollapsed = !this.sidebarCollapsed;
  }
}
