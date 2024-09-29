import {
  AsyncPipe,
  DatePipe,
} from '@angular/common';
import {
  Component,
  OnInit,
} from '@angular/core';
import {
  MatButton,
  MatIconButton,
} from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatToolbar } from '@angular/material/toolbar';
import { RouterLink } from '@angular/router';

import {
  map,
  Observable,
  switchMap,
} from 'rxjs';

import create from '@kahmannf/iterable-transforms';
import {
  select,
  Store,
} from '@ngrx/store';

import {
  PlannedPeriod,
  Sprint,
} from '../client';
import { PeriodNamePipe } from '../pipes/period-name.pipe';
import {
  getPlannedPeriods,
  getSprints,
} from '../store/app.selectors';
import {
  EditSprintDialogComponent,
} from './edit-sprint-dialog/edit-sprint-dialog.component';

interface DisplaySprintItem {
  sprint: Sprint;
  plannedPeriod?: PlannedPeriod;
}

@Component({
  selector: 'app-sprints',
  standalone: true,
  imports: [
    MatTableModule,
    AsyncPipe,
    DatePipe,
    PeriodNamePipe,
    MatToolbar,
    MatButton,
    MatIcon,
    MatIconButton,
    RouterLink
  ],
  templateUrl: './sprints.component.html',
  styleUrl: './sprints.component.scss'
})
export class SprintsComponent implements OnInit {

  displayedColumns: string[] = [
    'name',
    'startsAt',
    'endsAt',
    'plannedPeriod',
    'contextMenu'
  ]

  sprints$: Observable<Sprint[]>;

  displaySprints$: Observable<DisplaySprintItem[]>;

  constructor(
    private store$: Store<any>,
    private matDialog: MatDialog
  ) {

  }

  ngOnInit(): void {
    this.sprints$ = this.store$.pipe(
      select(getSprints)
    );


    this.displaySprints$ = this.sprints$.pipe(
      switchMap(sprints => this.store$.pipe(
        select(getPlannedPeriods),
        map(plannedPeriods => this.buildDisplayItems(plannedPeriods, sprints))
      ))
    )
  }

  editSprint (element?: DisplaySprintItem) {
    this.matDialog.open(EditSprintDialogComponent, {
      data: element?.sprint,
      disableClose: true
    });
  }

  private buildDisplayItems(plannedPeriods: PlannedPeriod[], sprints: Sprint[]): DisplaySprintItem[] {
    plannedPeriods = create(plannedPeriods).sort(x => x.startDay.getTime(), 'desc').toArray();
    sprints = create(sprints).sort(x => x.endsAt.getTime(), 'desc').toArray();

    const result: DisplaySprintItem[] = [];

    for (const sprint of sprints) {

      const displayItem: DisplaySprintItem = {
        sprint
      }


      result.push(displayItem);

      for (const plannedPeriod of [...plannedPeriods]) {
        const sprintEndTime = sprint.endsAt.getTime();

        const periodStart = plannedPeriod.startDay.getTime();
        const periodEnd = plannedPeriod.endDay.getTime();

        if (sprintEndTime < periodStart) {
          // Sprints are sorted descending, this planned period will never be used again here
          plannedPeriods = plannedPeriods.filter(x => x !== plannedPeriod)
          continue;
        }

        if (sprintEndTime >= periodStart && sprintEndTime <= periodEnd) {
          displayItem.plannedPeriod = plannedPeriod;
          break;
        }
      }
    }

    return result;
  }

}
