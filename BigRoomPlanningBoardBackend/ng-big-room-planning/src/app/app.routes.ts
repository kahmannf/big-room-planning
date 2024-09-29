import { Routes } from '@angular/router';

import {
  EditPlannedPeriodComponent,
} from './edit-planned-period/edit-planned-period.component';
import { EditSquadComponent } from './edit-squad/edit-squad.component';
import { HomeComponent } from './home/home.component';
import {
  DependencyBoardComponent,
} from './planned-period-base/dependency-board/dependency-board.component';
import {
  PlannedPeriodBaseComponent,
} from './planned-period-base/planned-period-base.component';
import {
  PlannedPeriodOverviewComponent,
} from './planned-period-base/planned-period-overview/planned-period-overview.component';
import {
  SquadBoardComponent,
} from './planned-period-base/squad-board/squad-board.component';

export const routes: Routes = [
    { path: 'create-planned-period', component: EditPlannedPeriodComponent },
    { path: 'create-squad', component: EditSquadComponent },
    { path: 'edit-planned-period/:id', component: EditPlannedPeriodComponent },
    { path: 'edit-squad/:id', component: EditSquadComponent },
    { path: 'home', component: HomeComponent },
    { 
        path: 'planned-period/:plannedPeriodId',
        component: PlannedPeriodBaseComponent,
        children: [
            { path: 'overview', component: PlannedPeriodOverviewComponent },
            { path: 'dependencies', component: DependencyBoardComponent },
            { path: 'squad/:squadId', component: SquadBoardComponent },
            { path: '**', redirectTo: 'overview' },
        ]
    },
    { path: '**', redirectTo: '/home' },
];
