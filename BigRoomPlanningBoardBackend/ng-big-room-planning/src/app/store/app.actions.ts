import {
  createAction,
  props,
} from '@ngrx/store';

import {
  BRPFullData,
  PlannedPeriod,
  Risk,
  Session,
  Sprint,
  Squad,
  SquadSprintStats,
  Ticket,
} from '../client';

export const applyFullData = createAction('applyFullData', props<{ fullData: BRPFullData }>())

export const connectionStateChange = createAction('connectionStateChange', props<{ isConnected: boolean, error?: string }>());

export const eventAddOrUpdateSquadSprintStats = createAction('eventAddOrUpdateSquadSprintStats', props<{ squadSprintStats: SquadSprintStats, eventId: number }>());

export const eventAddPlannedPeriod = createAction('eventAddPlannedPeriod', props<{ plannedPeriod: PlannedPeriod, eventId: number }>());

export const eventAddRisk = createAction('eventAddRisk', props<{ risk: Risk, eventId: number }>());

export const eventAddSession = createAction('eventAddSession', props<{ session: Session, eventId: number }>());

export const eventAddSprint = createAction('eventAddSprint', props<{ sprint: Sprint, eventId: number }>());

export const eventAddSquad = createAction('eventAddSquad', props<{ squad: Squad, eventId: number }>());

export const eventAddTicket = createAction('eventAddTicket', props<{ ticket: Ticket, eventId: number }>());

export const eventDeleteRisk = createAction('eventDeleteRisk', props<{ riskId: number, eventId: number }>());

export const eventDeleteTicket = createAction('eventDeleteTicket', props<{ ticketId: number, eventId: number }>());

export const eventEditPlannedPeriod = createAction('eventEditPlannedPeriod', props<{ plannedPeriod: PlannedPeriod, eventId: number }>());

export const eventEditRisk = createAction('eventEditRisk', props<{ risk: Risk, eventId: number }>());

export const eventEditSprint = createAction('eventEditSprint', props<{ sprint: Sprint, eventId: number }>());

export const eventEditSquad = createAction('eventEditSquad', props<{ squad: Squad, eventId: number }>());

export const eventEditTicket = createAction('eventEditTicket', props<{ ticket: Ticket, eventId: number }>());

export const initializCurrentSeesion = createAction('initializCurrentSeesion', props<{ session: Session }>());

export const setCreateSessionFailed = createAction('createSessionFailed', props<{failed: boolean}>());

export const setLastEventId = createAction('setLastEventId', props<{ lastEventId: number }>());