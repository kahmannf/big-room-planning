import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { firstValueFrom } from 'rxjs';

import { HubConnection } from '@microsoft/signalr';
import {
  select,
  Store,
} from '@ngrx/store';

import {
  AddOrUpdateSquadSprintStatsEvent,
  AddPlannedPeriodEvent,
  AddRiskEvent,
  AddSessionEvent,
  AddSprintEvent,
  AddSquadEvent,
  AddTicketEvent,
  DeleteRiskEvent,
  DeleteTicketEvent,
  EditPlannedPeriodEvent,
  EditRiskEvent,
  EditSprintEvent,
  EditSquadEvent,
  EditTicketEvent,
  Event,
  ISession,
  PlannedPeriod,
  Risk,
  Session,
  Sprint,
  Squad,
  SquadSprintStats,
  Ticket,
} from './client';
import { HandleErrorService } from './handle-error.service';
import {
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
  initializCurrentSeesion,
  setCreateSessionFailed,
  setLastEventId,
} from './store/app.actions';
import { getLastEventId } from './store/app.selectors';

@Injectable({
  providedIn: 'root'
})
export class ProcessEventService {

  waitingForEventsCount = 0;

  constructor(
    private store$: Store<any>,
    private router: Router,
    private handleErrorService: HandleErrorService
  ) { }

  async processEvent(event: Event, currentSessionId: string, connection: HubConnection) {

    const lastEventId = await firstValueFrom(this.store$.pipe(select(getLastEventId)));

    if (lastEventId >= event.eventId) {
      console.log('Dropped duplicate event with id ' + event.eventId)
      return;
    }

    if (event.isProcessed) {
      this.store$.dispatch(setLastEventId({ lastEventId: event.eventId }));
    }
    
    if (this.isServerRequiredEvent(event)) {
      if(!event.isProcessed) {
        
        if (this.waitingForEventsCount === 0) {
          this.showLoadingSpinner();
        } 
        this.waitingForEventsCount++;
        return;

      } else {
        this.waitingForEventsCount--;
        
        if (this.waitingForEventsCount === 0) {
          this.hideLoadingSpinner();
        }
      }

    } else {
      // skip own events that have been processed
      if(event.isProcessed && event.sessionId === currentSessionId) {
        return;
      }
    }

    // this one is first, because of the special !isSuccessful event branch. Every other event is sorted alphabetically below
    // the general !isSuccessful check
    if (event instanceof AddSessionEvent) {

      if (!event.isSuccessful) {
        if(event.sessionId === currentSessionId) {
          this.store$.dispatch(setCreateSessionFailed({ failed: true }));
        }
        return;
      }

      const isession: ISession = await connection.invoke('GetSession', event.sessionId);
      const session = new Session();
      session.init(isession);
      this.store$.dispatch(eventAddSession({ session }))

      if (session.sessionId === currentSessionId) {
        this.store$.dispatch(initializCurrentSeesion({ session }))
      } 

      return;
    }

    if (event.isProcessed && !event.isSuccessful) {
      if (event.sessionId === currentSessionId) {
        this.handleErrorService.handleFailedEvent(event);
      }

      return;
    }


    if (event instanceof AddOrUpdateSquadSprintStatsEvent) {
      const squadSprintStats = SquadSprintStats.fromJS(event)

      this.store$.dispatch(eventAddOrUpdateSquadSprintStats({ squadSprintStats }));
      return;
    }

    if (event instanceof AddPlannedPeriodEvent) {
      const plannedPeriod = new PlannedPeriod({
        ...event
      });
      this.store$.dispatch(eventAddPlannedPeriod({ plannedPeriod }));

      if (event.sessionId === currentSessionId) {
        this.router.navigate([
          '/planned-period',
          plannedPeriod.plannedPeriodId
        ]);
      }

      return;
    }

    if (event instanceof AddRiskEvent) {
      const risk = Risk.fromJS(event);
      this.store$.dispatch(eventAddRisk({ risk }))
      return;
    }

    if (event instanceof AddSprintEvent) {
      const sprint = Sprint.fromJS(event);
      this.store$.dispatch(eventAddSprint({ sprint }))
      return;
    }

    if (event instanceof AddSquadEvent) {
      const squad = Squad.fromJS(event);
      this.store$.dispatch(eventAddSquad({ squad }))

      if (event.sessionId === currentSessionId) {
        const returnUrl = this.getReturnUrl();
        this.router.navigate(JSON.parse(returnUrl));
      }

      return;
    }

    if (event instanceof AddTicketEvent) {
      const ticket = Ticket.fromJS(event);
      this.store$.dispatch(eventAddTicket({ ticket }))
      return;
    }

    if (event instanceof DeleteRiskEvent) {
      this.store$.dispatch(eventDeleteRisk({ riskId: event.riskId }))
      return;
    }

    if (event instanceof DeleteTicketEvent) {
      this.store$.dispatch(eventDeleteTicket({ ticketId: event.ticketId }))
      return;
    }

    if (event instanceof EditPlannedPeriodEvent) {
      const plannedPeriod = PlannedPeriod.fromJS(event);
      this.store$.dispatch(eventEditPlannedPeriod({ plannedPeriod }));
      
      if (event.sessionId === currentSessionId) {
        this.router.navigate([
          '/planned-period',
          plannedPeriod.plannedPeriodId
        ]);
      }
      return;
    }

    if (event instanceof EditRiskEvent) {
      const risk = Risk.fromJS(event);
      this.store$.dispatch(eventEditRisk({ risk }))
      return;
    }

    if(event instanceof EditSprintEvent) {
      const sprint = Sprint.fromJS(event);
      this.store$.dispatch(eventEditSprint({ sprint }));
      return;
    }

    if(event instanceof EditSquadEvent) {
      const squad = Squad.fromJS(event);
      this.store$.dispatch(eventEditSquad({ squad }));

      if (event.sessionId === currentSessionId) {
        const returnUrl = this.getReturnUrl();
        this.router.navigate(JSON.parse(returnUrl));
      }
      return;
    }

    if(event instanceof EditTicketEvent) {
      const ticket = Ticket.fromJS(event);
      this.store$.dispatch(eventEditTicket({ ticket }));
      return;
    }

  }

  private getReturnUrl() {
    const query = new URLSearchParams(window.location.search);
    return decodeURI(query.get('returnUrl'));
  }

  /**
   * Determines whether we can process this event locally or show a loading spinner until we get the answer from the server
   */
  private isServerRequiredEvent(event: Event): boolean {
    return event instanceof AddOrUpdateSquadSprintStatsEvent
      || event instanceof AddPlannedPeriodEvent
      || event instanceof AddRiskEvent
      || event instanceof AddSessionEvent
      || event instanceof AddSprintEvent
      || event instanceof AddSquadEvent
      || event instanceof AddTicketEvent
  }

  private showLoadingSpinner() {

  }

  private hideLoadingSpinner() {

  }
}
