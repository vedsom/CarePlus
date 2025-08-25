import { Component, OnInit } from '@angular/core';
import { LabCartService } from '../services/lab-cart.service';
import { LabService, LabTest } from '../services/lab.service'; // Import service and interface

@Component({
  selector: 'app-lab-list',
  templateUrl: './lab-list.component.html'
})
export class LabListComponent implements OnInit { // Implement OnInit
  selectedCategory = '';
  labTests: LabTest[] = []; // Start with an empty array

  constructor(private cartService: LabCartService, private labService: LabService) {}
  
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
  
  addToCart(test: LabTest) {
    this.cartService.addToCart(test);
    alert(`${test.name} added to cart`);
  }
}