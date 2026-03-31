import { Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  constructor(private messageService: MessageService) {}

  success(summary: string, detail?: string) {
    this.show('success', summary, detail);
  }

  error(summary: string, detail?: string) {
    this.show('error', summary, detail);
  }

  warn(summary: string, detail?: string) {
    this.show('warn', summary, detail);
  }

  info(summary: string, detail?: string) {
    this.show('info', summary, detail);
  }

  private show(severity: string, summary: string, detail?: string) {
    this.messageService.add({
      severity,
      summary,
      detail,
      styleClass: 'custom-toast',
    });
  }

  clear() {
    this.messageService.clear();
  }
}
