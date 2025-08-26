import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
// Import your new layout component
import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';

// Import your page and auth components
import { HomeComponent } from './home/home.component';
import { AboutComponent } from './public/about/about.component';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { DashboardComponent } from './doctor/dashboard/dashboard.component';
import { PrescriptionsComponent } from './doctor/prescriptions/prescriptions.component';
import { ReferralsComponent } from './doctor/referrals/referrals.component';
import { ProfileComponent } from './doctor/profile/profile.component';
import { Appointment } from './patient/services/appointment.service';
import { AppointmentsListComponent } from './doctor/appointments/appointments-list/appointments-list.component';
import { AppointmentDetailComponent } from './doctor/appointments/appointment-detail/appointment-detail.component';
const routes: Routes = [
  // 1. Routes WITHOUT the main layout (navbar/footer)
  { path: 'auth/login', component: LoginComponent },
  { path: 'auth/register', component: RegisterComponent },

  // 2. Routes WITH the main layout
  {
    path: '',
    component: MainLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      { path: 'home', component: HomeComponent },
      { path: 'patient', loadChildren: () => import('./patient/patient.module').then(m => m.PatientModule) },
      { path: 'doctor', loadChildren: () => import('./doctor/doctor.module').then(m => m.DoctorModule) },
      { path: 'admin', loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule) },
      { path: 'about', component: AboutComponent },

      // Redirect default path to home
      { path: '', redirectTo: 'home', pathMatch: 'full' }
    ]
  },
  {
    path: 'doctor/dashboard',
    component: DashboardComponent,
    children: [
      { path: 'appointments', component: AppointmentsListComponent },
      { path: 'appointments/:id', component: AppointmentDetailComponent },
      { path: 'prescriptions', component: PrescriptionsComponent },
      { path: 'referrals', component: ReferralsComponent },
      { path: 'profile', component: ProfileComponent },
      { path: '', redirectTo: 'appointments', pathMatch: 'full' }
    ]
  },
  { path: '', redirectTo: 'doctor/dashboard', pathMatch: 'full' },
  { path: '**', redirectTo: 'doctor/dashboard' }


];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }