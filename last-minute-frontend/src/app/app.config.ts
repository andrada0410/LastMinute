/*!
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */
import {bootstrapApplication, provideProtractorTestingSupport} from '@angular/platform-browser';

import {provideRouter} from '@angular/router';

import { importProvidersFrom } from '@angular/core';
import {ApplicationConfig} from '@angular/core';
import {HTTP_INTERCEPTORS, provideHttpClient, withFetch, withInterceptors} from '@angular/common/http';
import routeConfig from './routes';
export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(),
   
  provideProtractorTestingSupport(),
   provideRouter(routeConfig)
]

};
