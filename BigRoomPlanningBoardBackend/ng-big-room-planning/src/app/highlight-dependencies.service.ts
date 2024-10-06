import { Injectable } from '@angular/core';

import {
  BehaviorSubject,
  Observable,
  Subscription,
} from 'rxjs';

import {
  select,
  Store,
} from '@ngrx/store';

import { Ticket } from './client';
import { getDependencies } from './store/app.selectors';

@Injectable({
  providedIn: 'root'
})
export class HighlightDependenciesService {

  get highlightedDependencyIds$(): Observable<number[]> {
    return this._highlightedDependencyIds$;
  }

  private dependencySubscription: Subscription;

  private _highlightedDependencyIds$ = new BehaviorSubject<number[]>([]);

  constructor(
    private store$: Store<any>
  ) { }

  mouseEnter(ticket: Ticket) {
    this.dependencySubscription?.unsubscribe();
    this.dependencySubscription = this.store$.pipe(
      select(getDependencies)
    ).subscribe(dependencies => {
      const ids: number[] = dependencies.filter(x => x.dependantTicketId === ticket.ticketId || x.dependencyTicketId === ticket.ticketId).map(x => x.dependencyId);
      this._highlightedDependencyIds$.next(ids);
    });
  }

  mouseLeave() {
    this.clearHighlights()
  }

  private clearHighlights() {
    this.dependencySubscription?.unsubscribe();

    this._highlightedDependencyIds$.next([]);
  }
}
