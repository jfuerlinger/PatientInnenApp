import { Injectable, OnDestroy } from '@angular/core';
import { MsalService, MsalBroadcastService, MSAL_GUARD_CONFIG } from '@azure/msal-angular';
import { InteractionStatus, AuthenticationResult, AuthError, PopupRequest, PublicClientApplication } from '@azure/msal-browser';
import { Observable, map, filter, from, of, catchError, Subject, firstValueFrom, takeUntil } from 'rxjs';
import { loginRequest } from '../auth-config';

@Injectable({
  providedIn: 'root'
})
export class AuthService implements OnDestroy {
  private isAuthenticated = false;
  private readonly destroying$ = new Subject<void>();
  private msalInitialized = false;

  constructor(
    private msalService: MsalService,
    private msalBroadcastService: MsalBroadcastService
  ) {
    // Listen for login/logout events
    this.msalBroadcastService.inProgress$
      .pipe(
        filter((status: InteractionStatus) => status === InteractionStatus.None),
        takeUntil(this.destroying$)
      )
      .subscribe(() => {
        this.checkAndSetActiveAccount();
      });

    // Initialize MSAL
    this.initializeMsal();
  }

  private async initializeMsal(): Promise<void> {
    try {
      // Ensure MSAL is initialized
      await this.msalService.instance.initialize();
      this.msalInitialized = true;
      console.log('MSAL wurde erfolgreich initialisiert');

      // Handle redirect promise
      const result = await this.msalService.instance.handleRedirectPromise();
      if (result) {
        if (result.account) {
          this.msalService.instance.setActiveAccount(result.account);
          this.isAuthenticated = true;
        }
      } else {
        // No result, check if there's an active account
        this.checkAndSetActiveAccount();
      }
    } catch (error) {
      console.error('Fehler bei der Initialisierung von MSAL:', error);
    }
  }

  private checkAndSetActiveAccount(): void {
    // Check if an account is already signed in
    const activeAccount = this.msalService.instance.getActiveAccount();

    if (!activeAccount && this.msalService.instance.getAllAccounts().length > 0) {
      // Set the first account as active if there's no active account
      this.msalService.instance.setActiveAccount(this.msalService.instance.getAllAccounts()[0]);
      this.isAuthenticated = true;
    } else if (activeAccount) {
      this.isAuthenticated = true;
    } else {
      this.isAuthenticated = false;
    }
  }

  async login(): Promise<AuthenticationResult> {
    try {
      if (!this.msalInitialized) {
        console.log('MSAL wird initialisiert...');
        await this.initializeMsal();
      }

      console.log('Login wird ausgeführt...');
      // Verwenden von firstValueFrom statt des veralteten toPromise()
      return await firstValueFrom(this.msalService.loginPopup(loginRequest));
    } catch (error) {
      console.error('Fehler beim Login:', error);
      throw error;
    }
  }

  logout(): void {
    try {
      this.msalService.logout();
      this.isAuthenticated = false;
    } catch (error) {
      console.error('Fehler beim Logout:', error);
    }
  }

  isLoggedIn(): Observable<boolean> {
    try {
      // Check if MSAL is initialized
      if (!this.msalInitialized) {
        return of(false);
      }

      // Check active account
      if (this.msalService.instance.getActiveAccount() !== null) {
        this.isAuthenticated = true;
        return of(true);
      }
      return of(this.isAuthenticated);
    } catch (error) {
      console.error('Fehler beim Überprüfen des Anmeldestatus:', error);
      return of(false);
    }
  }

  getToken(): Observable<string> {
    if (!this.msalInitialized) {
      return of('');
    }

    const account = this.msalService.instance.getActiveAccount();
    if (!account) {
      return of('');
    }

    const tokenRequest = {
      scopes: ['https://graph.microsoft.com/.default'],
      account: account
    };

    return from(this.msalService.acquireTokenSilent(tokenRequest)).pipe(
      map((response: AuthenticationResult) => {
        return response.accessToken;
      }),
      catchError(error => {
        console.error('Fehler beim Abrufen des Tokens:', error);
        return of('');
      })
    );
  }

  ngOnDestroy(): void {
    this.destroying$.next(undefined);
    this.destroying$.complete();
  }
}
