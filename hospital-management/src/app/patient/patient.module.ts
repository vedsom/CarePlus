import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BookAppointmentComponent } from './book-appointment/book-appointment.component';
import { ManageAppointmentComponent } from './manage-appointment/manage-appointment.component';
import { FormsModule } from '@angular/forms';
import { PatientRoutingModule } from './patient-routing.module';
import { DoctorListComponent } from './doctor-list/doctor-list.component';
import { LabListComponent } from './lab-list/lab-list.component';
import { LabCartComponent } from './lab-cart/lab-cart.component';
import { LabCheckoutComponent } from './lab-checkout/lab-checkout.component';
import { LabBookSlotComponent } from './lab-book-slot/lab-book-slot.component';
import { ManageLabBookingsComponent } from './manage-lab-bookings/manage-lab-bookings.component';
import { HttpClientModule } from '@angular/common/http';
@NgModule({
  declarations: [
    BookAppointmentComponent,
    ManageAppointmentComponent,
    DoctorListComponent,
    LabListComponent,
    LabCartComponent,
    LabCheckoutComponent,
    LabBookSlotComponent,
    ManageLabBookingsComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    PatientRoutingModule,
    HttpClientModule
  ]
})
export class PatientModule { }
