import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TodayScheduleComponent } from './today-schedule/today-schedule.component';
import { AssignedAppointmentsComponent } from './assigned-appointments/assigned-appointments.component';



@NgModule({
  declarations: [
    TodayScheduleComponent,
    AssignedAppointmentsComponent
  ],
  imports: [
    CommonModule
  ]
})
export class DoctorModule { }
