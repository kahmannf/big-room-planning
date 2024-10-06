import {
  AsyncPipe,
  NgFor,
} from '@angular/common';
import {
  Component,
  Inject,
  NgZone,
  OnInit,
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
} from '@angular/forms';
import {
  MatButton,
  MatIconButton,
} from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltip } from '@angular/material/tooltip';

import {
  first,
  map,
  Observable,
  startWith,
  switchMap,
  tap,
} from 'rxjs';

import create from '@kahmannf/iterable-transforms';
import {
  select,
  Store,
} from '@ngrx/store';

import {
  ITicket,
  Sprint,
  Squad,
  Ticket,
} from '../../../client';
import { CreatEventService } from '../../../create-event.service';
import { IterationNamePipe } from '../../../iteration-name.pipe';
import {
  getDependencies,
  getPlannedPeriods,
  getSprints,
  getSquads,
  getTickets,
} from '../../../store/app.selectors';

interface TicketWithDetails extends ITicket {
  dependencyType: 'dependency' | 'dependant' | 'none';
  /**
   * Determines if that dependency is fullfilled or critical
   */
  fullfilled?: boolean;
  dependencyId?: number;
}

@Component({
  selector: 'app-add-dependency-dialog',
  standalone: true,
  imports: [
    MatDialogModule,
    ReactiveFormsModule,
    NgFor,
    AsyncPipe,
    MatButton,
    MatInput,
    MatSelectModule,
    MatFormFieldModule,
    MatIconButton,
    MatIcon,
    MatTooltip,
    IterationNamePipe
  ],
  templateUrl: './add-dependency-dialog.component.html',
  styleUrl: './add-dependency-dialog.component.scss'
})
export class AddDependencyDialogComponent implements OnInit {

  formGroup = new FormGroup({
    squad: new FormControl<number>(null),
    sprints: new FormControl<number[]>(null),
    title: new FormControl<string>(null)
  });

  squadFilter$: Observable<Squad[]>;

  sprintFilter$: Observable<Sprint[]>;

  ticketList$: Observable<TicketWithDetails[]>;


  constructor(
    @Inject(MAT_DIALOG_DATA) public data: Ticket,
    private store$: Store<any>,
    private matDialogRef: MatDialogRef<AddDependencyDialogComponent>,
    private ngZone: NgZone,
    private createEventService: CreatEventService
  ) { }

