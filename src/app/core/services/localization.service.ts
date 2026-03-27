import { Injectable, signal } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Injectable({ providedIn: 'root' })
export class LocalizationService {
    private readonly LANG_KEY = 'pos_lang';
    currentLang = signal<string>(this.loadLang());

    constructor(private translate: TranslateService) {
        translate.addLangs(['en', 'ar']);
        translate.setDefaultLang('en');
    }

    init(): void {
        this.setLang(this.currentLang());
    }

    setLang(lang: string): void {
        this.translate.use(lang);
        this.currentLang.set(lang);
        localStorage.setItem(this.LANG_KEY, lang);
        const html = document.documentElement;
        html.setAttribute('lang', lang);
        html.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');
        document.body.classList.toggle('rtl', lang === 'ar');
    }

    toggleLang(): void {
        this.setLang(this.currentLang() === 'en' ? 'ar' : 'en');
    }

    isRtl(): boolean {
        return this.currentLang() === 'ar';
    }

    private loadLang(): string {
        return localStorage.getItem(this.LANG_KEY) || 'en';
    }
}
