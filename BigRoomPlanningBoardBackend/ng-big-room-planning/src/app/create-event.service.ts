import { Injectable } from '@angular/core';

import {
  AddPlannedPeriodEvent,
  AddSessionEvent,
  EditPlannedPeriodEvent,
  Event,
  IEvent,
  IPlannedPeriod,
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


  private getBaseEvent<T extends Event, U extends IEvent>(ctor: new(data: U) => T): T {
    const u: U = {
      createdAt: new Date(Date.now()),
      sessionId: this.dataService.sessionId
    } as U; 

    return new ctor(u);
  }
}
