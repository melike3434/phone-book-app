import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AgeService {
  calculateAge(birthDate: Date): number {
    if (!birthDate) return 0;
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  }

  getDaysUntilBirthday(birthDate: Date): number {
    if (!birthDate) return 0;
    const today = new Date();
    const birth = new Date(birthDate);
    birth.setFullYear(today.getFullYear());
    if (birth < today) birth.setFullYear(today.getFullYear() + 1);
    const diff = birth.getTime() - today.getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  }
}