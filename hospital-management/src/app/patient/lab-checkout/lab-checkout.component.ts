import { Component } from '@angular/core';
import { LabCartService } from '../services/lab-cart.service';

@Component({
  selector: 'app-lab-checkout',
  templateUrl: './lab-checkout.component.html'
})
export class LabCheckoutComponent {
  total = 0;

  constructor(private cartService: LabCartService) {
    this.total = this.cartService.getTotal();
  }

  confirmBooking() {
    alert(`Booking confirmed! Payment of ₹${this.total} will be processed.`);
    this.cartService.clearCart();
  }
}
