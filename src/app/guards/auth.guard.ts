import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { map, Observable, catchError, of, take, switchMap, from } from 'rxjs';

export const authGuard: CanActivateFn = (route, state): Observable<boolean> => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.isLoggedIn().pipe(
    take(1),
    switchMap(isLoggedIn => {
      if (isLoggedIn) {
        return of(true);
      } else {
        // Versuchen, sich anzumelden
        console.log('Benutzer ist nicht angemeldet, starte Login-Prozess...');
        return from(authService.login().then(
          () => {
            console.log('Login erfolgreich');
            return true;
          },
          (error) => {
            console.error('Login fehlgeschlagen', error);
            router.navigate(['/']);
            return false;
          }
        ));
      }
    }),
    catchError((error) => {
      console.error('Fehler im Auth-Guard', error);
      router.navigate(['/']);
      return of(false);
    })
  );
};
