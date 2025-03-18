import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { SecureComponent } from './secure/secure.component';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'secure', component: SecureComponent, canActivate: [authGuard] },
  { path: '**', redirectTo: '' }
];
