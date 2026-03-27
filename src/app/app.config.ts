import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { routes } from './app.routes';
import { provideTranslateHttpLoader } from '@ngx-translate/http-loader';
import { jwtInterceptor } from './core/interceptors/jwt.interceptor';
import { errorInterceptor } from './core/interceptors/error.interceptor';
import { MessageService, ConfirmationService } from 'primeng/api';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeuix/themes/aura';
import { AppPreset } from '../theme/theme.preset';



export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes, withComponentInputBinding()),
    provideHttpClient(withInterceptors([jwtInterceptor, errorInterceptor])),
    providePrimeNG({
      ripple: true,
      theme: {
        preset: AppPreset,
        options: {
          prefix: 'p',
          darkModeSelector: '.app-dark',
          cssLayer: false,
        },
      },
    }),
    importProvidersFrom(
      TranslateModule.forRoot({
        loader: provideTranslateHttpLoader({
          prefix: './assets/i18n/',
          suffix: '.json',
        }),
      }),
    ),
    MessageService,
    ConfirmationService,
  ],
};


// export const appConfig: ApplicationConfig = {
//   providers: [
//     provideRouter(routes, withComponentInputBinding()),
//     provideHttpClient(withInterceptors([jwtInterceptor, errorInterceptor])),
//     providePrimeNG({
//       ripple: true,
//       theme: {
//         preset: AppPreset,
//         options: {
//           prefix: 'p',
//           darkModeSelector: '.app-dark',
//           cssLayer: {
//             name: 'primeng',
//             order: 'app-reset, primeng, app-styles',
//           },
//         },
//       },
//     }),
//     ThemeService,
//     importProvidersFrom(
//       TranslateModule.forRoot({
//         loader: provideTranslateHttpLoader({
//           prefix: './assets/i18n/',
//           suffix: '.json',
//         }),
//       }),
//     ),
//     MessageService,
//     ConfirmationService,
//   ],
// };
