import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AppointmentsListComponent } from './appointments/appointments-list/appointments-list.component';
import { AppointmentDetailComponent } from './appointments/appointment-detail/appointment-detail.component';
import { ReferralsComponent } from './referrals/referrals.component';
import { PrescriptionsComponent } from './prescriptions/prescriptions.component';
import { ProfileComponent } from './profile/profile.component';
import { EarningsComponent } from './earnings/earnings.component';


const routes: Routes = [
  { path: 'dashboard', component: DashboardComponent },
  { path: 'appointments', component: AppointmentsListComponent },
  { path: 'appointments/:id', component: AppointmentDetailComponent },
  { path: 'referrals', component: ReferralsComponent },
  { path: 'prescriptions', component: PrescriptionsComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'earnings', component: EarningsComponent },
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DoctorRoutingModule { }
