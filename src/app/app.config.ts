import { ApplicationConfig, inject, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { FirebaseApp, initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getStorage, provideStorage } from '@angular/fire/storage';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { provideAppCheck, ReCaptchaV3Provider, AppCheckOptions } from '@angular/fire/app-check';
import { routes } from './app.routes';
import { provideAuth } from '@angular/fire/auth';
import { getAuth } from 'firebase/auth';
import { environment } from '../environments/environment';
import { initializeAppCheck } from 'firebase/app-check';

const firebaseConfig = environment.firebaseConfig;

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideFirebaseApp(() => initializeApp(firebaseConfig)),
    provideStorage(() => getStorage()),
    provideFirestore(() => getFirestore()),
    provideAuth(() => getAuth()),
    // provideAppCheck(() => initializeAppCheck(initializeApp(firebaseConfig), { // Initialize App Check
    //   provider: new ReCaptchaV3Provider(environment.recaptchaSiteKey),
    //   isTokenAutoRefreshEnabled: true, // Recommended
    // })),
    provideAppCheck(() => {
      const app = inject(FirebaseApp);
      return initializeAppCheck(app, {
        provider: new ReCaptchaV3Provider(environment.recaptchaSiteKey),
        isTokenAutoRefreshEnabled: true, // Recommended
      });
    }),
  ],
};
