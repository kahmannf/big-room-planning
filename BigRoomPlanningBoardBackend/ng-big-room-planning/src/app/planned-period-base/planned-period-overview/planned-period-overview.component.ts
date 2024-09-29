import {
  AsyncPipe,
  NgFor,
} from '@angular/common';
import {
  Component,
  OnInit,
} from '@angular/core';
import { MatButton } from '@angular/material/button';
import {
  MatCard,
  MatCardActions,
  MatCardContent,
  MatCardFooter,
  MatCardHeader,
} from '@angular/material/card';
import {
  MatChip,
  MatChipSet,
} from '@angular/material/chips';
import {
  ActivatedRoute,
  RouterLink,
} from '@angular/router';

import {
  filter,
  map,
  Observable,
  of,
  switchMap,
} from 'rxjs';

import {
  select,
  Store,
} from '@ngrx/store';

import {
  PlannedPeriod,
  Squad,
} from '../../client';
import { PeriodNamePipe } from '../../pipes/period-name.pipe';
import {
  getPlannedPeriods,
  getSquads,
} from '../../store/app.selectors';

@Component({
  selector: 'app-planned-period-overview',
  standalone: true,
  imports: [
    MatCard,
    MatCardHeader,
    MatCardContent,
    MatCardFooter,
    MatCardActions,
    MatButton,
    NgFor,
    AsyncPipe,
    RouterLink,
    PeriodNamePipe,
    MatChipSet,
    MatChip
  ],
  templateUrl: './planned-period-overview.component.html',
  styleUrl: './planned-period-overview.component.scss'
})
export class PlannedPeriodOverviewComponent implements OnInit {

  squads$: Observable<Squad[]>;

  plannedPeriod$: Observable<PlannedPeriod>;

  returnUrl$: Observable<string>;

  constructor(
    private store$: Store<any>,
    private activatedRoute: ActivatedRoute
  ) {

  }

  ngOnInit(): void {
    this.squads$ = this.store$.pipe(
      select(getSquads)
    );

    this.returnUrl$ = this.activatedRoute.parent.params.pipe(
      map(params => encodeURI(JSON.stringify([
        '/planned-period',
        params['plannedPeriodId'],
        'overview'
      ])))
    )

    this.plannedPeriod$ = this.activatedRoute.parent.params.pipe(
      switchMap(params => {
        let id: string | number = params['plannedPeriodId']; 

        if(!id) {
          return of(undefined);
        }

        if(typeof id !== 'number') {
          id = parseInt(id, 10);
        }

        if (Number.isNaN(id)) {
          return of(undefined);
        }

        return this.store$.pipe(
          select(getPlannedPeriods),
          map(periods => periods.find(period => period.plannedPeriodId === id))
        )
      }),
      filter(x => !!x)
    )
  }
}
