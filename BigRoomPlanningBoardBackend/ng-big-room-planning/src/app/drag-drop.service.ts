import {
  Injectable,
  NgZone,
} from '@angular/core';

import {
  BehaviorSubject,
  Observable,
  Subscription,
  switchMap,
} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DragDropService {

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

  
  getDropListIds(ngZone: NgZone): Observable<string[]> {
    return this._availableTicketDropLists$.pipe(
      switchMap(ids => new Observable<string[]>(subscriber => {
        const timeout = setTimeout(() => ngZone.run(() => {
          subscriber.next(ids);
          subscriber.complete();
        }), 0);

        return () => clearTimeout(timeout);
      }))
    );
  }
}
