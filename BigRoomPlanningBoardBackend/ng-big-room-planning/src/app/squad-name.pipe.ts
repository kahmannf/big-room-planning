import {
  Pipe,
  PipeTransform,
} from '@angular/core';

import {
  map,
  Observable,
  of,
} from 'rxjs';

import {
  select,
  Store,
} from '@ngrx/store';

import { Squad } from './client';
import { getSquads } from './store/app.selectors';

@Pipe({
  name: 'squadName',
  standalone: true
})
export class SquadNamePipe implements PipeTransform {

  constructor (
    private store$: Store<any>
  ) {}

  transform(squadId: number | Squad): Observable<string> {
    
    if (!squadId) {
      return of('')
    }

    if(typeof squadId === 'object') {
      return of(squadId.name)
    }
    
    return this.store$.pipe(
      select(getSquads),
      map(x => x.find(y => y.squadId === squadId)?.name)
    );
  }

}
