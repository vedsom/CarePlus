import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AdminService } from '../../services/admin.service';

@Component({
  selector: 'app-doctor-form',
  templateUrl: './doctor-form.component.html',
  styleUrls: ['./doctor-form.component.css']
})
export class DoctorFormComponent implements OnInit {
  doctor: any = { name: '', specialization: '', salary: '', address: '' };
  id: number | null = null;

  constructor(private adminService: AdminService, private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    this.id = this.route.snapshot.params['id'];
    if (this.id) {
      this.adminService.getDoctors().subscribe((docs) => {
        const found = docs.find((d: any) => d.id == this.id);
        if (found) this.doctor = found;
      });
    }
  }

  onSubmit() {
    const formData = new FormData();
    Object.keys(this.doctor).forEach(key => formData.append(key, this.doctor[key]));

    if (this.id) {
      this.adminService.updateDoctor(this.id, formData).subscribe(() => this.router.navigate(['/admin/doctors']));
    } else {
      this.adminService.addDoctor(formData).subscribe(() => this.router.navigate(['/admin/doctors']));
    }
  }
}
