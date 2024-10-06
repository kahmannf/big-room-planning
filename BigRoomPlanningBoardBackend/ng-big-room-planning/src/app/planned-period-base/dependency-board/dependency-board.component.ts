import {
  AsyncPipe,
  NgFor,
} from '@angular/common';
import {
  Component,
  OnInit,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import {
  map,
  Observable,
  switchMap,
} from 'rxjs';

import {
  select,
  Store,
} from '@ngrx/store';

import { Sprint } from '../../client';
import {
  getPlannedPeriods,
  getSprints,
} from '../../store/app.selectors';
import {
  BacklogColumnComponent,
} from '../backlog-column/backlog-column.component';
import {
  SprintColumnComponent,
} from '../sprint-column/sprint-column.component';

@Component({
  selector: 'app-dependency-board',
  standalone: true,
  imports: [
    AsyncPipe,
    SprintColumnComponent,
    BacklogColumnComponent,
    NgFor
  ],
  templateUrl: './dependency-board.component.html',
  styleUrl: './dependency-board.component.scss'
})
export class DependencyBoardComponent implements OnInit {

  plannedPeriodId$: Observable<number>;

  sprints$: Observable<Sprint[]>;

  constructor(
    private activatedRoute: ActivatedRoute,
    private store$: Store<any>
  ) {

  }

  ngOnInit(): void {
    
    
    this.plannedPeriodId$ = this.activatedRoute.parent.params.pipe(
      map(x => {
        let id: string | number = x['plannedPeriodId'];
        
        if (typeof id === 'string') {
          id = parseInt(id, 10);
        }
        
        return id;
      })
    );

    const plannedPeriod$ = this.plannedPeriodId$.pipe(
      switchMap(id => this.store$.pipe(
        select(getPlannedPeriods),
        map(periods => periods.find(x =>  x.plannedPeriodId === id))
      ))
    )

    this.sprints$ = plannedPeriod$.pipe(
      map(period => ({ start: period.startDay.getTime(), end: period.endDay.getTime() })),
      switchMap(({ start, end }) => this.store$.pipe(
        select(getSprints),
        map(sprints => sprints.filter(s => start <= s.endsAt.getTime() && end >= s.endsAt.getTime()))
      ))
    )
  }
}
