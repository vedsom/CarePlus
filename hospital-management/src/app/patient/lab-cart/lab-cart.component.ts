import { Component } from '@angular/core';
import { LabCartService, LabTest } from '../services/lab-cart.service';

@Component({
  selector: 'app-lab-cart',
  templateUrl: './lab-cart.component.html'
})
export class LabCartComponent {
  cart: LabTest[] = [];

  constructor(private cartService: LabCartService) {
    this.cart = this.cartService.getCart();
  }

  removeItem(id: number) {
    this.cartService.removeFromCart(id);
    this.cart = this.cartService.getCart();
  }

  getTotal() {
    return this.cartService.getTotal();
  }
}
