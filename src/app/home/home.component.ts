import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  constructor(public authService: AuthService) {}

  async login() {
    try {
      await this.authService.login();
    } catch (error) {
      console.error('Login fehlgeschlagen:', error);
    }
  }

  logout() {
    this.authService.logout();
  }
}
