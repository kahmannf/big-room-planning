import { Injectable } from '@angular/core';

import {
  interval,
  map,
  Observable,
  switchMap,
} from 'rxjs';

import {
  HubConnection,
  HubConnectionBuilder,
  HubConnectionState,
} from '@microsoft/signalr';
import {
  select,
  Store,
} from '@ngrx/store';

import {
  AddSessionEvent,
  BRPFullData,
  Event,
  IBRPFullData,
  IEvent,
} from './client';
import { ProcessEventService } from './process-event.service';
import { Queue } from './queue';
import {
  applyFullData,
  connectionStateChange,
} from './store/app.actions';
import { getLastEventId } from './store/app.selectors';

const pingInterval = 1000;

const enableLogging = true;

@Injectable({
  providedIn: 'root'
})
export class DataService {

  connection: HubConnection;

  get sessionId(): string {
    return this._sessionId;
  } 

  private pingTrigger$: Observable<void>;

  private _sessionId: string;

  private queue = new Queue<IEvent>();

  private isProcessingQueue = false;

  private isPingRunning = false;

  constructor(
    private store$: Store<any>,
    private processEventService: ProcessEventService
  ) {
    this.pingTrigger$ = interval(pingInterval).pipe(map((c) => {}));
  }

  openConnection () {
    this.connection?.stop();

    // this resets the error string if there was an error before
    connectionStateChange({
      isConnected: false
    })

    this.connection = new HubConnectionBuilder()
      .withUrl('/hubs/data')
      .withAutomaticReconnect()
      .build();

    this.connection.start()
      .then(() => this.store$.dispatch(connectionStateChange({
        isConnected: true
      })))
      .catch(err => {
        this.store$.dispatch(connectionStateChange({
          isConnected: false,
          error: err + ''
        }))
        console.log('error dispatched',  err + '', err)
      });

    this.connection.onreconnecting(() => connectionStateChange({
      isConnected: false
    }));
    this.connection.onreconnected(() => connectionStateChange({
      isConnected: true
    }))
    this.connection.onclose(() => connectionStateChange({
      isConnected: false
    }))

    this.connection.on('RecieveEvents', (events) => this.recieveEvents(events));
    this.connection.on('RecieveFullData', (data) => this.recieveFullData(data));

  }

  startPingTimer() {
    if (this.isPingRunning) {
      return;
    }

    this.pingTrigger$.pipe(
      switchMap(() => this.store$.pipe(
        select(getLastEventId)
      )) 
    ).subscribe((eventId) => {
      if(this.connection.state === HubConnectionState.Connected) {
        this.connection.invoke('GetUpdated', eventId, this.sessionId)
      }
    });

    this.isPingRunning = true;
  }

  sendEvent(event: Event) {

    this.connection.invoke('AddEvent', event);


    if (event instanceof AddSessionEvent) {
      this._sessionId = event.sessionId;
      this.startPingTimer();
    }

    this.processEventService.processEvent(event, this._sessionId, this.connection);
  }

  private recieveEvents(events: IEvent[]) {
    if (!events?.length) {
      return;
    }
    this.log('[Data] recieved events: ' + events.length)

    this.queue.add(...events);

    this.log('[Data] is already processing: ' + this.isProcessingQueue)
    if(!this.isProcessingQueue) {
      this.processQueue();
    }
  }

  private recieveFullData(fullData: IBRPFullData) {
    this.queue.clear();

    this.log('REcieved full data package: ', fullData);

    const instance = BRPFullData.fromJS(fullData);

    this.store$.dispatch(applyFullData({ fullData: instance }))

  }

  private async processQueue() {
    this.isProcessingQueue = true;

    let lastQueueItem: IEvent | undefined;

    try {
      this.log('[Queue] Start processing')
  
      while (this.queue.length() > 0) {
        const item = this.queue.get();
        lastQueueItem = item;
        this.log('[Queue] processing item', item)
        const instance = Event.fromJS(item);
        await this.processEventService.processEvent(instance, this._sessionId, this.connection);
      }
    } catch (err) {
      console.error('Failed to process events. Dropping queue and requesting full data. Last event bevor error occurred: ', lastQueueItem);
      console.error(err);

      await this.connection.invoke('RequestFullData', this.sessionId);
      this.queue.clear();
    }

    this.log('[Queue] Stop processing')
    this.isProcessingQueue = false;
  }

  private log(message: string, ...args: any[]) {
    if (enableLogging) {
      console.log(message, ...args);
    }
  }
}
