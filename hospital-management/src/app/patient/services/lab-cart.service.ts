import { Injectable } from '@angular/core';

export interface LabTest {
  id: number;
  name: string;
  price: number;
}

@Injectable({
  providedIn: 'root'
})
export class LabCartService {
  private cart: LabTest[] = [];

  getCart(): LabTest[] {
    return this.cart;
  }

  addToCart(test: LabTest): void {
    this.cart.push(test);
  }

  removeFromCart(id: number): void {
    this.cart = this.cart.filter(item => item.id !== id);
  }

  clearCart(): void {
    this.cart = [];
  }

  getTotal(): number {
    return this.cart.reduce((sum, item) => sum + item.price, 0);
  }
}
