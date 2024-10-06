import {
  CdkDragDrop,
  DragDropModule,
} from '@angular/cdk/drag-drop';
import {
  AsyncPipe,
  NgClass,
  NgFor,
} from '@angular/common';
import {
  Component,
  Input,
  NgZone,
  OnChanges,
  OnDestroy,
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
  Subscription,
  switchMap,
} from 'rxjs';

import create from '@kahmannf/iterable-transforms';
import {
  select,
  Store,
} from '@ngrx/store';

import {
  ISquadSprintStats,
  Risk,
  Sprint,
  Ticket,
} from '../../client';
import { CreatEventService } from '../../create-event.service';
import { DragDropService } from '../../drag-drop.service';
import {
  getDependencies,
  getRisks,
  getSprints,
  getSquadSprintStats,
  getTickets,
} from '../../store/app.selectors';
import { TicketCardComponent } from '../ticket-card/ticket-card.component';
import {
  EditRisksDialogComponent,
  EditRisksDialogData,
} from './edit-risks-dialog/edit-risks-dialog.component';
import {
  EditSquadSprintStatsDialogComponent,
} from './edit-squad-sprint-stats-dialog/edit-squad-sprint-stats-dialog.component';

@Component({
  selector: 'app-sprint-column',
  standalone: true,
  imports: [
    AsyncPipe,
    MatButton,
    NgFor,
    NgClass,
    DragDropModule,
    TicketCardComponent
  ],
  templateUrl: './sprint-column.component.html',
  styleUrl: './sprint-column.component.scss'
})
export class SprintColumnComponent implements OnInit, OnChanges, OnDestroy {

  @Input()
  mode: 'squad' | 'dependency' = 'squad'

  @Input()
  sprintId: number;

  @Input()
  squadId: number;

  capacity$: Observable<number>
  backgroundNoise$: Observable<number>

  sprint$: Observable<Sprint>;

  risks$: Observable<Risk[]>;

  riskStatus$: Observable<'none' | 'open' | 'closed'>;

  tickets$: Observable<Ticket[]>;

  dropListId: string;

  connectedDropLists$: Observable<string[]>;

  private subscription: Subscription;

  constructor(
    private store$: Store<any>,
    private matDialog: MatDialog,
    private dragDropService: DragDropService,
    private createEventService: CreatEventService,
    private ngZone: NgZone
  ) {

  }

  ngOnInit(): void {
    this.subscription = new Subscription();

    this.dropListId = crypto.randomUUID()
    this.subscription.add(this.dragDropService.registerTicketDropList(this.dropListId));
    this.connectedDropLists$ = this.dragDropService.getDropListIds(this.ngZone);
  }

  

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }



  ngOnChanges(simpleChange: SimpleChanges): void {
    
    if(simpleChange['sprintId']) {
      this.sprint$ = this.store$.pipe(
        select(getSprints),
        map(sprints => sprints.find(x => x.sprintId === this.sprintId))
      )
    }
    
    if(simpleChange['sprintId'] || simpleChange['squadId'] || simpleChange['mode']) {

      if (this.mode === 'squad') {
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

      this.risks$ = this.store$.pipe(
        select(getRisks),
        map(risks => risks.filter(x => x.sprintId === this.sprintId && (this.mode === 'dependency' || x.squadId === this.squadId))),
        map(risks => create(risks).sort(x => x.accepted ? 10 : 0).toArray())
      );

      this.riskStatus$ = this.risks$.pipe(
        map(risks => risks.length === 0
          ? 'none'
          // risks are sorted by accepted, we can check the first to know whether all are closed
          : risks[0].accepted
            ? 'closed'
            : 'open'
        )
      )

      if (this.mode === 'squad') {
        this.tickets$ = this.store$.pipe(
          select(getTickets),
          map(tickets => create(tickets)
            .filter(x => x.sprintId === this.sprintId && x.squadId === this.squadId)
            .sort(x => x.columnOrder)
            .toArray()
          )
        )
      } else {
        this.tickets$ = this.store$.pipe(
          select(getTickets),
          switchMap(tickets => this.store$.pipe(
            select(getDependencies),
            map(dependencies => ({ tickets, dependencies }))
          )),
          map(({ tickets, dependencies }) => create(tickets)
            .filter(x => x.sprintId === this.sprintId && dependencies.some(d => d.dependencyTicketId === x.ticketId || d.dependantTicketId === x.ticketId))
            .sort(x => x.squadId)
            .thenSort(x => x.columnOrder)
            .toArray()
          )
        )
      }
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

  openRiskDialog() {
    const data: EditRisksDialogData = {
      mode: this.mode,
      sprintId: this.sprintId,
      squadId: this.squadId
    }
    
    this.matDialog.open(EditRisksDialogComponent, {
      data,
      disableClose: true,
      width: '800px'
    })
  }

  
  onTicketDrop(event: CdkDragDrop<void, void, Ticket>) {
    this.createEventService.editTicket({
      ...event.item.data,
      columnOrder: event.currentIndex,
      sprintId: this.sprintId,
      predecessorId: undefined
    });
  }
}
