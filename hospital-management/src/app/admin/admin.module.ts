import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ManageDoctorsComponent } from './manage-doctors/manage-doctors.component';
import { ManageTestimonialsComponent } from './manage-testimonials/manage-testimonials.component';



@NgModule({
  declarations: [
    ManageDoctorsComponent,
    ManageTestimonialsComponent
  ],
  imports: [
    CommonModule
  ]
})
export class AdminModule { }
