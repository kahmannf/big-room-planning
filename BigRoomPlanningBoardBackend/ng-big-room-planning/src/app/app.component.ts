import { AsyncPipe } from '@angular/common';
import {
  Component,
  OnInit,
} from '@angular/core';
import { RouterOutlet } from '@angular/router';

import {
  map,
  Observable,
} from 'rxjs';

import {
  select,
  Store,
} from '@ngrx/store';

import { Session } from './client';
import {
  ConnectionLostComponent,
} from './connection-lost/connection-lost.component';
import {
  CreateSessionComponent,
} from './create-session/create-session.component';
import { DataService } from './data.service';
import { HomeComponent } from './home/home.component';
import {
  getConnectionError,
  getCurrentSession,
  getIsConnected,
} from './store/app.selectors';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    AsyncPipe,
    ConnectionLostComponent,
    CreateSessionComponent,
    HomeComponent,
    RouterOutlet
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
  }
}
