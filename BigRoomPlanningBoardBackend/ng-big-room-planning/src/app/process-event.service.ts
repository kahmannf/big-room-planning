import { Injectable } from '@angular/core';
import { IEvent, Event, AddSessionEvent, Session, ISession, AddSquadEvent, ISquad, Squad } from './client';
import { select, Store } from '@ngrx/store';
import { setCreateSessionFailed, eventAddSession, eventAddSquad, initializCurrentSeesion } from './store/app.actions';
import { HubConnection } from '@microsoft/signalr';
import { firstValueFrom } from 'rxjs';
import { getLastEventId } from './store/app.selectors';

@Injectable({
  providedIn: 'root'
})
export class ProcessEventService {

  constructor(
    private store$: Store<any>
  ) { }

  async processEvent(event: IEvent, currentSessionId: string, connection: HubConnection) {

    const instance = Event.fromJS(event)

    const lastEventId = await firstValueFrom(this.store$.pipe(select(getLastEventId)));

    if (lastEventId >= event.eventId) {
      console.log('Dropped duplicate event with id ' + event.eventId)
      return;
    }

    if (instance instanceof AddSessionEvent) {

      if (!instance.isSuccessful) {
        if(instance.sessionId === currentSessionId) {
          this.store$.dispatch(setCreateSessionFailed({ failed: true }));
        }
        return;
      }

      const session: ISession = await connection.invoke('GetSession', instance.sessionId);
      this.store$.dispatch(eventAddSession({ session: new Session(session), eventId: event.eventId }))

      if (session.sessionId === currentSessionId) {
        this.store$.dispatch(initializCurrentSeesion({ session: new Session(session) }))
      } 
    }

    if (instance instanceof AddSquadEvent) {
      const squad: ISquad = await connection.invoke('GetSquad', instance.squadId);
      this.store$.dispatch(eventAddSquad({ squad: new Squad(squad), eventId: event.eventId }))
    }

  }



}
