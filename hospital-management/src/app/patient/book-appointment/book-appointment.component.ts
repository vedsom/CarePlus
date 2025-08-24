import { Component, OnInit } from '@angular/core';
import { AppointmentService, Appointment } from '../services/appointment.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-book-appointment',
  templateUrl: './book-appointment.component.html'
})
export class BookAppointmentComponent implements OnInit {
  appointment: Appointment = {
    patientName: '',
    date: '',
    time: '',
    doctorId: '',
    doctorName: '',
    diseaseDescription: ''
  };

  doctors = [
    { id: 1, name: 'Dr. Arjun Singh', speciality: 'Cardiologist' },
    { id: 2, name: 'Dr. Meera Nair', speciality: 'Neurologist' }
  ];

  constructor(
    private appointmentService: AppointmentService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params['doctorId']) {
        this.appointment.doctorId = params['doctorId'];
        this.appointment.doctorName = params['doctorName'];
      }
    });
  }

  bookAppointment() {
    if (!this.appointment.patientName || !this.appointment.date || !this.appointment.time || !this.appointment.doctorId) {
      alert('Please fill all details');
      return;
    }

    this.appointmentService.bookAppointment(this.appointment).subscribe({
      next: (res) => {
        alert(`✅ Appointment confirmed with ${this.appointment.doctorName} on ${this.appointment.date} at ${this.appointment.time}`);
      },
      error: (err) => {
        if (err.status === 409) {
          alert('⚠️ Doctor is not available at this time. Please choose another slot.');
        } else {
          alert('❌ Failed to book appointment. Try again.');
        }
      }
    });
  }
}
