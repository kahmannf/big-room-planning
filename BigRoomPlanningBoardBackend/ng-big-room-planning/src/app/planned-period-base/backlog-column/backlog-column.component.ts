import {
  AsyncPipe,
  NgFor,
} from '@angular/common';
import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';

import {
  map,
  Observable,
} from 'rxjs';

import {
  select,
  Store,
} from '@ngrx/store';

import {
  ITicket,
  Ticket,
} from '../../client';
import { getTickets } from '../../store/app.selectors';
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
    AsyncPipe
  ],
  templateUrl: './backlog-column.component.html',
  styleUrl: './backlog-column.component.scss'
})
export class BacklogColumnComponent implements OnInit, OnChanges {

  @Input()
  squadId: number;

  @Input()
  plannedPeriodId: number;

  tickets$: Observable<Ticket[]>;


  constructor(
    private store$: Store<any>,
    private matDialog: MatDialog
  ) {

  }

  ngOnInit(): void {
  }

  ngOnChanges(simpleChanges: SimpleChanges) {
    if (simpleChanges['squadId'] || simpleChanges['plannedPeriodId']) {
      this.tickets$ = this.store$.pipe(
        select(getTickets),
        map(tickets => tickets.filter(x => !x.sprintId && x.squadId === this.squadId && x.plannedPeriodId === this.plannedPeriodId))
      )
    }
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
}
