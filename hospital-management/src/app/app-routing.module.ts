import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';

// Import all necessary components
import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';
import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component'; // Import the new layout
import { HomeComponent } from './home/home.component';
import { AboutComponent } from './public/about/about.component';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';

const routes: Routes = [
  // 1. Standalone routes (no layout)
  { path: 'auth/login', component: LoginComponent },
  { path: 'auth/register', component: RegisterComponent },

  // 2. Patient Portal Layout (Navbar + Footer)
  {
    path: '',
    component: MainLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      { path: 'home', component: HomeComponent },
      { path: 'about', component: AboutComponent },
      { 
        path: 'patient', 
        loadChildren: () => import('./patient/patient.module').then(m => m.PatientModule) 
      },
      // The default route for this layout
      { path: '', redirectTo: 'home', pathMatch: 'full' }
    ]
  },

  // 3. Doctor & Admin Portal Layout (Footer ONLY)
  {
    path: '',
    component: AdminLayoutComponent, // Use the new layout component
    canActivate: [AuthGuard],
    children: [
      { 
        path: 'doctor', 
        loadChildren: () => import('./doctor/doctor.module').then(m => m.DoctorModule) 
      },
      { 
        path: 'admin', 
        loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule) 
      }
    ]
  },

  // 4. Wildcard route to catch any other URL as a fallback
  { path: '**', redirectTo: 'home' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }