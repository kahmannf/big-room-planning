import {
  createReducer,
  on,
} from '@ngrx/store';

import {
  Dependency,
  DependencyBoard,
  PlannedPeriod,
  Risk,
  Session,
  Sprint,
  Squad,
  SquadSprintStats,
  Ticket,
} from '../client';
import {
  applyFullData,
  connectionStateChange,
  eventAddOrUpdateSquadSprintStats,
  eventAddPlannedPeriod,
  eventAddRisk,
  eventAddSession,
  eventAddSprint,
  eventAddSquad,
  eventAddTicket,
  eventDeleteRisk,
  eventDeleteTicket,
  eventEditPlannedPeriod,
  eventEditRisk,
  eventEditSprint,
  eventEditSquad,
  eventEditTicket,
  initializCurrentSeesion as initializCurrentSession,
  setCreateSessionFailed,
  setLastEventId,
} from './app.actions';

export interface AppState {
    squads: Squad[];
    tickets: Ticket[];
    plannedPeriods: PlannedPeriod[];
    dependencies: Dependency[];
    dependencyBoards: DependencyBoard[];
    sprints: Sprint[];
    squadSprintStats: SquadSprintStats[];
    risks: Risk[];
    lastEventId: number;
    currentSession?: Session;
    knownSessions: { [sessionId: string]: Session };
    isConnected: boolean;
    connectionError?: string;
    createSessionFailed: boolean;
}

export const initialAppState: AppState = {
    squads: [],
    dependencies: [],
    dependencyBoards: [],
    lastEventId: 0,
    plannedPeriods: [],
    tickets: [],
    sprints: [],
    squadSprintStats: [],
    risks: [],
    knownSessions: {},
    isConnected: false,
    createSessionFailed: false
};

export const appReducer = createReducer(
    initialAppState,
    on(applyFullData, (state, action) => ({
        ...state,
        dependencies: action.fullData.dependencies ?? [],
        dependencyBoards: action.fullData.dependencyBoards ?? [],
        quarterYears: action.fullData.plannedPeriods ?? [],
        squads: action.fullData.squads ?? [],
        tickets: action.fullData.tickets ?? [],
        sprints: action.fullData.sprints ?? [],
        plannedPeriods: action.fullData.plannedPeriods ?? [],
        squadSprintStats: action.fullData.squadSprintStats ?? [],
        risks: action.fullData.risks ?? [],
        currentSession: state.currentSession ?? action.fullData.ownSession,
        lastEventId: action.fullData.lastEventId
    })),
    on(connectionStateChange, (state, action) => ({
        ...state,
        connectionError: action.error,
        isConnected: action.isConnected
    })),
    on(eventAddOrUpdateSquadSprintStats, (state, action) => ({
        ...state,
        lastEventId: action.eventId,
        squadSprintStats: [
            ...state.squadSprintStats.filter(x => x.sprintId !== action.squadSprintStats.sprintId || x.squadId !== action.squadSprintStats.squadId),
            action.squadSprintStats
        ]
    })),
    on(eventAddPlannedPeriod, (state, action) => ({
        ...state,
        lastEventId: action.eventId,
        plannedPeriods: [
            ...state.plannedPeriods,
            action.plannedPeriod
        ]
    })),
    on(eventAddRisk, (state, action) => ({
        ...state,
        lastEventId: action.eventId,
        risks: [
            ...state.risks,
            action.risk
        ]
    })),
    on(eventAddSession, (state, action) => ({
        ...state,
        lastEventId: action.eventId,
        knownSessions: {
            ...state.knownSessions,
            [action.session.sessionId]: action.session
        },
    })),
    on(eventAddSprint, (state, action) => ({
        ...state,
        lastEventId: action.eventId,
        sprints: [
            ...state.sprints,
            action.sprint
        ]
    })),
    on(eventAddSquad, (state, action) => ({
        ...state,
        lastEventId: action.eventId,
        squads: [
            ...state.squads,
            action.squad
        ]
    })),
    on(eventAddTicket, (state, action) => ({
        ...state,
        lastEventId: action.eventId,
        tickets: [
            ...state.tickets,
            action.ticket
        ]
    })),
    on(eventDeleteRisk, (state, action) => ({
        ...state,
        lastEventId: action.eventId,
        risks: state.risks.filter(x => x.riskId !== action.riskId)
    })),
    on(eventDeleteTicket, (state, action) => ({
        ...state,
        lastEventId: action.eventId,
        tickets: state.tickets.filter(x => x.ticketId !== action.ticketId)
    })),
    on(eventEditPlannedPeriod, (state, action) => ({
        ...state,
        lastEventId: action.eventId,
        plannedPeriods: state.plannedPeriods
            .map(x =>
                x.plannedPeriodId === action.plannedPeriod.plannedPeriodId
                    ? action.plannedPeriod
                    : x
            )
    })),
    on(eventEditRisk, (state, action) => ({
        ...state,
        lastEventId: action.eventId,
        risks: state.risks
            .map(x => 
                x.riskId === action.risk.riskId
                    ? action.risk
                    : x
            )
    })),
    on(eventEditSprint, (state, action) => ({
        ...state,
        lastEventId: action.eventId,
        sprints: state.sprints
            .map(x => 
                x.sprintId === action.sprint.sprintId
                    ? action.sprint
                    : x
            )
    })),
    on(eventEditSquad, (state, action) => ({
        ...state,
        lastEventId: action.eventId,
        squads: state.squads
            .map(x => 
                x.squadId === action.squad.squadId
                    ? action.squad
                    : x
            )
    })),
    on(eventEditTicket, (state, action) => ({
        ...state,
        lastEventId: action.eventId,
        tickets: state.tickets
            .map(x => 
                x.ticketId === action.ticket.ticketId
                    ? action.ticket
                    : x
            )
    })),
    on(initializCurrentSession, (state, action) => ({
        ...state,
        currentSession: action.session,
        createSessionFailed: false
    })),
    on(setCreateSessionFailed, (state, action) => ({
        ...state,
        createSessionFailed: action.failed
    })),
    on(setLastEventId, (state, action) => ({
        ...state,
        lastEventId: action.lastEventId
    }))
)