import { LogLevel, Configuration, BrowserCacheLocation } from '@azure/msal-browser';

/**
 * Konfiguration für Microsoft Authentication Library (MSAL)
 *
 * Hinweis: Folgende Schritte sind nötig, um die Werte zu erhalten:
 * 1. Registrieren Sie eine neue Anwendung im Microsoft Entra Admin Center (https://entra.microsoft.com)
 * 2. Erstellen Sie einen neuen External ID Benutzerfluss oder eine benutzerdefinierte Richtlinie
 * 3. Tragen Sie die erhaltenen Werte hier ein
 */
export const msalConfig: Configuration = {
  auth: {
    clientId: 'd4305d99-dc45-4784-ab62-50b9933f7f33',             // Ersetzen Sie dies durch Ihre Client/Application ID
    authority: 'https://fujoexternalidtest.ciamlogin.com/273cf506-af47-4e49-8f72-025eb6fa6f72',
    knownAuthorities: ['fujoexternalidtest.ciamlogin.com'], // Bekannte B2C-Authority
    redirectUri: 'http://localhost:4200',  // Explizit die vollständige URL angeben
    navigateToLoginRequestUrl: true,
    postLogoutRedirectUri: 'http://localhost:4200'
  },
  cache: {
    cacheLocation: BrowserCacheLocation.LocalStorage,
    storeAuthStateInCookie: true  // Wichtig für IE11/Edge und CORS
  },
  system: {
    allowRedirectInIframe: true,
    loggerOptions: {
      loggerCallback: (level: LogLevel, message: string) => {
        if (level === LogLevel.Error) {
          console.error(message);
        }
        if (level === LogLevel.Warning) {
          console.warn(message);
        }
      },
      logLevel: LogLevel.Verbose,
      piiLoggingEnabled: false
    }
  }
};

/**
 * Anforderungsbereiche für die Authentifizierung
 * Dies sind die Berechtigungen, die Ihre App anfordert.
 * Für eine einfache Benutzerauthentifizierung sind 'openid' und 'profile' ausreichend.
 */
export const loginRequest = {
  scopes: ['openid', 'profile', 'email']  // Email-Scope hinzugefügt für bessere Benutzeridentifikation
};

/**
 * Anwendungsspezifische Bereichsanforderungen
 * Falls Ihre Anwendung auf Microsoft Graph oder Ihre eigenen APIs zugreifen muss,
 * definieren Sie hier die benötigten Bereiche.
 */
export const apiRequest = {
  scopes: ['https://graph.microsoft.com/.default']
};
