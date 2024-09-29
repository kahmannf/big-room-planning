import {
  AsyncPipe,
  DatePipe,
} from '@angular/common';
import {
  Component,
  Inject,
  OnDestroy,
  OnInit,
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';

import { Subscription } from 'rxjs';

import {
  select,
  Store,
} from '@ngrx/store';

import {
  ISprint,
  PlannedPeriod,
  Sprint,
} from '../../client';
import { CreatEventService } from '../../create-event.service';
import { PeriodNamePipe } from '../../pipes/period-name.pipe';
import {
  getPlannedPeriods,
  getSprints,
} from '../../store/app.selectors';

@Component({
  selector: 'app-edit-sprint-dialog',
  standalone: true,
  imports: [
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    ReactiveFormsModule,
    MatButton,
    MatFormFieldModule,
    MatDatepickerModule,
    MatInput,
    AsyncPipe,
    PeriodNamePipe,
    DatePipe
  ],
  templateUrl: './edit-sprint-dialog.component.html',
  styleUrl: './edit-sprint-dialog.component.scss'
})
export class EditSprintDialogComponent implements OnInit, OnDestroy {

  formGroup = new FormGroup({
    name: new FormControl<string>(null, Validators.required),
    startsAt: new FormControl<Date>(null, Validators.required),
    endsAt: new FormControl<Date>(null, Validators.required)
  });

  isNew = false;

  title = '';

  closeAction = '';

  isTimeRangeValid = true;

  plannedPeriod?: PlannedPeriod;

  private allPlannedPeriods: PlannedPeriod[];

  private allOtherSprints: Sprint[];

  private subscription: Subscription;

  constructor (
    @Inject(MAT_DIALOG_DATA) private data: Sprint | undefined,
    private dialogRef: MatDialogRef<EditSprintDialogComponent>,
    private store$: Store<any>,
    private createEventService: CreatEventService
  ) {

  }

  ngOnInit(): void {
    this.subscription = new Subscription();
     
    this.subscription.add(this.store$.pipe(select(getSprints)).subscribe(sprints => {
      if (this.data) {
        this.allOtherSprints = sprints.filter(s => s.sprintId !== this.data.sprintId);
      } else {
        this.allOtherSprints = sprints;
      }

      this.updateTimeRangeValidState();
    }));

    this.subscription.add(this.store$.pipe(select(getPlannedPeriods)).subscribe(periods => {
      this.allPlannedPeriods = periods;
      this.updatePlannedPeriod();
    }))

    this.subscription.add(this.formGroup.controls.startsAt.valueChanges.subscribe(() => {
      this.updateTimeRangeValidState();
    }));

    this.subscription.add(this.formGroup.controls.endsAt.valueChanges.subscribe(() => {
      this.updateTimeRangeValidState();
      this.updatePlannedPeriod();
    }));

    


    this.isNew = !this.data;
    this.title = this.isNew
      ? $localize`Create new Interation`
      : $localize`Edit Iteration "${this.data.name}"`;
    
    this.closeAction = this.isNew
      ? $localize`Create Iteration`
      : $localize`Save Iteration`;

    if (this.isNew) {
      this.formGroup.patchValue({
        name: $localize`Iteration`
      });
    } else {
      this.formGroup.setValue({
        endsAt: this.data.endsAt,
        name: this.data.name,
        startsAt: this.data.startsAt
      })
    }
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  cancelClick() {
    this.dialogRef.close();
  }

  saveClick() {
    this.formGroup.markAllAsTouched();

    if(
      !this.formGroup.valid
      || !this.isTimeRangeValid
      || this.formGroup.controls.startsAt.value.getTime() >= this.formGroup.controls.endsAt.value.getTime()
    ) {
      return;
    }

    const result: ISprint = {
      startsAt: this.formGroup.controls.startsAt.value,
      endsAt: this.formGroup.controls.endsAt.value,
      name: this.formGroup.controls.name.value,
      sprintId: this.data?.sprintId
    }

    if(this.isNew) {
      this.createEventService.addSprint(result);
    } else {
      this.createEventService.editSprint(result);
    }

    this.dialogRef.close();
  }

  private updateTimeRangeValidState() {
    const startsAtTime = this.formGroup.controls.startsAt.value?.getTime();
    const endsAtTime = this.formGroup.controls.endsAt.value?.getTime();

    this.isTimeRangeValid =
      !this.allOtherSprints?.length
      || !startsAtTime
      || !endsAtTime
      || !this.allOtherSprints.some(x => 
        (startsAtTime <= x.startsAt.getTime() && endsAtTime >=  x.startsAt.getTime())
        || (startsAtTime <= x.endsAt.getTime() && endsAtTime >= x.endsAt.getTime())
        || (startsAtTime <= x.startsAt.getTime() && endsAtTime >= x.endsAt.getTime())
      )
  }

  private updatePlannedPeriod() {
    if (!this.formGroup.controls.endsAt.value || !this.allPlannedPeriods?.length) {
      this.plannedPeriod = undefined;
      return;
    }

    const endTime = this.formGroup.controls.endsAt.value.getTime();
    const period = this.allPlannedPeriods.find(x => x.startDay.getTime() < endTime && x.endDay.getTime() > endTime);

    if (!period) {
      this.plannedPeriod = undefined;
      return;
    }

    this.plannedPeriod = period;
  }
}
