import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AppointmentsListComponent } from './appointments/appointments-list/appointments-list.component';
import { AppointmentDetailComponent } from './appointments/appointment-detail/appointment-detail.component';
import { ReferralsComponent } from './referrals/referrals.component';
import { PrescriptionsComponent } from './prescriptions/prescriptions.component';
import { ProfileComponent } from './profile/profile.component';
import { EarningsComponent } from './earnings/earnings.component';
import { DoctorRoutingModule } from './doctor-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CalendarModule } from 'angular-calendar';


@NgModule({
  declarations: [
    DashboardComponent,
    AppointmentsListComponent,
    AppointmentDetailComponent,
    ReferralsComponent,
    PrescriptionsComponent,
    ProfileComponent,
    EarningsComponent
  ],
  imports: [
    CommonModule,
    DoctorRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    CalendarModule
  ]
})
export class DoctorModule { }
