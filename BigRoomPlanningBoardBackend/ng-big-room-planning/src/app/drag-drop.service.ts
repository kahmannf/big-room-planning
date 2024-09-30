import { Injectable } from '@angular/core';

import {
  BehaviorSubject,
  Observable,
  Subscription,
} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DragDropService {


  get availableTicketDropLists$(): Observable<string[]> {
    return this._availableTicketDropLists$;
  }

  private _availableTicketDropLists$ = new BehaviorSubject<string[]>([]);

  private ticketDropLists: string[] = [];

  constructor() { }


  registerTicketDropList(id: string): Subscription {

    this.ticketDropLists = [
      ...this.ticketDropLists,
      id
    ];

    this._availableTicketDropLists$.next(this.ticketDropLists);

    return new Subscription(() => {
      this.ticketDropLists = this.ticketDropLists.filter(x => x !== id);
      this._availableTicketDropLists$.next(this.ticketDropLists);
    });
  }
}
