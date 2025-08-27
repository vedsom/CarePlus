import { Component, OnInit } from '@angular/core';
import { LabService, LabBooking } from '../services/lab.service';

@Component({
  selector: 'app-manage-lab-bookings',
  templateUrl: './manage-lab-bookings.component.html',
  styleUrls: ['./manage-lab-bookings.component.css']
})
export class ManageLabBookingsComponent implements OnInit {
  bookings: LabBooking[] = [];
  loading = true;

  constructor(private labService: LabService) {}

  ngOnInit(): void {
    this.loadBookings();
  }

  loadBookings(): void {
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

  // UPDATED: This method now uses the correct service function name
  deleteBooking(booking_id: number): void {
    if (confirm('Are you sure you want to cancel this booking?')) {
      this.labService.deleteBooking(booking_id).subscribe({
        next: () => {
          this.loadBookings(); // Reload the list after a successful deletion
          alert('Booking cancelled successfully');
        },
        error: (err) => {
          console.error('Cancel failed', err);
          alert('Failed to cancel booking.');
        }
      });
    }
  }

  // UPDATED: This method now uses the correct service function name
  updateBooking(booking_id: number): void {
    const newDate = prompt('Enter new date (YYYY-MM-DD):');
    const newSlot = prompt('Enter new time slot (e.g. Morning (8AM-12PM))');

    if (newDate && newSlot) {
      const payload = { date: newDate, timeSlot: newSlot };
      this.labService.updateBooking(booking_id, payload).subscribe({
        next: (updated) => {
          this.loadBookings(); // Reload the list after a successful update
          alert('Booking rescheduled successfully');
        },
        error: (err) => {
          console.error('Reschedule failed', err);
          alert('Failed to reschedule booking.');
        }
      });
    }
  }

} // <--- ALL METHODS MUST BE INSIDE THIS CLOSING BRACE