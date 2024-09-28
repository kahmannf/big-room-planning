import { createFeatureSelector, createSelector } from "@ngrx/store"
import { AppState } from "./app.reducer"

export const appStateSelector = createFeatureSelector<AppState>("app");

export const getSquads = createSelector(appStateSelector, state => state.squads);

export const getCurrentSession = createSelector(appStateSelector, state => state.currentSession);

export const getKnownSession = createSelector(appStateSelector, state => state.knownSessions);

export const getIsConnected = createSelector(appStateSelector, state => state.isConnected);

export const getConnectionError = createSelector(appStateSelector, state => state.connectionError);

export const getLastEventId = createSelector(appStateSelector, state => state.lastEventId);

export const getCreateSessionFailed = createSelector(appStateSelector, state => state.createSessionFailed);
