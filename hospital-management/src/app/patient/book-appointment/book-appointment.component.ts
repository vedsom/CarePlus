import { Component, OnInit } from '@angular/core';
import { AppointmentService, Appointment } from '../services/appointment.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-book-appointment',
  templateUrl: './book-appointment.component.html',
  styleUrls: ['./book-appointment.component.css'] // Link to the CSS file
})
export class BookAppointmentComponent implements OnInit {
  appointment: Appointment = {
    id: 0,
    patientName: '',
    date: '',
    time: '',
    doctorId: '',
    doctorName: '',
    diseaseDescription: ''
  };

  doctors = [
    { id: 5, name: 'Dr. Arjun Singh', speciality: 'Cardiologist' },
    { id: 2, name: 'Dr. Meera Nair', speciality: 'Neurologist' },
    { id: 3, name: 'Dr. Priya Sharma', speciality: 'Pediatrician' },
    { id: 4, name: 'Dr. Rohan Gupta', speciality: 'Orthopedics' }
  ];

  isBooking = false;
  isSuccess = false;
  minDate: string;

  constructor(
    private appointmentService: AppointmentService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    // Set minimum date for the date picker to today
    this.minDate = new Date().toISOString().split('T')[0];
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params['doctorId']) {
        this.appointment.doctorId = params['doctorId'];
        const selectedDoctor = this.doctors.find(doc => doc.id == this.appointment.doctorId);
        if (selectedDoctor) {
            this.appointment.doctorName = selectedDoctor.name;
        }
      }
    });
  }

  onDoctorChange() {
      const selectedDoctor = this.doctors.find(doc => doc.id == this.appointment.doctorId);
      if (selectedDoctor) {
          this.appointment.doctorName = selectedDoctor.name;
      }
  }

  bookAppointment() {
    this.isBooking = true;
    this.isSuccess = false;

    if (!this.appointment.patientName || !this.appointment.date || !this.appointment.time || !this.appointment.doctorId) {
      alert('Please fill all required details');
      this.isBooking = false;
      return;
    }

    this.appointmentService.bookAppointment(this.appointment).subscribe({
      next: (res) => {
        this.isBooking = false;
        this.isSuccess = true;
        setTimeout(() => {
          this.router.navigate(['/patient/manage-appointment']);
        }, 2000);
      },
      error: (err) => {
        this.isBooking = false;
        if (err.status === 409) {
          alert('⚠️ Doctor is not available at this time. Please choose another slot.');
        } else {
          alert('❌ Failed to book appointment. Try again.');
        }
      }
    });
  }
}