import { Component, OnInit } from '@angular/core';
import { LabService, LabBooking } from '../services/lab.service';

@Component({
  selector: 'app-manage-lab-bookings',
  templateUrl: './manage-lab-bookings.component.html'
})
export class ManageLabBookingsComponent implements OnInit {
  bookings: LabBooking[] = [];
  loading = true;

  constructor(private labService: LabService) {}

  ngOnInit(): void {
    this.loadBookings();
  }

  loadBookings() {
    this.loading = true;
    this.labService.getBookings().subscribe({
      next: (data) => {
        this.bookings = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Failed to load bookings', err);
        this.loading = false;
      }
    });
  }

  cancelBooking(booking_id: number) {
  if (confirm('Are you sure you want to cancel this booking?')) {
    this.labService.cancelBooking(booking_id).subscribe({
      next: () => {
        this.loadBookings(); // reload after deletion
        alert('Booking cancelled successfully');
      },
      error: (err) => console.error('Cancel failed', err)
    });
  }
}

rescheduleBooking(booking_id: number) {
  const newDate = prompt('Enter new date (YYYY-MM-DD):');
  const newSlot = prompt('Enter new time slot (e.g. Morning (8AM-12PM))');

  if (newDate && newSlot) {
    this.labService.rescheduleBooking(booking_id, { date: newDate, timeSlot: newSlot }).subscribe({
      next: (updated) => {
        this.loadBookings(); // reload after update
        alert('Booking rescheduled successfully');
      },
      error: (err) => console.error('Reschedule failed', err)
    });
  }
}

}
