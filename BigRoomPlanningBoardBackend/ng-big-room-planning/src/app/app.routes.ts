import { Routes } from '@angular/router';

import {
  EditPlannedPeriodComponent,
} from './edit-planned-period/edit-planned-period.component';
import { HomeComponent } from './home/home.component';
import {
  PlannedPeriodBaseComponent,
} from './planned-period-base/planned-period-base.component';

export const routes: Routes = [
    { path: 'create-planned-period', component: EditPlannedPeriodComponent },
    { path: 'edit-planned-period/:id', component: EditPlannedPeriodComponent },
    { path: 'home', component: HomeComponent },
    { path: 'planned-period/:plannedPeriodId', component: PlannedPeriodBaseComponent },
    { path: '**', redirectTo: '/home' },
];
