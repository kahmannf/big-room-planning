import {
  createAction,
  props,
} from '@ngrx/store';

import {
  BRPFullData,
  Dependency,
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

export const eventAddDependency = createAction('eventAddDependency', props<{ dependency: Dependency }>());

export const eventAddOrUpdateSquadSprintStats = createAction('eventAddOrUpdateSquadSprintStats', props<{ squadSprintStats: SquadSprintStats }>());

export const eventAddPlannedPeriod = createAction('eventAddPlannedPeriod', props<{ plannedPeriod: PlannedPeriod }>());

export const eventAddRisk = createAction('eventAddRisk', props<{ risk: Risk }>());

export const eventAddSession = createAction('eventAddSession', props<{ session: Session }>());

export const eventAddSprint = createAction('eventAddSprint', props<{ sprint: Sprint }>());

export const eventAddSquad = createAction('eventAddSquad', props<{ squad: Squad }>());

export const eventAddTicket = createAction('eventAddTicket', props<{ ticket: Ticket }>());

export const eventDeleteDependency = createAction('eventDeleteDependency', props<{ dependencyId: number }>());

export const eventDeleteRisk = createAction('eventDeleteRisk', props<{ riskId: number }>());

export const eventDeleteTicket = createAction('eventDeleteTicket', props<{ ticketId: number }>());

export const eventEditPlannedPeriod = createAction('eventEditPlannedPeriod', props<{ plannedPeriod: PlannedPeriod }>());

export const eventEditRisk = createAction('eventEditRisk', props<{ risk: Risk }>());

export const eventEditSprint = createAction('eventEditSprint', props<{ sprint: Sprint }>());

export const eventEditSquad = createAction('eventEditSquad', props<{ squad: Squad }>());

export const eventEditTicket = createAction('eventEditTicket', props<{ ticket: Ticket }>());

export const initializCurrentSeesion = createAction('initializCurrentSeesion', props<{ session: Session }>());

export const setCreateSessionFailed = createAction('createSessionFailed', props<{failed: boolean}>());

export const setLastEventId = createAction('setLastEventId', props<{ lastEventId: number }>());