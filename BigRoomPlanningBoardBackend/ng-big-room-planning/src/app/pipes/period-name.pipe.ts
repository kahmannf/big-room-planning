import { Pipe, PipeTransform } from '@angular/core';
import { PlannedPeriod } from '../client';

@Pipe({
  name: 'periodName',
  standalone: true
})
export class PeriodNamePipe implements PipeTransform {

  transform(value: PlannedPeriod): string {
    
    if(!value) {
      return '';
    } 

    if (value.name) {
      return value.name;
    }

    return `${value.startDay?.toDateString()} - ${value.endDay?.toDateString()}`
  }

}
