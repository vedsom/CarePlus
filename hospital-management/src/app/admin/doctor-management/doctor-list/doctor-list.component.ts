import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../services/admin.service';

@Component({
  selector: 'app-doctor-list',
  templateUrl: './doctor-list.component.html',
  styleUrls: ['./doctor-list.component.css']
})
export class DoctorListComponent implements OnInit {
  doctors: any[] = [];

  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    this.loadDoctors();
  }

  loadDoctors() {
    this.adminService.getDoctors().subscribe(data => {
      this.doctors = data;
    });
  }

  deleteDoctor(id: number) {
    if (confirm("Are you sure you want to delete this doctor?")) {
      this.adminService.deleteDoctor(id).subscribe(() => this.loadDoctors());
    }
  }

  downloadPDF() {
    this.adminService.downloadDoctorsPDF().subscribe((res) => {
      const blob = new Blob([res], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = "doctors.pdf";
      a.click();
      window.URL.revokeObjectURL(url);
    });
  }
}
