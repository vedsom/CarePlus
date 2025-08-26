import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-appointments-list',
  templateUrl: './appointments-list.component.html'
})
export class AppointmentsListComponent implements OnInit {
  appointments: any[] = [];

  constructor(private router: Router) {}

  ngOnInit(): void {
    // Later this should be replaced with a service call (to backend API)
    this.appointments = [
      { id: 1, patientName: 'John Doe', date: new Date(), status: 'Confirmed' },
      { id: 2, patientName: 'Jane Smith', date: new Date(), status: 'Pending' },
      { id: 3, patientName: 'Robert Brown', date: new Date(), status: 'Completed' }
    ];
  }

  viewDetails(id: number): void {
    this.router.navigate(['/doctor/appointments', id]);
  }
}
