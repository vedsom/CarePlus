import { Component, OnInit } from '@angular/core';
import { LabCartService } from '../services/lab-cart.service';
import { LabService, LabTest } from '../services/lab.service'; // Import service and interface
import { Router } from '@angular/router';
@Component({
  selector: 'app-lab-list',
  templateUrl: './lab-list.component.html',
  styleUrls: ['./lab-list.component.css']
})
export class LabListComponent implements OnInit { // Implement OnInit
  selectedCategory = '';
  labTests: LabTest[] = []; // Start with an empty array

  constructor(private cartService: LabCartService, private labService: LabService, private router: Router) {}
  
  ngOnInit(): void {
    // Fetch tests when the component loads
    this.labService.getLabTests().subscribe(tests => {
      this.labTests = tests;
    });
  }

  get filteredTests(): LabTest[] {
    return this.labTests.filter(t =>
      !this.selectedCategory || t.category === this.selectedCategory
    );
  }

  bookTest(test: LabTest) {
  // 1. Add test to cart
  this.cartService.addToCart(test);

  // 2. Navigate to booking form
  this.router.navigate(['/patient/labs/book', test.id]);
}
}