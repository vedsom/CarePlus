import { Component, OnInit } from '@angular/core';
import { AppointmentService, Appointment } from '../services/appointment.service';
import { AuthService, UserProfile } from '../services/auth.service';

@Component({
  selector: 'app-manage-appointment',
  templateUrl: './manage-appointment.component.html',
  styleUrls: ['./manage-appointment.component.css']
})
export class ManageAppointmentComponent implements OnInit {
  // --- Start of class properties ---
  appointments: Appointment[] = [];
  editingId: number | null = null;
  editedAppointment: Partial<Appointment> = {};
  
  filter: string = 'upcoming'; // Default to upcoming
  patient: UserProfile | null = null;
  // --- End of class properties ---

  constructor(
    private appointmentService: AppointmentService, 
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.patient = this.authService.currentUserValue;
    this.loadAppointments();
  }

  // ✅ Method to load all appointments
  loadAppointments() {
    this.appointmentService.getAppointments().subscribe({
      next: (data) => {
        this.appointments = data;
      },
      error: (err) => console.error('Error fetching appointments:', err)
    });
  }

  // ✅ Method to enable edit mode
  startEdit(appt: Appointment) {
    this.editingId = appt.id ?? null;
    this.editedAppointment = { ...appt };
  }

  // ✅ Method to save an edited appointment
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

  // ✅ Method to cancel editing
  cancelEdit() {
    this.editingId = null;
    this.editedAppointment = {};
  }

  // ✅ Method to delete/cancel an appointment
  deleteAppointment(id: number | undefined) {
    if (!id) return;
    if (confirm('Are you sure you want to cancel this appointment?')) {
      // Assuming you have a cancel method, or just delete it
      this.appointmentService.deleteAppointment(id).subscribe(() => {
        // Reload appointments from the server to get the updated list
        this.loadAppointments();
      });
    }
  }

  // ✅ Getter for filtering appointments
  get filteredAppointments() {
    if (!this.appointments) return [];
    const now = new Date();
    
    return this.appointments.filter(appt => {
      // Combine date and time for accurate comparison
      const apptDateTime = new Date(`${appt.date}T${appt.time}`);
      
      if (this.filter === 'upcoming') return apptDateTime >= now && !appt.cancelled;
      if (this.filter === 'past') return apptDateTime < now && !appt.cancelled;
      if (this.filter === 'cancelled') return appt.cancelled;
      return true; // 'all'
    });
  }

  // ✅ Method to set the current filter
  setFilter(f: string) {
    this.filter = f;
  }

  // ✅ Method to get doctor's initials
  getDoctorInitials(name: string | undefined): string {
    if (!name) return '';
    const nameParts = name.split(' ');
    if (nameParts.length < 2) return nameParts[0]?.[0]?.toUpperCase() || '';
    return (nameParts[0][0] + nameParts[1][0]).toUpperCase();
  }

} // <--- ALL OF YOUR CODE MUST BE ABOVE THIS CLOSING BRACE