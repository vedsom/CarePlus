import { Component, OnInit } from '@angular/core';
import { AppointmentService, Appointment } from '../services/appointment.service';

@Component({
  selector: 'app-manage-appointment',
  templateUrl: './manage-appointment.component.html',
  styleUrls: ['./manage-appointment.component.css']
})
export class ManageAppointmentComponent implements OnInit {
  appointments: Appointment[] = [];
  editingId: number | null = null;
  editedAppointment: Partial<Appointment> = {};

  constructor(private appointmentService: AppointmentService) {}

  ngOnInit(): void {
    this.loadAppointments();
  }

  // ✅ Load all appointments
  loadAppointments() {
    this.appointmentService.getAppointments().subscribe({
      next: (data) => {
        this.appointments = data;
      },
      error: (err) => console.error('Error fetching appointments:', err)
    });
  }

  // ✅ Enable edit mode
  startEdit(appt: Appointment) {
  this.editingId = appt.id ?? null;   // if no id, keep null
  this.editedAppointment = { ...appt };
}

  // ✅ Save edited appointment
  saveEdit(id: number | undefined) {
  if (!id) return;
  this.appointmentService.updateAppointment(id, this.editedAppointment).subscribe({
      next: () => {
        alert('Appointment updated!');
        this.editingId = null;
        this.loadAppointments();
      },
      error: (err) => console.error('Error updating appointment:', err)
    });
  }

  // ✅ Cancel edit
  cancelEdit() {
    this.editingId = null;
    this.editedAppointment = {};
  }

  // ✅ Delete appointment
  deleteAppointment(id: number | undefined) {
  if (!id) return;
  if (confirm('Are you sure you want to cancel this appointment?')) {
    this.appointmentService.cancelAppointment(id).subscribe({
        next: () => {
          alert('Appointment deleted!');
          this.loadAppointments();
        },
        error: (err) => console.error('Error deleting appointment:', err)
      });
    }
  }
}
