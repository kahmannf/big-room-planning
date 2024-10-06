import {
  CdkDragDrop,
  DragDropModule,
} from '@angular/cdk/drag-drop';
import {
  AsyncPipe,
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
import { MatIcon } from '@angular/material/icon';

import {
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
  ITicket,
  Ticket,
} from '../../client';
import { CreatEventService } from '../../create-event.service';
import { DragDropService } from '../../drag-drop.service';
import {
  getDependencies,
  getTickets,
} from '../../store/app.selectors';
import {
  EditTicketDialogComponent,
} from '../edit-ticket-dialog/edit-ticket-dialog.component';
import { TicketCardComponent } from '../ticket-card/ticket-card.component';

@Component({
  selector: 'app-backlog-column',
  standalone: true,
  imports: [
    MatButton,
    MatIcon,
    TicketCardComponent,
    NgFor,
    AsyncPipe,
    DragDropModule
  ],
  templateUrl: './backlog-column.component.html',
  styleUrl: './backlog-column.component.scss'
})
export class BacklogColumnComponent implements OnInit, OnChanges, OnDestroy {

  @Input()
  mode: 'squad' | 'dependency' = 'squad'

  @Input()
  squadId: number;

  @Input()
  plannedPeriodId: number;

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

  ngOnChanges(simpleChanges: SimpleChanges) {
    if (simpleChanges['squadId'] || simpleChanges['plannedPeriodId'] || simpleChanges['mode']) {

      if(this.mode === 'squad') {

        this.tickets$ = this.store$.pipe(
          select(getTickets),
          map(tickets => create(tickets)
            .filter(x => !x.sprintId && x.plannedPeriodId === this.plannedPeriodId && x.squadId === this.squadId)
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
            .filter(x => !x.sprintId && x.plannedPeriodId === this.plannedPeriodId && dependencies.some(d => d.dependencyTicketId === x.ticketId || d.dependantTicketId === x.ticketId))
            .sort(x => x.squadId)
            .thenSort(x => x.columnOrder)
            .toArray()
          )
        );
      }
    }
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  addNewTicket(): void {

    const data: ITicket = {
      squadId: this.squadId,
      plannedPeriodId: this.plannedPeriodId
    }

    this.matDialog.open(EditTicketDialogComponent, {
      data,
      disableClose: true
    })
  }

  onTicketDrop(event: CdkDragDrop<void, void, Ticket>) {
    this.createEventService.editTicket({
      ...event.item.data,
      columnOrder: event.currentIndex,
      sprintId: undefined,
      predecessorId: undefined
    });
  }
}
