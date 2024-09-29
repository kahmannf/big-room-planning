import {
  ApplicationConfig,
  provideZoneChangeDetection,
} from '@angular/core';
import { provideNativeDateAdapter } from '@angular/material/core';
import {
  provideAnimationsAsync,
} from '@angular/platform-browser/animations/async';
import { provideRouter } from '@angular/router';

import { provideEffects } from '@ngrx/effects';
import {
  Action,
  ActionReducer,
  MetaReducer,
  provideStore,
} from '@ngrx/store';

import { routes } from './app.routes';
import {
  appReducer,
  AppState,
} from './store/app.reducer';

interface State {
  app: AppState;
}

const storageId = 'appState';

const statePersistence: MetaReducer<State, Action<string>> = (reducer: ActionReducer<State, Action<string>>) => {
  return (state, action) => {
    const result = reducer(state, action);
    // localStorage.setItem(storageId, JSON.stringify(result));
    return result;
  }
}

export const getAppConfig: () => ApplicationConfig = () => {

  // const initialStateString = localStorage.getItem(storageId);

  // let initialState: undefined | { app: AppState };

  // if (initialStateString) {
  //   initialState = JSON.parse(initialStateString)
  // }

  return {
    providers: [
      provideZoneChangeDetection({ eventCoalescing: true }),
      provideRouter(routes),
      provideAnimationsAsync(),
      provideNativeDateAdapter(),
      provideStore<State>({
        app: appReducer
      }, {
        // initialState,
        metaReducers: [statePersistence]
      }),
      provideEffects()
    ]
  }
};
