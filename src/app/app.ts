import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LocalizationService } from './core/services/localization.service';
import { ThemeService } from './core/services/theme.service';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastService } from './core/services/toast.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ToastModule, ConfirmDialogModule],
  template: `
    <p-toast position="top-right"></p-toast>
    <p-confirmDialog />
    <router-outlet />
  `,
})
export class App implements OnInit {
  constructor(
    private localization: LocalizationService
  ) {}

  ngOnInit() {
    this.localization.init();
  }
}
