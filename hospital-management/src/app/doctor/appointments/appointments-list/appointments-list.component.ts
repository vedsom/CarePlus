import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DoctorAppointmentService } from '../../services/doctor-appointment.service';

@Component({
  selector: 'app-appointments-list',
  templateUrl: './appointments-list.component.html'
})
export class AppointmentsListComponent implements OnInit {
  appointments: any[] = [];
  isLoading = true; // Add a loading state for better UX

  constructor(
    private router: Router,
    private appointmentService: DoctorAppointmentService // Inject the real service
  ) {}

  ngOnInit(): void {
    this.isLoading = true;
    // Call the service to get real appointments from the backend
    this.appointmentService.getAppointments().subscribe({
      next: (data) => {
        this.appointments = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error("Failed to fetch appointments", err);
        this.isLoading = false;
      }
    });
  }

  viewDetails(id: number): void {
    this.router.navigate(['/doctor/appointments', id]);
  }
}