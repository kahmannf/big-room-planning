import { Injectable } from '@angular/core';
import {MatSnackBar} from '@angular/material/snack-bar';

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
}
