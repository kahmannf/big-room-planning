import {
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  MatError,
  MatFormField,
  MatLabel,
} from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { ActivatedRoute } from '@angular/router';

import {
  first,
  Subscription,
} from 'rxjs';

import {
  select,
  Store,
} from '@ngrx/store';

import { ISquad } from '../client';
import { CreatEventService } from '../create-event.service';
import {
  EditEntityComponent,
  EditEntityPageComponent,
} from '../edit-entity-page/edit-entity-page.component';
import { HandleErrorService } from '../handle-error.service';
import { getSquads } from '../store/app.selectors';

@Component({
  selector: 'app-edit-squad',
  standalone: true,
  imports: [
    EditEntityPageComponent,
    ReactiveFormsModule,
    MatFormField,
    MatLabel,
    MatError,
    MatInput
  ],
  providers: [
    {
      provide: EditEntityComponent,
      useExisting: EditSquadComponent
    }
  ],
  templateUrl: './edit-squad.component.html',
  styleUrl: './edit-squad.component.scss'
})
export class EditSquadComponent extends EditEntityComponent implements OnInit, OnDestroy {
  
  formGroup = new FormGroup({
    name: new FormControl<string>(null, Validators.required)
  });

  isInitialized = false;

  isNew = false;

  title = '';

  private editId?: number;

  private submitCallback: () => void;

  private subscription: Subscription;

  constructor(
    private activatedRoute: ActivatedRoute,
    private handleErrorService: HandleErrorService,
    private store$: Store<any>,
    private createEventService: CreatEventService
  ) {
    super();
  }
  
  ngOnInit(): void {
    this.subscription = new Subscription();

    this.subscription.add(
      this.activatedRoute.params.subscribe(params => {
        let id: string | number = params['id'];

        if (typeof id === 'undefined') {

          this.isNew = true;
          this.title = $localize`Create new Squad`;

          this.isInitialized = true;
          return;
        }


        if (typeof id !== 'number') {
          let original = id;
          id = parseInt(id, 10);

          if (Number.isNaN(id)) {
            this.handleErrorService.handleError($localize`Invalid id ${original}`);
            history.back();
            return;
          }
        }

        this.store$.pipe(
          select(getSquads),
          first(),
        ).subscribe(periods => {

          const target = periods.find(x => x.squadId === id);

          if(!target) {
            this.handleErrorService.handleError($localize`Could not find Squad with id ${id}`);
            history.back();
          } else {
            this.editId = target.squadId;
            this.formGroup.setValue({
              name: target.name ?? null
            });
            this.isInitialized = true;
          }
        });
      })
    );
  }
  

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  override checkValidAndTouch(): boolean {
    this.formGroup.markAllAsTouched();

    return this.formGroup.valid;
  }

  override saveAndClose(): void {
    const result: ISquad = {
      name: this.formGroup.controls.name.value,
      squadId: this.editId
    }

    if(this.isNew) {
      this.createEventService.addSquad(result);
    } else {
      this.createEventService.editSquad(result);
    }
  }

  override registerOnSubmitCallback(callback: () => void): void {
    this.submitCallback = callback;
  }

  onSubmit() {
    this.submitCallback();
  }

}
