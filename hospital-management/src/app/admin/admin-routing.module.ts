import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AdminComponent } from './admin/admin.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { DoctorListComponent } from './doctor-management/doctor-list/doctor-list.component';
import { DoctorFormComponent } from './doctor-management/doctor-form/doctor-form.component';

const routes: Routes = [
  {
    path: '',
    component: AdminComponent,
    children: [
      { path: '', component: DashboardComponent },   // /admin
      { path: 'doctors', component: DoctorListComponent },
      { path: 'doctors/new', component: DoctorFormComponent },
      { path: 'doctors/edit/:id', component: DoctorFormComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule {}
