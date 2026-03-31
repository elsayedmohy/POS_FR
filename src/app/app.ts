import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LocalizationService } from './core/services/localization.service';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { Loader } from './shared/components/loader/loader';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ToastModule, ConfirmDialogModule, Loader],
  template: `
    <p-toast position="top-right"></p-toast>
    <p-confirmDialog />
    <app-loader></app-loader>
    <router-outlet />
  `,
})
export class App implements OnInit {
  constructor(private localization: LocalizationService) {}
  ngOnInit() {
    this.localization.init();
  }
}
