import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatError, MatFormField } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { DataService } from '../data.service';
import { CreatEventService } from '../create-event.service';
import { MatButton } from '@angular/material/button';
import { Observable } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { select, Store } from '@ngrx/store';
import { getCreateSessionFailed } from '../store/app.selectors';
import { setCreateSessionFailed } from '../store/app.actions';

@Component({
  selector: 'app-create-session',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormField,
    MatError,
    MatInput,
    MatButton,
    AsyncPipe
  ],
  templateUrl: './create-session.component.html',
  styleUrl: './create-session.component.scss'
})
export class CreateSessionComponent implements OnInit {

  formGroup = new FormGroup({
    name: new FormControl<string>(null, Validators.required) 
  });

  failed$: Observable<boolean>;

  submitted = false;

  constructor (
    private createEventService: CreatEventService,
    private store$: Store<any>
  ) {

  }

  ngOnInit() {
    this.failed$ = this.store$.pipe(
      select(getCreateSessionFailed)
    );

    this.failed$.subscribe(console.log)
  }

  startSession() {
    this.formGroup.markAllAsTouched();

    if (!this.formGroup.valid) {
      return;
    }

    this.createEventService.startSession(this.formGroup.controls.name.value);

    this.submitted = true;
    this.store$.dispatch(setCreateSessionFailed({ failed: false }));
  }
}
