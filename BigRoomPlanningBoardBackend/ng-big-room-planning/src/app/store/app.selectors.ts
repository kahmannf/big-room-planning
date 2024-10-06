import {
  createFeatureSelector,
  createSelector,
} from '@ngrx/store';

import { AppState } from './app.reducer';

export const appStateSelector = createFeatureSelector<AppState>("app");

export const getSquads = createSelector(appStateSelector, state => state.squads);

export const getCurrentSession = createSelector(appStateSelector, state => state.currentSession);

export const getKnownSession = createSelector(appStateSelector, state => state.knownSessions);

export const getIsConnected = createSelector(appStateSelector, state => state.isConnected);

export const getConnectionError = createSelector(appStateSelector, state => state.connectionError);

export const getLastEventId = createSelector(appStateSelector, state => state.lastEventId);

export const getCreateSessionFailed = createSelector(appStateSelector, state => state.createSessionFailed);

export const getPlannedPeriods = createSelector(appStateSelector, state => state.plannedPeriods);

export const getSprints = createSelector(appStateSelector, state => state.sprints);

export const getTickets = createSelector(appStateSelector, state => state.tickets);

export const getSquadSprintStats = createSelector(appStateSelector, state => state.squadSprintStats);

export const getRisks = createSelector(appStateSelector, state => state.risks);

export const getDependencies = createSelector(appStateSelector, state => state.dependencies);
