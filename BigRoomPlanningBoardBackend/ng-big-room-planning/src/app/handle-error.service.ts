import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

import { Event } from './client';

@Injectable({
  providedIn: 'root'
})
export class HandleErrorService {

  constructor(
    private snackBar: MatSnackBar
  ) { }

  handleError(errorMessage: string) {
    console.error(errorMessage);

    this.snackBar.open(errorMessage, $localize`close`)
  }

  handleFailedEvent(event: Event): void {

    // TODO: customize error message beased on event type

    this.handleError($localize`An unkown error occured.`);
  }
}
