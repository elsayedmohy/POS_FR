import { Injectable, signal } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class LoaderService {
  private _loading = signal(false);

  loading = this._loading.asReadonly();

  show() {
    this._loading.set(true);
  }

  hide() {
    this._loading.set(false);
  }
}
