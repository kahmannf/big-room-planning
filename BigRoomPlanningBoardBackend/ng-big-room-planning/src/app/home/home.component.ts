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
import { RouterLink } from '@angular/router';

import {
  map,
  Observable,
} from 'rxjs';

import create from '@kahmannf/iterable-transforms';
import {
  select,
  Store,
} from '@ngrx/store';

import {
  PlannedPeriod,
  Session,
} from '../client';
import { PeriodNamePipe } from '../pipes/period-name.pipe';
import {
  getCurrentSession,
  getPlannedPeriods,
} from '../store/app.selectors';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    AsyncPipe,
    NgFor,
    MatCard,
    MatChipSet,
    MatChip,
    MatCardHeader,
    MatCardContent,
    MatCardFooter,
    MatCardActions,
    PeriodNamePipe,
    RouterLink,
    MatButton
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {

  session$: Observable<Session>;

  hasNoPeriods$: Observable<boolean>; 

  periods$: Observable<PlannedPeriod[]>; 

  constructor (
    private store$: Store<any>
  ) {

  }

  ngOnInit(): void {
    this.session$ = this.store$.pipe(
      select(getCurrentSession)
    );

    this.periods$ = this.store$.pipe(
      select(getPlannedPeriods),
      map(periods => {
        return create(periods).sort(x => x.startDay.getTime(), 'desc').toArray()
      })
    );

    this.hasNoPeriods$ = this.periods$.pipe(
      map(x => !x?.length)
    );
  }

}
