import { Injectable, signal, effect } from '@angular/core';

const STORAGE_KEY = 'app-theme';
const DARK_CLASS = 'app-dark';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  readonly isDark = signal<boolean>(this.#loadPreference());

  constructor() {
    effect(() => {
      const dark = this.isDark();
      document.documentElement.classList.toggle(DARK_CLASS, dark);
      localStorage.setItem(STORAGE_KEY, String(dark));
    });
  }

  toggle(): void {
    this.isDark.update((v) => !v);
  }

  setDark(value: boolean): void {
    this.isDark.set(value);
  }


  #loadPreference(): boolean {
    const stored = localStorage.getItem(STORAGE_KEY);

    if (stored !== null) return stored === 'true';

    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  }
}
