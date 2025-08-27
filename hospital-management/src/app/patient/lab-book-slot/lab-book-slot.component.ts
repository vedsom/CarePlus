import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LabService } from '../services/lab.service';

interface LabTest {
  id: number;
  name: string;
  category: string;
  price: number;
}

@Component({
  selector: 'app-lab-book-slot',
  templateUrl: './lab-book-slot.component.html'
})
export class LabBookSlotComponent implements OnInit {
  test!: LabTest;
  testId!: number;
  labTests: LabTest[] = [];

  booking = {
    date: '',
    timeSlot: '',
    type: 'Lab Visit' // default
  };

  constructor(
    private route: ActivatedRoute, 
    private router: Router, 
    private labService: LabService
  ) {}

  ngOnInit() {
    this.testId = Number(this.route.snapshot.paramMap.get('id'));

    // FIXED: Fetch lab tests from backend instead of hardcoded data
    this.labService.getLabTests().subscribe({
      next: (tests) => {
        this.labTests = tests;
        this.test = tests.find(t => t.id === this.testId)!;
        
        if (!this.test) {
          console.error('Test not found');
          this.router.navigate(['/patient/labs']);
        }
      },
      error: (err) => {
        console.error('Failed to fetch lab tests', err);
        // Fallback to hardcoded data if backend fails
        this.labTests = [
          { id: 1, name: 'Blood Test', category: 'Pathology', price: 200 },
          { id: 2, name: 'X-Ray Chest', category: 'Radiology', price: 500 },
          { id: 3, name: 'MRI Brain', category: 'Radiology', price: 2500 },
          { id: 4, name: 'Urine Test', category: 'Pathology', price: 150 }
        ];
        this.test = this.labTests.find(t => t.id === this.testId)!;
      }
    });
  }

  confirmBooking() {
    // Validation
    if (!this.booking.date || !this.booking.timeSlot) {
      alert('Please select both date and time slot');
      return;
    }

    const newBooking = {
      testName: this.test.name,
      date: this.booking.date,
      timeSlot: this.booking.timeSlot,
      type: this.booking.type,
      status: 'Confirmed'
    };

    this.labService.createBooking(newBooking).subscribe({
      next: (res) => {
        console.log('Booking successful', res);
        alert(`Booking Confirmed!\nTest: ${this.test.name}\nDate: ${this.booking.date}\nTime: ${this.booking.timeSlot}`);
        this.router.navigate(['/patient/labs/manage']);
      },
      error: (err) => {
        console.error('Booking failed', err);
        
        // More detailed error handling
        if (err.status === 401) {
          alert('Please login to book a lab test');
          this.router.navigate(['/auth/login']);
        } else if (err.status === 0) {
          alert('Cannot connect to server. Please check if the gateway is running on port 5000');
        } else {
          alert('Failed to book slot, please try again');
        }
      }
    });
  }
}