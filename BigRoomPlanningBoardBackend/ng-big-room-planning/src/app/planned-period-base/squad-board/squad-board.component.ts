import { AsyncPipe } from '@angular/common';
import {
  Component,
  OnInit,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import {
  map,
  Observable,
} from 'rxjs';

import {
  BacklogColumnComponent,
} from '../backlog-column/backlog-column.component';

@Component({
  selector: 'app-squad-board',
  standalone: true,
  imports: [
    BacklogColumnComponent,
    AsyncPipe
  ],
  templateUrl: './squad-board.component.html',
  styleUrl: './squad-board.component.scss'
})
export class SquadBoardComponent implements OnInit {

  squadId$: Observable<number>;
  
  plannedPeriodId$: Observable<number>;

  constructor(
    private activatedRoute: ActivatedRoute,
  ) {

  }

  ngOnInit(): void {
    
    this.squadId$ = this.activatedRoute.params.pipe(
      map(x => {
        let id: string | number = x['squadId'];
        
        if (typeof id === 'string') {
          id = parseInt(id, 10);
        }
        
        return id;
      })
    );
    
    this.plannedPeriodId$ = this.activatedRoute.parent.params.pipe(
      map(x => {
        let id: string | number = x['plannedPeriodId'];
        
        if (typeof id === 'string') {
          id = parseInt(id, 10);
        }
        
        return id;
      })
    );
  }

}