  ngOnInit() {
    this.squadFilter$ = this.store$.pipe(
      select(getSquads),
      map(squads => create(squads)
        .filter(s => s.squadId !== this.data.squadId)
        .sort(s => s.name)
        .toArray()
      )
    );

    const plannedPeriod$ = this.store$.pipe(
      select(getPlannedPeriods),
      map(periods => periods.find(x => x.plannedPeriodId === this.data.plannedPeriodId))
    )

    this.sprintFilter$ = this.store$.pipe(
      select(getSprints),
      switchMap(sprints => plannedPeriod$.pipe(
        map(plannedPeriod => ({ sprints, plannedPeriod }))
      )),
      map(({ sprints, plannedPeriod }) => create(sprints)
        .filter(x => x.endsAt.getTime() >= plannedPeriod.startDay.getTime() && x.endsAt.getTime() <= plannedPeriod.endDay.getTime())
        .sort(x => x.name)
        .toArray()
      ),
      map(sprints => ([
        new Sprint({
          name: $localize`Backlog`,
          sprintId: -1
        }),
        ...sprints
      ]))
    );

    this.sprintFilter$.pipe(
      first(),
      switchMap(val => new Observable<Sprint[]>((subscriber) => {
        setTimeout(() => {
          subscriber.next(val);
          subscriber.complete();
        }, 0);
      }))
    ).subscribe(sprints => this.ngZone.run(() => this.formGroup.patchValue({
      sprints: sprints.map(x => x.sprintId)
    })));

    const dependencyInfos$ = this.store$.pipe(
      select(getDependencies),
      map(dependencies => ({
        dependantConnections: dependencies.filter(x => x.dependantTicketId === this.data.ticketId),
        dependencyConnections: dependencies.filter(x => x.dependencyTicketId === this.data.ticketId),
      }))
    )

    this.ticketList$ = this.formGroup.valueChanges.pipe(
      startWith({}),
      switchMap(filter => this.store$.pipe(
        select(getTickets),
        tap(x => console.log('selector', x)),
        switchMap(tickets => dependencyInfos$.pipe(
          map((infos) => ({ ...infos, tickets }))
        )),
        switchMap(infos => this.sprintFilter$.pipe(
          map(sprints => ({...infos, sprints}))
        )),
        map(({ tickets, dependantConnections, dependencyConnections, sprints }) => create(tickets)
          .filter(ticket => ticket.plannedPeriodId === this.data.plannedPeriodId
            && ticket.squadId !== this.data.squadId
            && this.checkFilter(ticket, filter)
          )
          .map(ticket => {

            console.log('inner',ticket)

            const dependantConnection = dependantConnections.find(x => x.dependencyTicketId === ticket.ticketId);

            if (dependantConnection) {

              let fullfilled = false;

              if (!this.data.sprintId) {
                fullfilled = true;
              } else if (!ticket.sprintId) {
                fullfilled = false;
              } else {
                const dependencySprint = sprints.find(s => s.sprintId === ticket.sprintId);
                const dependantSprint = sprints.find(s => s.sprintId === this.data.sprintId);
                fullfilled = dependencySprint.endsAt.getTime() < dependantSprint.startsAt.getTime();
              }
              
              const result: TicketWithDetails = {
                ...ticket,
                dependencyType: 'dependant',
                dependencyId: dependantConnection.dependencyId,
                fullfilled
              };

              return result;
            }

            const dependencyConenction = dependencyConnections.find(x => x.dependantTicketId === ticket.ticketId);

            if (dependencyConenction) {
              
              let fullfilled = false;

              if (!ticket.sprintId) {
                fullfilled = true;
              } else if (!this.data.sprintId) {
                fullfilled = false;
              } else {
                const dependencySprint = sprints.find(s => s.sprintId === this.data.sprintId);
                const dependantSprint = sprints.find(s => s.sprintId === ticket.sprintId);
                fullfilled = dependencySprint.endsAt.getTime() < dependantSprint.startsAt.getTime();
              }

              const result: TicketWithDetails = {
                ...ticket,
                dependencyType: 'dependency',
                dependencyId: dependencyConenction.dependencyId,
                fullfilled
              };

              return result;
            }

            const noneTicket: TicketWithDetails = {
              ...ticket,
              dependencyType: 'none'
            };

            return noneTicket;
          })
          .sort(x => x.dependencyType === 'dependant' ? 0 : x.dependencyType === 'dependency' ? 1 : 2)
          .thenSort(x => x.title)
          .toArray()
        )
      ))
    )
  }

  close() {
    this.matDialogRef.close();
  }

  clearSquadSelection(event: MouseEvent) {
    event.stopImmediatePropagation();
    event.preventDefault();
    this.formGroup.patchValue({ squad: null })
  }

  getDependencyTooltip(ticket: ITicket) {
    return $localize`"${ticket.title}" has to be completed before "${this.data.title}"`;
  }

  getDependantTooltip(ticket: ITicket) {
    return $localize`"${ticket.title}" can only be started, after "${this.data.title}" is complete`
  }

  addAsDependency(ticket: ITicket) {
    this.createEventService.addDependency({
      dependencyTicketId: ticket.ticketId,
      dependantTicketId: this.data.ticketId
    });
  }

  addAsDependant(ticket: ITicket) {
    this.createEventService.addDependency({
      dependencyTicketId: this.data.ticketId,
      dependantTicketId: ticket.ticketId
    });
  }

  deleteDependency(dependencyId: number) {
    this.createEventService.deleteDependency({
      dependencyId
    });
  }

  private checkFilter(ticket: Ticket, filter: Partial<{ squad: number, sprints: number[], title: string }>): boolean {

    if (filter.title && !ticket.title.toLowerCase().includes(filter.title.toLowerCase())) {
      return false;
    }

    if (typeof filter.squad === 'number' && filter.squad !== ticket.squadId) {
      return false;
    }

    if (!filter.sprints || filter.sprints.length === 0) {
      return false;
    }

    const sprintFilter = filter.sprints.map(x => x === -1 ? null : x);

    if(!sprintFilter.includes(ticket.sprintId)) {
      return false;
    }

    return true;
  }
}
