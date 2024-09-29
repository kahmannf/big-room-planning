import {
  createAction,
  props,
} from '@ngrx/store';

import {
  BRPFullData,
  PlannedPeriod,
  Session,
  Squad,
} from '../client';

export const applyFullData = createAction('applyFullData', props<{ fullData: BRPFullData }>())

export const connectionStateChange = createAction('connectionStateChange', props<{ isConnected: boolean, error?: string }>());

export const eventAddPlannedPeriod = createAction('eventAddPlannedPeriod', props<{ plannedPeriod: PlannedPeriod, eventId: number }>());

export const eventAddSession = createAction('eventAddSession', props<{ session: Session, eventId: number }>());

export const eventAddSquad = createAction('eventAddSquad', props<{ squad: Squad, eventId: number }>());

export const eventEditPlannedPeriod = createAction('eventEditPlannedPeriod', props<{ plannedPeriod: PlannedPeriod, eventId: number }>());

export const initializCurrentSeesion = createAction('initializCurrentSeesion', props<{ session: Session }>());

export const setCreateSessionFailed = createAction('createSessionFailed', props<{failed: boolean}>());