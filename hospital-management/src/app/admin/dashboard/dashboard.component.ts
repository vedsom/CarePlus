import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import Chart from 'chart.js/auto';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  doctorsCount = 0;
  patientsCount = 0;
  chart: any;

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.loadStats();
  }

  loadStats(): void {
    this.userService.getStats().subscribe({
      next: (data) => {
        this.doctorsCount = data.doctors;
        this.patientsCount = data.patients;
        this.renderChart();   // 👈 draw chart after data comes
      },
      error: (err) => console.error('Error loading stats', err)
    });
  }

  renderChart(): void {
    if (this.chart) {
      this.chart.destroy(); // 👈 avoid duplicate charts
    }

    this.chart = new Chart("registrationChart", {
      type: 'bar',
      data: {
        labels: ['Doctors', 'Patients'],
        datasets: [{
          label: 'User Count',
          data: [this.doctorsCount, this.patientsCount],
          backgroundColor: ['#4e73df', '#1cc88a']
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false
      }
    });
  }
}
