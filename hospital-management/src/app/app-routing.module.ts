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

  // 3. Wildcard route to redirect unknown URLs to login
  { path: '**', redirectTo: 'auth/login' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }