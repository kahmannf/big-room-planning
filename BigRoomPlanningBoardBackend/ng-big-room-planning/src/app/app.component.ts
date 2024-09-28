import { Component, OnInit, Signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { map, Observable } from 'rxjs';
import { getConnectionError, getCurrentSession, getIsConnected } from './store/app.selectors';
import { Session } from './client';
import { AsyncPipe } from '@angular/common';
import { ConnectionLostComponent } from "./connection-lost/connection-lost.component";
import { CreateSessionComponent } from "./create-session/create-session.component";
import { DataService } from './data.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    AsyncPipe,
    ConnectionLostComponent,
    CreateSessionComponent
],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {

  currentSession$: Observable<Session | undefined>;

  isDisconnected$: Observable<boolean>;
  connectionError$: Observable<string | undefined>;

  constructor (
    private store$: Store<any>,
    private dataService: DataService
  ) {

  }
  
  ngOnInit(): void {
    this.dataService.openConnection();

    this.currentSession$ = this.store$.pipe(select(getCurrentSession));
    this.isDisconnected$ = this.store$.pipe(
      select(getIsConnected),
      map(x => !x)
    );
    this.connectionError$ = this.store$.pipe(select(getConnectionError));

    this.connectionError$.subscribe(a => console.log('hello', a))
  }
}
