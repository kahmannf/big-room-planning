import { Injectable } from '@angular/core';

import {
  AddPlannedPeriodEvent,
  AddSessionEvent,
  AddSprintEvent,
  AddSquadEvent,
  AddTicketEvent,
  EditPlannedPeriodEvent,
  EditSprintEvent,
  EditSquadEvent,
  EditTicketEvent,
  Event,
  IEvent,
  IPlannedPeriod,
  ISprint,
  ISquad,
  ITicket,
} from './client';
import { DataService } from './data.service';

@Injectable({
  providedIn: 'root'
})
export class CreatEventService {

  constructor(
    private dataService: DataService
  ) { }

  startSession(name: string) {
    const event = new AddSessionEvent({
      createdAt: new Date(Date.now()),
      sessionId: crypto.randomUUID()
    })

    event.sessionName = name;

    this.dataService.sendEvent(event);
  }

  addPlannedPeriod (plannedPeriod: IPlannedPeriod) {
    const event = this.getBaseEvent(AddPlannedPeriodEvent)
    event.name = plannedPeriod.name;
    event.startDay = plannedPeriod.startDay;
    event.endDay = plannedPeriod.endDay;
    event.bigRoomPlanningAt = plannedPeriod.bigRoomPlanningAt;

    this.dataService.sendEvent(event);
  }

  editPlannedPeriod(plannedPeriod: IPlannedPeriod) {
    
    const event = this.getBaseEvent(EditPlannedPeriodEvent)
    event.plannedPeriodId = plannedPeriod.plannedPeriodId;
    event.name = plannedPeriod.name;
    event.startDay = plannedPeriod.startDay;
    event.endDay = plannedPeriod.endDay;
    event.bigRoomPlanningAt = plannedPeriod.bigRoomPlanningAt;

    this.dataService.sendEvent(event);
  }

  addSprint (sprint: ISprint) {
    const event = this.getBaseEvent(AddSprintEvent)
    event.name = sprint.name;
    event.startsAt = sprint.startsAt;
    event.endsAt = sprint.endsAt;

    this.dataService.sendEvent(event);
  }

  editSprint(sprint: ISprint) {
    
    const event = this.getBaseEvent(EditSprintEvent)
    event.sprintId = sprint.sprintId;
    event.name = sprint.name;
    event.startsAt = sprint.startsAt;
    event.endsAt = sprint.endsAt;

    this.dataService.sendEvent(event);
  }

  addSquad (squad: ISquad) {
    const event = this.getBaseEvent(AddSquadEvent)
    event.name = squad.name;

    this.dataService.sendEvent(event);
  }

  editSquad(squad: ISquad) {
    
    const event = this.getBaseEvent(EditSquadEvent)
    event.squadId = squad.squadId;
    event.name = squad.name;

    this.dataService.sendEvent(event);
  }

  addTicket (ticket: ITicket) {
    const event = this.getBaseEvent(AddTicketEvent)
    event.squadId = ticket.squadId;
    event.plannedPeriodId = ticket.plannedPeriodId;
    event.sprintId = ticket.sprintId;
    event.title = ticket.title;

    this.dataService.sendEvent(event);
  }

  editTicket(ticket: ITicket) {
    
    const event = this.getBaseEvent(EditTicketEvent)
    event.ticketId = ticket.ticketId;
    event.squadId = ticket.squadId;
    event.plannedPeriodId = ticket.plannedPeriodId;
    event.sprintId = ticket.sprintId;
    event.title = ticket.title;

    this.dataService.sendEvent(event);
  }


  private getBaseEvent<T extends Event, U extends IEvent>(ctor: new(data: U) => T): T {
    const u: U = {
      createdAt: new Date(Date.now()),
      sessionId: this.dataService.sessionId
    } as U; 

    return new ctor(u);
  }
}
