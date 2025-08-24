import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { DoctorListComponent } from './patient/doctor-list/doctor-list.component';
import { LabListComponent } from './patient/lab-list/lab-list.component';
import { LabCheckoutComponent } from './patient/lab-checkout/lab-checkout.component';
import { LabCartComponent } from './patient/lab-cart/lab-cart.component';
import { AboutComponent } from './public/about/about.component';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent }, 
  { path: 'patient', loadChildren: () => import('./patient/patient.module').then(m => m.PatientModule) },
  { path: 'doctor', loadChildren: () => import('./doctor/doctor.module').then(m => m.DoctorModule) },
  { path: 'admin', loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule) },
  { path: 'patient/doctors', component: DoctorListComponent },
  { path: 'patient/labs', component: LabListComponent },
  { path: 'patient/lab-cart', component: LabCartComponent },
  { path: 'patient/lab-checkout', component: LabCheckoutComponent },
  { path: 'about', component: AboutComponent },
  { path: 'auth/login', component: LoginComponent },
  { path: 'auth/register', component: RegisterComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
