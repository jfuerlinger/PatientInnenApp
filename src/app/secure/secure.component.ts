import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-secure',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './secure.component.html',
  styleUrl: './secure.component.css'
})
export class SecureComponent implements OnInit {
  userName: string = '';

  constructor(private authService: AuthService) {}

  ngOnInit() {
    // Hier könnten Sie Daten laden, die nur für authentifizierte Benutzer verfügbar sind
    this.getUserInfo();
  }

  getUserInfo() {
    // In einer realen Anwendung würden Sie hier Benutzerdaten aus einem API abrufen
    // z.B. mit this.authService.getToken() und dann einem HTTP-Request
  }
}
