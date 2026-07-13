import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isLoggedInSubject = new BehaviorSubject<boolean>(false);
  isLoggedIn$: Observable<boolean> = this.isLoggedInSubject.asObservable();

  constructor() {
    const saved = localStorage.getItem('isLoggedIn');
    if (saved === 'true') {
      this.isLoggedInSubject.next(true);
    }
  }

  login(): void {
    this.isLoggedInSubject.next(true);
    localStorage.setItem('isLoggedIn', 'true');
  }

  logout(): void {
    this.isLoggedInSubject.next(false);
    localStorage.removeItem('isLoggedIn');
  }

  isLoggedIn(): boolean {
    return this.isLoggedInSubject.value;
  }
}