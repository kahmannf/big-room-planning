import {
  Component,
  Input,
} from '@angular/core';
import { MatButton } from '@angular/material/button';
import {
  MatCard,
  MatCardActions,
  MatCardHeader,
} from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';

import { Ticket } from '../../client';
import {
  EditTicketDialogComponent,
} from '../edit-ticket-dialog/edit-ticket-dialog.component';

@Component({
  selector: 'app-ticket-card',
  standalone: true,
  imports: [
    MatCard,
    MatCardHeader,
    MatCardActions,
    MatButton
  ],
  templateUrl: './ticket-card.component.html',
  styleUrl: './ticket-card.component.scss'
})
export class TicketCardComponent {

  @Input()
  ticket: Ticket;

  constructor (
    private matDialog: MatDialog
  ) {

  }

  edit() {
    this.matDialog.open(EditTicketDialogComponent, {
      data: this.ticket,
      disableClose: true
    })
  }
}
