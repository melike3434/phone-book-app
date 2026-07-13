import { Component, OnInit } from '@angular/core';
import { RouterOutlet, Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { LanguageService } from './services/language.service';
import { ThemeService } from './services/theme.service';
import { AuthService } from './services/auth.service';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, TranslateModule, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  isDarkMode = false;
  isLoggedIn = false;

  constructor(
    public languageService: LanguageService,
    private themeService: ThemeService,
    private authService: AuthService,
    private router: Router,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.languageService.loadSavedLanguage();
    this.themeService.darkMode$.subscribe(isDark => {
      this.isDarkMode = isDark;
    });
    this.authService.isLoggedIn$.subscribe(status => {
      this.isLoggedIn = status;
    });
  }

  toggleTheme(): void {
    this.themeService.toggleDarkMode();
  }

  switchLanguage(lang: string): void {
    this.languageService.switchLanguage(lang);
  }

  logout(): void {
    this.authService.logout();
    this.toastr.info('Çıkış yapıldı!', 'Bilgi');
    this.router.navigate(['/login']);
  }
}