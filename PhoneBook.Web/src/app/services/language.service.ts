import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {
  private currentLang = 'tr';

  constructor(private translate: TranslateService) {
    this.translate.setDefaultLang('tr');
    this.translate.use('tr');
  }

  switchLanguage(lang: string): void {
    this.currentLang = lang;
    this.translate.use(lang);
    // Dil tercihini localStorage'a kaydet (sayfa yenilense de hatırlasın)
    localStorage.setItem('selectedLanguage', lang);
  }

  getCurrentLanguage(): string {
    return this.currentLang;
  }

  // Sayfa yüklendiğinde kaydedilmiş dil tercihini yükle
  loadSavedLanguage(): void {
    const savedLang = localStorage.getItem('selectedLanguage');
    if (savedLang) {
      this.currentLang = savedLang;
      this.translate.use(savedLang);
    }
  }
}