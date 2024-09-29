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

const pingInterval = 100;

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

    this.pingTrigger$.pipe(
      switchMap(() => this.store$.pipe(
        select(getLastEventId)
      )) 
    ).subscribe((eventId) => {
      if(this.connection.state === HubConnectionState.Connected) {
        this.connection.invoke('GetUpdated', eventId)
      }
    });
  }

  sendEvent(event: Event) {
    if (event instanceof AddSessionEvent) {
      this._sessionId = event.sessionId;
    }

    this.connection.invoke('AddEvent', event);
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
        await this.processEventService.processEvent(item, this._sessionId, this.connection);
      }
    } catch (err) {
      console.error('Failed to process events. Dropping queue and requesting full data. Last event bevor error occurred: ', lastQueueItem);
      console.error(err);

      await this.connection.invoke('RequestFullData');
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
