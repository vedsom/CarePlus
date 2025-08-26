import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AdminService } from '../../services/admin.service';

@Component({
  selector: 'app-doctor-form',
  templateUrl: './doctor-form.component.html',
  styleUrls: ['./doctor-form.component.css']
})
export class DoctorFormComponent implements OnInit {
  // Initialize with default values
  doctor: any = { name: '', specialization: '', salary: null, address: '' };
  id: number | null = null;
  isEditMode = false;

  constructor(
    private adminService: AdminService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Check the URL for an 'id' parameter
    const idParam = this.route.snapshot.paramMap.get('id');
    
    if (idParam) {
      this.isEditMode = true;
      this.id = +idParam; // The '+' converts the string 'id' to a number
      console.log("Edit mode activated for doctor ID:", this.id);
      this.loadDoctorData(); // Call the function to fetch the data
    } else {
      console.log("Add mode activated. No doctor ID found in URL.");
    }
  }

  /**
   * Fetches the data for the specific doctor from the backend
   * and populates the form.
   */
  loadDoctorData(): void {
    if (!this.id) return;

    console.log("Fetching data for doctor...");
    this.adminService.getDoctorById(this.id).subscribe({
      next: (data) => {
        console.log("Data received from API:", data);
        // This is the crucial step: assign the fetched data to the 'doctor' object.
        // The form will automatically update because of the [(ngModel)] binding.
        this.doctor = data;
      },
      error: (err) => {
        console.error('Failed to load doctor data:', err);
        // Optionally, navigate away or show an error message
        // this.router.navigate(['/admin/doctors']); 
      }
    });
  }

  /**
   * Handles the form submission for both creating a new doctor
   * and updating an existing one.
   */
  onSubmit(): void {
    if (this.isEditMode && this.id) {
      this.adminService.updateDoctor(this.id, this.doctor).subscribe(() => {
        this.router.navigate(['/admin/doctors']);
      });
    } else {
      this.adminService.addDoctor(this.doctor).subscribe(() => {
        this.router.navigate(['/admin/doctors']);
      });
    }
  }
}