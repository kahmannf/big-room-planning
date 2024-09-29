import {
  Component,
  Inject,
  OnInit,
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButton } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';

import { ITicket } from '../../client';
import { CreatEventService } from '../../create-event.service';

@Component({
  selector: 'app-edit-ticket-dialog',
  standalone: true,
  imports: [
    MatButton,
    MatDialogModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatInput
  ],
  templateUrl: './edit-ticket-dialog.component.html',
  styleUrl: './edit-ticket-dialog.component.scss'
})
export class EditTicketDialogComponent implements OnInit {

  formGroup = new FormGroup({
    title: new FormControl<string>(null, Validators.required)
  });

  title = '';
  closeAction = '';

  constructor (
    @Inject(MAT_DIALOG_DATA) private ticket: ITicket,
    private dialogRef: MatDialogRef<EditTicketDialogComponent>,
    private createEventService: CreatEventService
  ) {

  }

  ngOnInit(): void {
    this.formGroup.setValue({
      title: this.ticket?.title ?? null
    })
    
    if(!this.ticket.ticketId) {
      this.title = $localize`Create new Ticket`;
      this.closeAction = $localize`Create Ticket`;
    } else {
      this.title = $localize`Edit Ticket ${this.ticket.title}`;
      this.closeAction = $localize`Save Ticket`;
    }
  }


  cancelClick() {
    this.dialogRef.close();
  }
  
  
  saveClick() {

    this.formGroup.markAllAsTouched();

    if(!this.formGroup.valid) {
      return;
    }

    const result: ITicket = {
      squadId: this.ticket.squadId,
      plannedPeriodId: this.ticket.plannedPeriodId,
      sprintId: this.ticket.sprintId,
      title: this.formGroup.controls.title.value,
      ticketId: this.ticket.ticketId
    }

    if (!this.ticket.ticketId) {
      this.createEventService.addTicket(result);
    } else {
      this.createEventService.editTicket(result);
    }

    this.dialogRef.close();
  }

}
