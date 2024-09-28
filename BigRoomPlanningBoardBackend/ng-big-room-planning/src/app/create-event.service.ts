import { Injectable } from '@angular/core';
import { DataService } from './data.service';
import { AddSessionEvent } from './client';

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
}
