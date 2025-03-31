import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getStorage, provideStorage } from '@angular/fire/storage';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { routes } from './app.routes';

const firebaseConfig = {
  apiKey: "AIzaSyA6YhnY77c1tDIELLj_Tnai3-66ZVUZNdc",
  authDomain: "quickshop-1b8b2.firebaseapp.com",
  projectId: "quickshop-1b8b2",
  storageBucket: "quickshop-1b8b2.appspot.com",
  messagingSenderId: "453095755602",
  appId: "1:453095755602:web:f5c2ebd1938660b99cf48b",
  measurementId: "G-NRDE57KMLW"
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }), 
    provideRouter(routes), 
    provideFirebaseApp(() => initializeApp(firebaseConfig)),
    provideStorage(() => getStorage()),
    provideFirestore(() => getFirestore()),
  ]
};
