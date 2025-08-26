import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-appointment-detail',
  templateUrl: './appointment-detail.component.html'
})
export class AppointmentDetailComponent implements OnInit {
  appointment: any;

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    // Replace with service call
    this.appointment = {
      id,
      patientName: 'John Doe',
      date: new Date(),
      status: 'Confirmed',
      notes: 'Patient has a fever and cough.'
    };
  }
}
