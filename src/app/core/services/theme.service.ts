import { Injectable, signal, effect } from '@angular/core';

const STORAGE_KEY = 'app-theme';
const DARK_CLASS = 'app-dark';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  /** Reactive signal — true = dark mode active */
  readonly isDark = signal<boolean>(this.#loadPreference());

  constructor() {
    // Keep the DOM class and localStorage in sync whenever signal changes
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

  // ─── Private ──────────────────────────────────────────────────────────────

  #loadPreference(): boolean {
    const stored = localStorage.getItem(STORAGE_KEY);

    // 1. Honour stored preference
    if (stored !== null) return stored === 'true';

    // 2. Fall back to OS preference
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  }
}
