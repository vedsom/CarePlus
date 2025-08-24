import { Component } from '@angular/core';
import { LabCartService } from '../services/lab-cart.service';

interface LabTest {
  id: number;
  name: string;
  category: string;
  price: number;
}

@Component({
  selector: 'app-lab-list',
  templateUrl: './lab-list.component.html'
})
export class LabListComponent {
  selectedCategory = '';
  labTests: LabTest[] = [
    { id: 1, name: 'Blood Test', category: 'Pathology', price: 200 },
    { id: 2, name: 'X-Ray Chest', category: 'Radiology', price: 500 },
    { id: 3, name: 'MRI Brain', category: 'Radiology', price: 2500 },
    { id: 4, name: 'Urine Test', category: 'Pathology', price: 150 }
  ];

  constructor(private cartService: LabCartService) {}

  get filteredTests(): LabTest[] {
    return this.labTests.filter(t =>
      !this.selectedCategory || t.category === this.selectedCategory
    );
  }

  bookLab(test: LabTest) {
    this.cartService.addToCart(test); // <-- Add this line
    alert(`${test.name} added to cart!`);
  }
  addToCart(test: LabTest) {
    this.cartService.addToCart(test);
    alert(`${test.name} added to cart`);
  }
}



