import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { TranslateModule } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, RouterModule, TranslateModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  isLoading = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private toastr: ToastrService
  ) {}

  onLogin(): void {
    this.isLoading = true;
    // Simüle edilmiş giriş (1 saniye bekle)
    setTimeout(() => {
      this.authService.login();
      this.isLoading = false;
      this.toastr.success('Hoş geldiniz!', 'Başarılı');
      this.router.navigate(['/']);
    }, 1000);
  }
}