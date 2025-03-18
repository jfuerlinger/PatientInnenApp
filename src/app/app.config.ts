import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { routes } from './app.routes';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

// MSAL Imports
import { MsalGuard, MsalInterceptor, MsalBroadcastService, MsalInterceptorConfiguration, MsalService, MSAL_GUARD_CONFIG, MSAL_INSTANCE, MSAL_INTERCEPTOR_CONFIG } from '@azure/msal-angular';
import { InteractionType, IPublicClientApplication, PublicClientApplication, BrowserCacheLocation, LogLevel } from '@azure/msal-browser';
import { msalConfig } from './auth-config';

// MSAL Factory
export function MSALInstanceFactory(): IPublicClientApplication {
  const config = {
    auth: {
      ...msalConfig.auth,
      redirectUri: window.location.origin,
    },
    cache: {
      cacheLocation: BrowserCacheLocation.LocalStorage,
      storeAuthStateInCookie: false,
    },
    system: {
      allowRedirectInIframe: true, // Für bessere Kompatibilität in verschiedenen Browsern
      loggerOptions: {
        loggerCallback: (level: LogLevel, message: string) => {
          if (level === LogLevel.Error) {
            console.error(message);
          } else if (level === LogLevel.Warning) {
            console.warn(message);
          } else {
            console.log(message);
          }
        },
        logLevel: LogLevel.Info,
        piiLoggingEnabled: false
      }
    }
  };

  try {
    return new PublicClientApplication(config);
  } catch (error) {
    console.error('Fehler bei der MSAL-Initialisierung:', error);
    // Fallback-Konfiguration, wenn die ursprüngliche fehlschlägt
    return new PublicClientApplication({
      auth: {
        clientId: msalConfig.auth.clientId || 'default-client-id',
        redirectUri: window.location.origin,
      }
    });
  }
}

// Interceptor Configuration
export function MSALInterceptorConfigFactory(): MsalInterceptorConfiguration {
  const protectedResourceMap = new Map<string, Array<string>>();
  protectedResourceMap.set('https://graph.microsoft.com/v1.0/me', ['user.read']);

  return {
    interactionType: InteractionType.Popup,
    protectedResourceMap
  };
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes, withComponentInputBinding()),
    provideHttpClient(withInterceptorsFromDi()),

    // MSAL providers
    {
      provide: MSAL_INSTANCE,
      useFactory: MSALInstanceFactory
    },
    MsalService,
    MsalBroadcastService,
    {
      provide: MSAL_INTERCEPTOR_CONFIG,
      useFactory: MSALInterceptorConfigFactory
    },
    MsalGuard
  ]
};
