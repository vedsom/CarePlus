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

  booking = {
    date: '',
    timeSlot: '',
    type: 'Lab Visit' // default
  };

  constructor(private route: ActivatedRoute, private router: Router, private labService: LabService) {}

  ngOnInit() {
    this.testId = Number(this.route.snapshot.paramMap.get('id'));

    // ❗️Later we’ll fetch from backend, for now hardcoded list
    const mockTests: LabTest[] = [
      { id: 1, name: 'Blood Test', category: 'Pathology', price: 200 },
      { id: 2, name: 'X-Ray Chest', category: 'Radiology', price: 500 },
      { id: 3, name: 'MRI Brain', category: 'Radiology', price: 2500 },
      { id: 4, name: 'Urine Test', category: 'Pathology', price: 150 }
    ];
    this.test = mockTests.find(t => t.id === this.testId)!;
  }

confirmBooking() {
  const newBooking = {
    testName: this.test.name,
    date: this.booking.date,
    timeSlot: this.booking.timeSlot,
    type: this.booking.type,
    status: 'Confirmed'
  };

  this.labService.createBooking(newBooking).subscribe({
    next: (res) => {
      alert(`Booking Confirmed!\nTest: ${this.test.name}\nDate: ${this.booking.date}\nTime: ${this.booking.timeSlot}`);
      this.router.navigate(['/patient/labs/manage']);
    },
    error: (err) => {
      console.error('Booking failed', err);
      alert('Failed to book slot, please try again');
    }
  });
}


}
