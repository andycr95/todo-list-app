import { bootstrapApplication } from '@angular/platform-browser';
import { RouteReuseStrategy, provideRouter, withPreloading, PreloadAllModules } from '@angular/router';
import { IonicRouteStrategy, provideIonicAngular } from '@ionic/angular/standalone';
import { IonicStorageModule, Storage } from '@ionic/storage-angular';
import { routes } from './app/app.routes';
import { AppComponent } from './app/app.component';
import { addIcons } from 'ionicons';
import { addOutline, trashOutline, createOutline, settingsOutline, checkmarkOutline, happyOutline } from 'ionicons/icons';
import { environment } from './environments/environment';
import { enableProdMode, importProvidersFrom } from '@angular/core';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getRemoteConfig, provideRemoteConfig } from '@angular/fire/remote-config';

// Registrar los iconos
addIcons({
  'add-outline': addOutline,
  'trash': trashOutline,
  'create': createOutline,
  'settings-outline': settingsOutline,
  'checkmark-outline': checkmarkOutline,
  'happy': happyOutline
});

if (environment.production) {
  enableProdMode();
}

bootstrapApplication(AppComponent, {
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    provideIonicAngular(),
    provideRouter(routes, withPreloading(PreloadAllModules)),
    importProvidersFrom(IonicStorageModule.forRoot()),
    provideFirebaseApp(() => initializeApp(environment.firebase)), provideRemoteConfig(() => getRemoteConfig()),
  ],
});
