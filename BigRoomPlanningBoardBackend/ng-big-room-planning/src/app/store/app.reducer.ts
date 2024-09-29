import {
  createReducer,
  on,
} from '@ngrx/store';

import {
  Dependency,
  DependencyBoard,
  PlannedPeriod,
  Session,
  Squad,
  SquadBoard,
  Ticket,
} from '../client';
import {
  applyFullData,
  connectionStateChange,
  eventAddPlannedPeriod,
  eventAddSession,
  eventAddSquad,
  eventEditPlannedPeriod,
  eventEditSquad,
  initializCurrentSeesion as initializCurrentSession,
  setCreateSessionFailed,
} from './app.actions';

export interface AppState {
    squads: Squad[];
    sqaudBoards: SquadBoard[];
    tickets: Ticket[];
    plannedPeriods: PlannedPeriod[];
    dependencies: Dependency[];
    dependencyBoards: DependencyBoard[];
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
    sqaudBoards: [],
    tickets: [],
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
        sqaudBoards: action.fullData.squadBoards ?? [],
        squads: action.fullData.squads ?? [],
        tickets: action.fullData.tickets ?? []
    })),
    on(connectionStateChange, (state, action) => ({
        ...state,
        connectionError: action.error,
        isConnected: action.isConnected
    })),
    on(eventAddPlannedPeriod, (state, action) => ({
        ...state,
        lastEventId: action.eventId,
        plannedPeriods: [
            ...state.plannedPeriods,
            action.plannedPeriod
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
    on(eventAddSquad, (state, action) => ({
        ...state,
        lastEventId: action.eventId,
        squads: [
            ...state.squads,
            action.squad
        ]
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
    on(initializCurrentSession, (state, action) => ({
        ...state,
        currentSession: action.session,
        createSessionFailed: false
    })),
    on(setCreateSessionFailed, (state, action) => ({
        ...state,
        createSessionFailed: action.failed
    }))
)