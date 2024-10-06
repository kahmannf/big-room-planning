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

import { ISprint } from './client';
import { getSprints } from './store/app.selectors';

@Pipe({
  name: 'iterationName',
  standalone: true
})
export class IterationNamePipe implements PipeTransform {

  constructor (private store$: Store<any>) {}

  transform (iterationId: number | ISprint): Observable<string> {
    if(!iterationId) {
      return of($localize`Backlog`);
    }

    if(typeof iterationId === 'object') {
      return of(iterationId.name);
    }

    return this.store$.pipe(
      select(getSprints),
      map(sprint => sprint.find(x => x.sprintId === iterationId)?.name)
    );
  }

}
