import { Component } from '@angular/core';
import { Router } from '@angular/router';

interface Doctor {
  id: number;
  name: string;
  speciality: string;
  experience: number;
  hospital: string;
  fees: number;
}

@Component({
  selector: 'app-doctor-list',
  templateUrl: './doctor-list.component.html'
})
export class DoctorListComponent {
  searchText = '';
  selectedSpeciality = '';
  doctors: Doctor[] = [
    { id: 1, name: 'Dr. Arjun Singh', speciality: 'Cardiologist', experience: 12, hospital: 'Apollo', fees: 500 },
    { id: 2, name: 'Dr. Meera Nair', speciality: 'Neurologist', experience: 8, hospital: 'AIIMS', fees: 600 },
    { id: 3, name: 'Dr. Rahul Verma', speciality: 'Orthopedic', experience: 15, hospital: 'Fortis', fees: 700 }
  ];

  constructor(private router: Router) {}

  get filteredDoctors(): Doctor[] {
    return this.doctors.filter(d =>
      (!this.searchText || d.name.toLowerCase().includes(this.searchText.toLowerCase())) &&
      (!this.selectedSpeciality || d.speciality === this.selectedSpeciality)
    );
  }

  bookAppointment(doctor: Doctor) {
    this.router.navigate(['/patient/book-appointment'], {
      queryParams: { doctorId: doctor.id, doctorName: doctor.name }
    });
  }
}
