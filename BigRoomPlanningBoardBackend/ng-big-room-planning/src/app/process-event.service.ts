import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { firstValueFrom } from 'rxjs';

import { HubConnection } from '@microsoft/signalr';
import {
  select,
  Store,
} from '@ngrx/store';

import {
  AddPlannedPeriodEvent,
  AddSessionEvent,
  AddSprintEvent,
  AddSquadEvent,
  EditPlannedPeriodEvent,
  EditSprintEvent,
  EditSquadEvent,
  Event,
  IEvent,
  IPlannedPeriod,
  ISession,
  ISprint,
  ISquad,
  PlannedPeriod,
  Session,
  Sprint,
  Squad,
} from './client';
import { HandleErrorService } from './handle-error.service';
import {
  eventAddPlannedPeriod,
  eventAddSession,
  eventAddSprint,
  eventAddSquad,
  eventEditPlannedPeriod,
  eventEditSprint,
  eventEditSquad,
  initializCurrentSeesion,
  setCreateSessionFailed,
  setLastEventId,
} from './store/app.actions';
import { getLastEventId } from './store/app.selectors';

@Injectable({
  providedIn: 'root'
})
export class ProcessEventService {

  constructor(
    private store$: Store<any>,
    private router: Router,
    private handleErrorService: HandleErrorService
  ) { }

  async processEvent(event: IEvent, currentSessionId: string, connection: HubConnection) {

    const instance = Event.fromJS(event)

    const lastEventId = await firstValueFrom(this.store$.pipe(select(getLastEventId)));

    if (lastEventId >= event.eventId) {
      console.log('Dropped duplicate event with id ' + event.eventId)
      return;
    }

    // this one is first, because of the special !isSuccessful event branch. Every other event is sorted alphabetically below
    // the general !isSuccessful check
    if (instance instanceof AddSessionEvent) {

      if (!instance.isSuccessful) {
        if(instance.sessionId === currentSessionId) {
          this.store$.dispatch(setCreateSessionFailed({ failed: true }));
        }
        return;
      }

      const isession: ISession = await connection.invoke('GetSession', instance.sessionId);
      const session = new Session();
      session.init(isession);
      this.store$.dispatch(eventAddSession({ session, eventId: event.eventId }))

      if (session.sessionId === currentSessionId) {
        this.store$.dispatch(initializCurrentSeesion({ session }))
      } 

      return;
    }

    if (!instance.isSuccessful) {
      if (instance.sessionId === currentSessionId) {
        this.handleErrorService.handleFailedEvent(instance);
      }

      this.store$.dispatch(setLastEventId({ lastEventId: event.eventId }));
      return;
    }

    if (instance instanceof AddPlannedPeriodEvent) {
      const iplannedPeriod: IPlannedPeriod = await connection.invoke('GetPlannedPeriod', instance.plannedPeriodId);
      const plannedPeriod = new PlannedPeriod();
      plannedPeriod.init(iplannedPeriod);
      this.store$.dispatch(eventAddPlannedPeriod({ plannedPeriod, eventId: event.eventId }));

      if (event.sessionId === currentSessionId) {
        this.router.navigate([
          '/planned-period',
          plannedPeriod.plannedPeriodId
        ]);
      }

      return;
    }

    if (instance instanceof AddSprintEvent) {
      const isprint: ISprint = await connection.invoke('GetSprint', instance.sprintId);
      const sprint = new Sprint();
      sprint.init(isprint);
      this.store$.dispatch(eventAddSprint({ sprint, eventId: event.eventId }))
      return;
    }

    if (instance instanceof AddSquadEvent) {
      const isquad: ISquad = await connection.invoke('GetSquad', instance.squadId);
      const squad = new Squad();
      squad.init(isquad);
      this.store$.dispatch(eventAddSquad({ squad, eventId: event.eventId }))

      if (event.sessionId === currentSessionId) {
        const returnUrl = this.getReturnUrl();
        this.router.navigate(JSON.parse(returnUrl));
      }

      return;
    }

    if (instance instanceof EditPlannedPeriodEvent) {
      const iplannedPeriod: IPlannedPeriod = await connection.invoke('GetPlannedPeriod', instance.plannedPeriodId);
      const plannedPeriod = new PlannedPeriod();
      plannedPeriod.init(iplannedPeriod);
      this.store$.dispatch(eventEditPlannedPeriod({ plannedPeriod, eventId: event.eventId }));
      
      if (event.sessionId === currentSessionId) {
        this.router.navigate([
          '/planned-period',
          plannedPeriod.plannedPeriodId
        ]);
      }
      return;
    }

    if (instance instanceof EditPlannedPeriodEvent) {
      const iplannedPeriod: IPlannedPeriod = await connection.invoke('GetPlannedPeriod', instance.plannedPeriodId);
      const plannedPeriod = new PlannedPeriod();
      plannedPeriod.init(iplannedPeriod);
      this.store$.dispatch(eventEditPlannedPeriod({ plannedPeriod, eventId: event.eventId }));
      
      if (event.sessionId === currentSessionId) {
        this.router.navigate([
          '/planned-period',
          plannedPeriod.plannedPeriodId
        ]);
      }
      return;
    }

    if(instance instanceof EditSprintEvent) {
      const isprint: ISprint = await connection.invoke('GetSprint', instance.sprintId);
      const sprint = new Sprint();
      sprint.init(isprint);
      this.store$.dispatch(eventEditSprint({ sprint, eventId: event.eventId }));
      return;
    }

    if(instance instanceof EditSquadEvent) {
      const isquad: ISquad = await connection.invoke('GetSquad', instance.squadId);
      const squad = new Squad();
      squad.init(isquad);
      this.store$.dispatch(eventEditSquad({ squad, eventId: event.eventId }));

      if (event.sessionId === currentSessionId) {
        const returnUrl = this.getReturnUrl();
        this.router.navigate(JSON.parse(returnUrl));
      }
      return;
    }

  }

  private getReturnUrl() {
    const query = new URLSearchParams(window.location.search);
    return decodeURI(query.get('returnUrl'));
  }


}
