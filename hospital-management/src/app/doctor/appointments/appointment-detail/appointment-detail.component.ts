import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DoctorAppointmentService } from '../../services/doctor-appointment.service'; // Ensure this path is correct

@Component({
  selector: 'app-appointment-detail',
  templateUrl: './appointment-detail.component.html',
  styleUrls: ['./appointment-detail.component.css']
})
export class AppointmentDetailComponent implements OnInit {
  appointment: any;
  isLoading = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private appointmentService: DoctorAppointmentService // Inject the service
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isLoading = true;
      // Fetch the real appointment data from the service
      this.appointmentService.getAppointmentById(+id).subscribe({
        next: (data) => {
          this.appointment = data;
          this.isLoading = false;
        },
        error: (err) => {
          console.error("Failed to fetch appointment details", err);
          this.isLoading = false;
        }
      });
    }
  }

  // Method to update the status
  updateStatus(newStatus: string): void {
    if (!this.appointment) return;

    this.appointmentService.updateAppointment(this.appointment.id, newStatus).subscribe({
      next: () => {
        // Navigate back to the list after a successful update
        this.router.navigate(['/doctor/appointments']);
      },
      error: (err) => {
        console.error(`Failed to update status to ${newStatus}`, err);
        // Optionally show an error message to the user
      }
    });
  }
}
