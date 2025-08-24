import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ManageDoctorsComponent } from './manage-doctors/manage-doctors.component';
import { ManageTestimonialsComponent } from './manage-testimonials/manage-testimonials.component';

const routes: Routes = [
  { path: 'manage-doctors', component: ManageDoctorsComponent },
  { path: 'manage-testimonials', component: ManageTestimonialsComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
