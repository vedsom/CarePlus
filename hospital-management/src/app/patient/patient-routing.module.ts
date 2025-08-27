import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BookAppointmentComponent } from './book-appointment/book-appointment.component';
import { ManageAppointmentComponent } from './manage-appointment/manage-appointment.component';
import { ManageLabBookingsComponent } from './manage-lab-bookings/manage-lab-bookings.component';
import { LabBookSlotComponent } from './lab-book-slot/lab-book-slot.component';
import { LabListComponent } from './lab-list/lab-list.component';
import { LabCartComponent } from './lab-cart/lab-cart.component';
import { LabCheckoutComponent } from './lab-checkout/lab-checkout.component';

const routes: Routes = [
  { path: 'book-appointment', component: BookAppointmentComponent },
  { path: 'manage-appointment', component: ManageAppointmentComponent },
  { path: 'labs/book/:id', component: LabBookSlotComponent },
  { path: 'labs/manage', component: ManageLabBookingsComponent },
  { path: 'labs/tests', component: LabListComponent },
  { path: 'lab-cart', component: LabCartComponent },
  { path: 'lab-checkout', component: LabCheckoutComponent },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PatientRoutingModule { }
