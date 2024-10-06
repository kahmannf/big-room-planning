import create from '@kahmannf/iterable-transforms';
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
  eventAddDependency,
  eventAddOrUpdateSquadSprintStats,
  eventAddPlannedPeriod,
  eventAddRisk,
  eventAddSession,
  eventAddSprint,
  eventAddSquad,
  eventAddTicket,
  eventDeleteDependency,
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
    on(eventAddDependency, (state, action) => ({
        ...state,
        dependencies: [
            ...state.dependencies,
            action.dependency
        ]
    })),
    on(eventAddOrUpdateSquadSprintStats, (state, action) => ({
        ...state,
        squadSprintStats: [
            ...state.squadSprintStats.filter(x => x.sprintId !== action.squadSprintStats.sprintId || x.squadId !== action.squadSprintStats.squadId),
            action.squadSprintStats
        ]
    })),
    on(eventAddPlannedPeriod, (state, action) => ({
        ...state,
        plannedPeriods: [
            ...state.plannedPeriods,
            action.plannedPeriod
        ]
    })),
    on(eventAddRisk, (state, action) => ({
        ...state,
        risks: [
            ...state.risks,
            action.risk
        ]
    })),
    on(eventAddSession, (state, action) => ({
        ...state,
        knownSessions: {
            ...state.knownSessions,
            [action.session.sessionId]: action.session
        },
    })),
    on(eventAddSprint, (state, action) => ({
        ...state,
        sprints: [
            ...state.sprints,
            action.sprint
        ]
    })),
    on(eventAddSquad, (state, action) => ({
        ...state,
        squads: [
            ...state.squads,
            action.squad
        ]
    })),
    on(eventAddTicket, (state, action) => ({
        ...state,
        tickets: [
            ...state.tickets.map(ticket => {
                if (ticket.squadId === action.ticket.squadId && ticket.plannedPeriodId == action.ticket.plannedPeriodId) {
                    return new Ticket({
                        ...ticket,
                        columnOrder: ticket.columnOrder + 1
                    });
                }
                return ticket;
            }),
            action.ticket
        ]
    })),
    on(eventDeleteDependency, (state, action) => ({
        ...state,
        dependencies: state.dependencies.filter(x => x.dependencyId !== action.dependencyId)
    })),
    on(eventDeleteRisk, (state, action) => ({
        ...state,
        risks: state.risks.filter(x => x.riskId !== action.riskId)
    })),
    on(eventDeleteTicket, (state, action) => ({
        ...state,
        tickets: state.tickets.filter(x => x.ticketId !== action.ticketId)
    })),
    on(eventEditPlannedPeriod, (state, action) => ({
        ...state,
        plannedPeriods: state.plannedPeriods
            .map(x =>
                x.plannedPeriodId === action.plannedPeriod.plannedPeriodId
                    ? action.plannedPeriod
                    : x
            )
    })),
    on(eventEditRisk, (state, action) => ({
        ...state,
        risks: state.risks
            .map(x =>
                x.riskId === action.risk.riskId
                    ? action.risk
                    : x
            )
    })),
    on(eventEditSprint, (state, action) => ({
        ...state,
        sprints: state.sprints
            .map(x =>
                x.sprintId === action.sprint.sprintId
                    ? action.sprint
                    : x
            )
    })),
    on(eventEditSquad, (state, action) => ({
        ...state,
        squads: state.squads
            .map(x =>
                x.squadId === action.squad.squadId
                    ? action.squad
                    : x
            )
    })),
    on(eventEditTicket, (state, action) => {

        const targetItem = state.tickets.find(x => x.ticketId === action.ticket.ticketId);
        let tickets: Ticket[];

        if (!equalOrUndefined(targetItem.plannedPeriodId, action.ticket.plannedPeriodId)
            || !equalOrUndefined(targetItem.squadId, action.ticket.squadId)
            || !equalOrUndefined(targetItem.sprintId, action.ticket.sprintId)
            || !equalOrUndefined(targetItem.columnOrder, action.ticket.columnOrder)
        ) {

            const irrelevant: Ticket[] = [];
            let oldColumn: Ticket[] = [];
            let currentColumn: Ticket[] = [];


            const changedColumns = !equalOrUndefined(targetItem.plannedPeriodId, action.ticket.plannedPeriodId)
                || !equalOrUndefined(targetItem.squadId, action.ticket.squadId)
                || !equalOrUndefined(targetItem.sprintId, action.ticket.sprintId);

            for (const ticket of state.tickets) {

                if (ticket === targetItem) {
                    continue;
                }

                if (
                    changedColumns
                    && equalOrUndefined(ticket.plannedPeriodId, targetItem.plannedPeriodId)
                    && equalOrUndefined(ticket.squadId, targetItem.squadId)
                    && equalOrUndefined(ticket.sprintId, targetItem.sprintId)
                ) {
                    oldColumn.push(ticket);
                } else if (
                    equalOrUndefined(ticket.plannedPeriodId, action.ticket.plannedPeriodId)
                    && equalOrUndefined(ticket.squadId, action.ticket.squadId)
                    && equalOrUndefined(ticket.sprintId, action.ticket.sprintId)
                ) {
                    currentColumn.push(ticket);
                } else {
                    irrelevant.push(ticket);
                }
            }

            if (changedColumns) {
                oldColumn = create(oldColumn)
                    .sort(x => x.columnOrder)
                    .toArray()
                    .map((t, i) => new Ticket({ ...t, columnOrder: i }))
            }

            currentColumn = create(currentColumn)
                .sort(x => x.columnOrder)
                .toArray()
                .map((t, i) => new Ticket({
                    ...t,
                     columnOrder: i >= action.ticket.columnOrder
                        ? i + 1
                        : i
                    }))
            
            tickets = [
                ...irrelevant,
                ...oldColumn, // this is empty if it didnt change columns
                ...currentColumn,
                action.ticket
            ]

        } else {
            tickets = state.tickets
                .map(x =>
                    x.ticketId === action.ticket.ticketId
                        ? action.ticket
                        : x
                )
        }

        return {
            ...state,
            tickets
        };
    }),
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


function equalOrUndefined(a: any, b: any): boolean {
    const aUndefined = typeof a === 'undefined' || a === null;
    const bUndefined = typeof b === 'undefined' || b === null;

    if (aUndefined && bUndefined) {
        return true;
    }

    return a === b;
}