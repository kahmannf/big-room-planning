import {
  AsyncPipe,
  NgFor,
} from '@angular/common';
import {
  Component,
  OnInit,
} from '@angular/core';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import {
  ActivatedRoute,
  Router,
  RouterLink,
  RouterLinkActive,
  RouterOutlet,
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
} from '../client';
import { PeriodNamePipe } from '../pipes/period-name.pipe';
import {
  getPlannedPeriods,
  getSquads,
} from '../store/app.selectors';

@Component({
  selector: 'app-planned-period-base',
  standalone: true,
  imports: [
    RouterOutlet,
    MatIconButton,
    MatIcon,
    PeriodNamePipe,
    AsyncPipe,
    RouterLink,
    RouterLinkActive,
    NgFor
  ],
  templateUrl: './planned-period-base.component.html',
  styleUrl: './planned-period-base.component.scss'
})
export class PlannedPeriodBaseComponent implements OnInit {

  plannedPeriod$: Observable<PlannedPeriod>;

  squads$: Observable<Squad[]>;

  constructor (
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private store$: Store<any>
  ) {

  }

  ngOnInit(): void {

    this.squads$ = this.store$.pipe(
      select(getSquads)
    );

    this.plannedPeriod$ = this.activatedRoute.params.pipe(
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
    );

    

  }

  homeClick() {
    this.router.navigate([
      '/home'
    ]);
  }
}
