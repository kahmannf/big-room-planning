/// <reference types="@angular/localize" />

import { bootstrapApplication } from '@angular/platform-browser';
import { getAppConfig } from './app/app.config';
import { AppComponent } from './app/app.component';

const appConfig = getAppConfig();

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));

