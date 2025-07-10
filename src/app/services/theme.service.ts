import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  constructor() {}

  private darkModeClass = 'dark';

  enableDark() {
    document.body.classList.add(this.darkModeClass);
    localStorage.setItem('theme', 'dark');
  }

  enableLight() {
    document.body.classList.remove(this.darkModeClass);
    localStorage.setItem('theme', 'light');
  }

  toggleTheme() {
    const isDark = document.body.classList.contains(this.darkModeClass);
    isDark ? this.enableLight() : this.enableDark();
  }

  loadStoredTheme() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      this.enableDark();
    } else {
      this.enableLight();
    }
  }
}
