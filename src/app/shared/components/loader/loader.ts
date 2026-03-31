import { Component, inject } from '@angular/core';
import { LoaderService } from '../../../core/services/loader.service';

@Component({
  selector: 'app-loader',
  standalone: true,
  imports: [],
  template: `
    @if (loading()) {
      <div class="overlay">
        <div class="spinner"></div>
      </div>
    }
  `,
  styles: [
    `
      .overlay {
        position: fixed;
        inset: 0;
        background: rgba(0, 0, 0, 0.3);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 9999;
      }

      .spinner {
        width: 40px;
        height: 40px;
        border: 4px solid #ccc;
        border-top-color: black;
        border-radius: 50%;
        animation: spin 1s linear infinite;
      }

      @keyframes spin {
        to {
          transform: rotate(360deg);
        }
      }
    `,
  ],
})
export class Loader {
  private loader = inject(LoaderService);
  loading = this.loader.loading;
}
