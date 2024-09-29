import {
  Component,
  Input,
} from '@angular/core';

import { Ticket } from '../../client';

@Component({
  selector: 'app-ticket-card',
  standalone: true,
  imports: [],
  templateUrl: './ticket-card.component.html',
  styleUrl: './ticket-card.component.scss'
})
export class TicketCardComponent {

  @Input()
  ticket: Ticket;
}
