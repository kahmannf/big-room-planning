import {
  CdkContextMenuTrigger,
  CdkMenu,
  CdkMenuItem,
} from '@angular/cdk/menu';
import { AsyncPipe } from '@angular/common';
import {
  Component,
  Input,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { MatButton } from '@angular/material/button';
import {
  MatCard,
  MatCardActions,
  MatCardContent,
  MatCardHeader,
} from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';

import {
  combineLatest,
  map,
  Observable,
  of,
  switchMap,
} from 'rxjs';

import {
  select,
  Store,
} from '@ngrx/store';

import {
  IDependency,
  Ticket,
} from '../../client';
import { CreatEventService } from '../../create-event.service';
import {
  HighlightDependenciesService,
} from '../../highlight-dependencies.service';
import { SquadNamePipe } from '../../squad-name.pipe';
import {
  getDependencies,
  getSprints,
  getTickets,
} from '../../store/app.selectors';
import {
  EditTicketDialogComponent,
} from '../edit-ticket-dialog/edit-ticket-dialog.component';
import {
  AddDependencyDialogComponent,
} from './add-dependency-dialog/add-dependency-dialog.component';

interface DependencyWithInfo extends IDependency {
  fullfilled: boolean;
}

@Component({
  selector: 'app-ticket-card',
  standalone: true,
  imports: [
    MatCard,
    MatCardHeader,
    MatCardActions,
    MatButton,
    MatCardContent,
    AsyncPipe,
    CdkMenu,
    CdkMenuItem,
    CdkContextMenuTrigger,
    MatIcon,
    SquadNamePipe
  ],
  templateUrl: './ticket-card.component.html',
  styleUrl: './ticket-card.component.scss'
})
export class TicketCardComponent implements OnChanges {

  @Input()
  ticket: Ticket;

  @Input()
  mode: 'squad' | 'dependency';

  dependants$: Observable<DependencyWithInfo[]>;
  dependencies$: Observable<DependencyWithInfo[]>;

  dependantsCount$: Observable<number>;
  dependantsFullfilled$: Observable<boolean>;

  dependenciesCount$: Observable<number>;
  dependenciesFullfilled$: Observable<boolean>;

  isHighlightUnfullfilledDependency$: Observable<boolean> = of(false);
  isHighlightFullfilledDependency$: Observable<boolean> = of(false);

  isHighlightTarget$: Observable<boolean> = of(false);

  constructor(
    private matDialog: MatDialog,
    private createEventServie: CreatEventService,
    private store$: Store<any>,
    private highlightDependenciesService: HighlightDependenciesService
  ) {

  }


  ngOnChanges(simpleChanges: SimpleChanges) {

    if (simpleChanges['ticket']) {

      const sprintInfos$ = this.store$.pipe(
        select(getSprints),
        map(sprints => ({
          sprints,
          currentSprint: this.ticket.sprintId ? sprints.find(x => x.sprintId === this.ticket.sprintId) : null
        }))
      )

      const tickets$ = this.store$.pipe(
        select(getTickets)
      )

      this.dependants$ = this.store$.pipe(
        select(getDependencies),
        map(all => all.filter(x => x.dependencyTicketId === this.ticket.ticketId)),
        switchMap(dependants => tickets$.pipe(
          map(tickets => ({ tickets, dependants })),
          switchMap(infos => sprintInfos$.pipe(
            map(sprintInfos => ({...sprintInfos, ...infos}))
          ))
        )),
        map(({ currentSprint, dependants, sprints, tickets }) => dependants.map(dependant => {

          let fullfilled = false;

          const dependantTicket = tickets.find(x => x.ticketId === dependant.dependantTicketId)

          const targetSprint = dependantTicket.sprintId ? sprints.find(s => s.sprintId === dependantTicket.sprintId) : null

          if (!targetSprint) {
            fullfilled = true;
          } else if (!currentSprint) {
            fullfilled = false;
          } else {
            fullfilled = currentSprint.endsAt.getTime() < targetSprint.startsAt.getTime();
          }

          return {
            ...dependant,
            fullfilled
          }
        }))
      );

      this.dependencies$ = this.store$.pipe(
        select(getDependencies),
        map(all => all.filter(x => x.dependantTicketId === this.ticket.ticketId)),
        switchMap(dependencies => tickets$.pipe(
          map(tickets => ({ tickets, dependencies })),
          switchMap(infos => sprintInfos$.pipe(
            map(sprintInfos => ({...sprintInfos, ...infos}))
          ))
        )),
        map(({ currentSprint, dependencies, sprints, tickets }) => dependencies.map(dependency => {

          let fullfilled = false;

          const dependencyTicket = tickets.find(x => x.ticketId === dependency.dependencyTicketId)

          const previousSprint = dependencyTicket.sprintId ? sprints.find(s => s.sprintId === dependencyTicket.sprintId) : null

          if (!currentSprint) {
            fullfilled = true;
          } else if (!previousSprint) {
            fullfilled = false;
          } else {
            fullfilled = previousSprint.endsAt.getTime() < currentSprint.startsAt.getTime();
          }

          return {
            ...dependency,
            fullfilled
          }
        }))
      );

      this.dependantsCount$ = this.dependants$.pipe(map(x => x.length));
      this.dependantsFullfilled$ = this.dependants$.pipe(map(x => x.length === 0 ? true : x.every(y => y.fullfilled)));
      this.dependenciesCount$ = this.dependencies$.pipe(map(x => x.length));
      this.dependenciesFullfilled$ = this.dependencies$.pipe(map(x => x.length === 0 ? true : x.every(y => y.fullfilled)));
    }

    if(simpleChanges['mode'] || simpleChanges['ticket']) {
      if (this.mode === 'squad') {
        this.isHighlightFullfilledDependency$ = of(false);
        this.isHighlightUnfullfilledDependency$ = of(false);
        this.isHighlightTarget$ = of(false);
      } else {

        const allDeps$: Observable<DependencyWithInfo[]> = combineLatest([
          this.dependants$,
          this.dependencies$,
        ]).pipe(
          map(([a, b]) => ([...a, ...b]))
        );

        this.isHighlightUnfullfilledDependency$ = combineLatest([
          allDeps$,
          this.highlightDependenciesService.highlightedDependencyIds$
        ]).pipe(
          map(([deps, highlightIds]) =>
            !highlightIds?.length
              ? false
              : deps.some(x => !x.fullfilled && highlightIds.includes(x.dependencyId))
          )
        );

        this.isHighlightFullfilledDependency$ = combineLatest([
          allDeps$,
          this.highlightDependenciesService.highlightedDependencyIds$
        ]).pipe(
          map(([deps, highlightIds]) => ({
            deps: !highlightIds?.length? [] : deps.filter(x => highlightIds.includes(x.dependencyId)),
            highlightIds
          })),
          map(({ deps, highlightIds }) =>
            !highlightIds?.length
              ? false
              : (
                deps.length > 0
                && deps.every(x => x.fullfilled)
              ) 
          )
        );
      }

    }
  }

  edit() {
    this.matDialog.open(EditTicketDialogComponent, {
      data: this.ticket,
      disableClose: true
    })
  }

  addDependency() {
    this.matDialog.open(AddDependencyDialogComponent, {
      data: this.ticket,
      disableClose: true
    });
  }

  delete() {
    this.createEventServie.deleteTicket(this.ticket.ticketId);
  }

  mouseEnter() {
    if(this.mode === 'dependency') {
      this.highlightDependenciesService.mouseEnter(this.ticket);
    }
  }

  mouseLeave() {
    if(this.mode === 'dependency') {
      this.highlightDependenciesService.mouseLeave();
    }
  }
}
