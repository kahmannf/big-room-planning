import { AsyncPipe } from '@angular/common';
import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';

import {
  combineLatest,
  first,
  map,
  Observable,
} from 'rxjs';

import {
  select,
  Store,
} from '@ngrx/store';

import { ISquadSprintStats } from '../../client';
import { getSquadSprintStats } from '../../store/app.selectors';
import {
  EditSquadSprintStatsDialogComponent,
} from './edit-squad-sprint-stats-dialog/edit-squad-sprint-stats-dialog.component';

@Component({
  selector: 'app-sprint-column',
  standalone: true,
  imports: [
    AsyncPipe,
    MatButton
  ],
  templateUrl: './sprint-column.component.html',
  styleUrl: './sprint-column.component.scss'
})
export class SprintColumnComponent implements OnInit, OnChanges {

  @Input()
  sprintId: number;

  @Input()
  squadId: number;

  capacity$: Observable<number>
  backgroundNoise$: Observable<number>


  constructor(
    private store$: Store<any>,
    private matDialog: MatDialog
  ) {

  }

  ngOnInit(): void {
  }


  ngOnChanges(simpleChange: SimpleChanges): void {
    if(simpleChange['sprintId'] || simpleChange['squadId']) {
      const squadSprintStats$ = this.store$.pipe(
        select(getSquadSprintStats),
        map(stats => stats.find(x => x.sprintId === this.sprintId && x.squadId === this.squadId)),
        map(stats => !stats ? ({ capacity: 0, backgroundNoise: 0 }) : stats)
      )

      this.capacity$ = squadSprintStats$.pipe(
        map(stats => stats.capacity)
      );
      
      this.backgroundNoise$ = squadSprintStats$.pipe(
        map(stats => stats.backgroundNoise)
      );
    }
  }

  editStats() {
    combineLatest([
      this.capacity$,
      this.backgroundNoise$
    ]).pipe(
      first()
    ).subscribe(([capacity, backgroundNoise]) => {
      
      const data: ISquadSprintStats = {
        capacity,
        backgroundNoise,
        sprintId: this.sprintId,
        squadId: this.squadId
      }
      
      this.matDialog.open(EditSquadSprintStatsDialogComponent, {
        data,
        disableClose: true
      })
    });
  }

  // TODO: Risks
}
