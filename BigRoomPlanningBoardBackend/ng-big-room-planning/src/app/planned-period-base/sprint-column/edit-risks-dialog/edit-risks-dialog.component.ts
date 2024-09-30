import {
  AsyncPipe,
  NgFor,
  NgTemplateOutlet,
} from '@angular/common';
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
import {
  MatError,
  MatFormField,
  MatLabel,
} from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';

import {
  distinctUntilChanged,
  map,
  Observable,
} from 'rxjs';

import create from '@kahmannf/iterable-transforms';
import {
  select,
  Store,
} from '@ngrx/store';

import {
  IRisk,
  Risk,
  Sprint,
} from '../../../client';
import { CreatEventService } from '../../../create-event.service';
import {
  getRisks,
  getSprints,
} from '../../../store/app.selectors';

export interface EditRisksDialogData {
  squadId: number;
  sprintId: number;
} 

@Component({
  selector: 'app-edit-risks-dialog',
  standalone: true,
  imports: [
    MatDialogModule,
    AsyncPipe,
    NgFor,
    MatButton,
    MatIcon,
    ReactiveFormsModule,
    MatFormField,
    MatLabel,
    MatError,
    MatInput,
    NgTemplateOutlet
  ],
  templateUrl: './edit-risks-dialog.component.html',
  styleUrl: './edit-risks-dialog.component.scss'
})
export class EditRisksDialogComponent implements OnInit {

  sprint$: Observable<Sprint>;
  
  risks$: Observable<Risk[]>;

  editRisk: Risk | undefined;

  isAdding = false;

  formGroup = new FormGroup({
    text: new FormControl<string>(null, Validators.required)
  })

  constructor (
    @Inject(MAT_DIALOG_DATA) private data: EditRisksDialogData,
    private store$: Store<any>,
    private matDialogRef: MatDialogRef<EditRisksDialogComponent>,
    private createEventService: CreatEventService
  ) {

  }

  ngOnInit(): void {
    
    this.sprint$ = this.store$.pipe(
      select(getSprints),
      map(sprints => sprints.find(x => x.sprintId === this.data.sprintId))
    )
    
    this.risks$ = this.store$.pipe(
      select(getRisks),
      map(risks => risks.filter(risk => risk.sprintId == this.data.sprintId && risk.squadId == this.data.squadId)),
      map(risks => create(risks).sort(x => x.accepted ? 10 : 0).toArray()),
      distinctUntilChanged((a, b) => this.hasChanged(a, b))
    )

  }

  closeClick() {
    this.matDialogRef.close();
  }

  setAccepted (risk: Risk, accepted: boolean) {
    this.createEventService.editRisk({
      ...risk,
      accepted
    })
  }

  editText (risk: Risk) {
    this.formGroup.setValue({
      text: risk.text
    });
    this.editRisk = risk;
  }

  addNew() {
    this.isAdding = true;
    this.formGroup.setValue({
      text: null
    });
  }

  cancelEdit() {
    this.isAdding = false;
    this.editRisk = undefined;
  }

  save() {
    this.formGroup.markAllAsTouched();

    if(!this.formGroup.valid) {
      return;
    }

    if (this.isAdding) {
      this.createEventService.addRisk({
        text: this.formGroup.controls.text.value,
        squadId: this.data.squadId,
        sprintId: this.data.sprintId,
        accepted: false
      })
    } else {
      this.createEventService.editRisk({
        ...this.editRisk,
        text: this.formGroup.controls.text.value
      })
    }

    this.isAdding = false;
    this.editRisk = undefined;
  }

  delete(risk: IRisk) {
    this.createEventService.deleteRisk(risk);
  }

  private hasChanged(a: Risk[], b: Risk[]): boolean {

    if (a.length != b.length) {
      return false;
    }

    const asorted = create(a).sort(x => x.riskId).toArray();
    const bsorted = create(b).sort(x => x.riskId).toArray(); 

    for(let i = 0; i < asorted.length; i++) {
      const ia = asorted[i];
      const ib = bsorted[i];

      // in this dialog, sprintid and squad id have to be the same, so no need to check
      if (
        ia.riskId != ib.riskId
        || ia.accepted != ib.accepted
        || ia.text != ib.text
      ) {
        return false;
      }
    }

    return true;
  }
}
