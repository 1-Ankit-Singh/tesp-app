import {
  ApplicationConfig,
  importProvidersFrom,
  inject,
  provideZoneChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import {
  FirebaseApp,
  initializeApp,
  provideFirebaseApp,
} from '@angular/fire/app';
import { getStorage, provideStorage } from '@angular/fire/storage';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import {
  provideAppCheck,
  ReCaptchaV3Provider,
  AppCheckOptions,
} from '@angular/fire/app-check';
import { routes } from './app.routes';
import { provideAuth } from '@angular/fire/auth';
import { getAuth } from 'firebase/auth';
import { environment } from '../environments/environment';
import { initializeAppCheck } from 'firebase/app-check';
import { NgxSpinnerModule } from 'ngx-spinner';
import { provideToastr } from 'ngx-toastr';
import { provideAnimations } from '@angular/platform-browser/animations';

const firebaseConfig = environment.firebaseConfig;

export const TOASTR_TIME_OUT = 10000; // 10 seconds
export const TOASTR_POSITION_CLASS = 'toast-bottom-right'; // Position of the toast

export const appConfig: ApplicationConfig = {
  providers: [
    importProvidersFrom(NgxSpinnerModule),
    provideToastr({
      timeOut: TOASTR_TIME_OUT,
      positionClass: TOASTR_POSITION_CLASS,
      preventDuplicates: true,
      closeButton: true,
      progressBar: true,
      newestOnTop: true,
    }),
    provideAnimations(), 
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideFirebaseApp(() => initializeApp(firebaseConfig)),
    provideStorage(() => getStorage()),
    provideFirestore(() => getFirestore()),
    provideAuth(() => getAuth()),
    provideAppCheck(() =>
      initializeAppCheck(initializeApp(firebaseConfig), {
        provider: new ReCaptchaV3Provider(environment.recaptchaSiteKey),
        isTokenAutoRefreshEnabled: true, // Recommended
      })
    ),
    // provideAppCheck(() => {
    //   const app = inject(FirebaseApp); // const app = initializeApp(firebaseConfig);
    //   return initializeAppCheck(app, {
    //     provider: new ReCaptchaV3Provider(environment.recaptchaSiteKey),
    //     isTokenAutoRefreshEnabled: true, // Recommended
    //   });
    // }),
  ],
};
