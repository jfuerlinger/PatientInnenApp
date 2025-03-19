import { Injectable, Renderer2, RendererFactory2 } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private renderer: Renderer2;
  private darkMode = new BehaviorSubject<boolean>(false);
  public darkMode$ = this.darkMode.asObservable();
  private readonly THEME_KEY = 'darkModeEnabled';

  constructor(rendererFactory: RendererFactory2) {
    this.renderer = rendererFactory.createRenderer(null, null);
    this.initTheme();
  }

  private initTheme(): void {
    // Überprüfe, ob der Benutzer bereits eine Theme-Präferenz gespeichert hat
    const savedTheme = localStorage.getItem(this.THEME_KEY);
    
    // Überprüfe die Systempräferenz, falls keine Benutzerpräferenz gespeichert ist
    if (savedTheme === null) {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      this.setDarkMode(prefersDark);
    } else {
      this.setDarkMode(savedTheme === 'true');
    }
  }

  public toggleDarkMode(): void {
    this.setDarkMode(!this.darkMode.value);
  }

  public setDarkMode(isDark: boolean): void {
    if (isDark) {
      this.renderer.addClass(document.body, 'dark-theme');
    } else {
      this.renderer.removeClass(document.body, 'dark-theme');
    }

    this.darkMode.next(isDark);
    localStorage.setItem(this.THEME_KEY, isDark.toString());
  }

  public isDarkMode(): boolean {
    return this.darkMode.value;
  }
}