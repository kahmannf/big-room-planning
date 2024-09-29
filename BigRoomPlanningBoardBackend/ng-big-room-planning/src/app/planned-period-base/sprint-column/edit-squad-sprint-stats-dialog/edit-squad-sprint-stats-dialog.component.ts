import {
  Component,
  Inject,
  OnInit,
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatButton } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import {
  MatSlider,
  MatSliderThumb,
} from '@angular/material/slider';

import { ISquadSprintStats } from '../../../client';
import { CreatEventService } from '../../../create-event.service';

@Component({
  selector: 'app-edit-squad-sprint-stats-dialog',
  standalone: true,
  imports: [
    MatDialogModule,
    MatSlider,
    MatSliderThumb,
    ReactiveFormsModule,
    MatButton
  ],
  templateUrl: './edit-squad-sprint-stats-dialog.component.html',
  styleUrl: './edit-squad-sprint-stats-dialog.component.scss'
})
export class EditSquadSprintStatsDialogComponent implements OnInit {

  formGroup = new FormGroup({
    capacity: new FormControl<number>(0),
    backgroundNoise: new FormControl<number>(0),
  })

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: ISquadSprintStats,
    private matDialogRef: MatDialogRef<EditSquadSprintStatsDialogComponent>,
    private createEventService: CreatEventService
  ) {

  }

  ngOnInit(): void {
    this.formGroup.setValue({
      backgroundNoise: this.data.backgroundNoise,
      capacity: this.data.capacity
    });
  }

  saveClick () {
    this.createEventService.addOrUpdateSquadSprintStats({
      ...this.data,
      capacity: this.formGroup.controls.capacity.value,
      backgroundNoise: this.formGroup.controls.backgroundNoise.value
    });

    this.matDialogRef.close();
  }

  cancelClick () {
    this.matDialogRef.close();
  }

  formatLabel(value: number): string {
    return `${value}%`;
  }

}
