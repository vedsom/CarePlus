import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AppointmentsListComponent } from './appointments/appointments-list/appointments-list.component';
import { AppointmentDetailComponent } from './appointments/appointment-detail/appointment-detail.component';
import { ReferralsComponent } from './referrals/referrals.component';
import { PrescriptionsComponent } from './prescriptions/prescriptions.component';
import { ProfileComponent } from './profile/profile.component';
import { EarningsComponent } from './earnings/earnings.component';
import { ReferredPatientsComponent } from './referred-patients/referred-patients.component';

const routes: Routes = [
  {
    // The base path for the doctor section (e.g., /doctor) loads the DashboardComponent.
    // The DashboardComponent contains the sidebar and a <router-outlet>.
    path: '',
    component: DashboardComponent,
    // The following components are loaded inside the DashboardComponent's <router-outlet>.
    children: [
      { path: 'appointments', component: AppointmentsListComponent },
      { path: 'appointments/:id', component: AppointmentDetailComponent },
      { path: 'prescriptions', component: PrescriptionsComponent },
      { path: 'referrals', component: ReferralsComponent },
      { path: 'referred-patients', component: ReferredPatientsComponent },
      { path: 'profile', component: ProfileComponent },
      { path: 'earnings', component: EarningsComponent },
      // If the path is just /doctor, redirect to the appointments list by default.
      { path: '', redirectTo: 'appointments', pathMatch: 'full' }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DoctorRoutingModule { }
