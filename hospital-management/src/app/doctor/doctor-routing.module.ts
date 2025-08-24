import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TodayScheduleComponent } from './today-schedule/today-schedule.component';
import { AssignedAppointmentsComponent } from './assigned-appointments/assigned-appointments.component';

const routes: Routes = [
  { path: 'today-schedule', component: TodayScheduleComponent },
  { path: 'assigned-appointments', component: AssignedAppointmentsComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DoctorRoutingModule { }
