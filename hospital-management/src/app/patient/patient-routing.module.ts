import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BookAppointmentComponent } from './book-appointment/book-appointment.component';
import { ManageAppointmentComponent } from './manage-appointment/manage-appointment.component';
import { ManageLabBookingsComponent } from './manage-lab-bookings/manage-lab-bookings.component';
import { LabBookSlotComponent } from './lab-book-slot/lab-book-slot.component';

const routes: Routes = [
  { path: 'book-appointment', component: BookAppointmentComponent },
  { path: 'manage-appointment', component: ManageAppointmentComponent },
  { path: 'labs/book/:id', component: LabBookSlotComponent },
  { path: 'labs/manage', component: ManageLabBookingsComponent },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PatientRoutingModule { }
