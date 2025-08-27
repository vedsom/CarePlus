import { Component } from '@angular/core';
import { LabCartService } from '../services/lab-cart.service';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

@Component({
  selector: 'app-lab-checkout',
  templateUrl: './lab-checkout.component.html',
  styleUrls: ['./lab-checkout.component.css']
})
export class LabCheckoutComponent {
  cart: any[] = [];
  total = 0;

  constructor(private cartService: LabCartService) {
    this.cart = this.cartService.getCart();
    this.total = this.cartService.getTotal();
  }

  confirmBooking() {
    alert(`Booking confirmed! Payment of ₹${this.total} will be processed.`);
    this.cartService.clearCart();
  }

  downloadBill() {
    const doc = new jsPDF();

    // Header
    doc.setFontSize(18);
    doc.text('CarePlus Hospital', 105, 15, { align: 'center' });
    doc.setFontSize(14);
    doc.text('Lab Test Bill / Invoice', 105, 25, { align: 'center' });

    // Invoice details
    const date = new Date().toLocaleString();
    doc.setFontSize(11);
    doc.text(`Date: ${date}`, 14, 40);

    // Table with tests
    autoTable(doc, {
      head: [['Test Name', 'Price (Rs.)']],
      body: this.cart.map(item => [item.name, item.price]),
      startY: 50,
      theme: 'grid',
      headStyles: { fillColor: [22, 160, 133], halign: 'center' }, // teal header
      bodyStyles: { halign: 'center' },
    });

    // Total
    const finalY = (doc as any).lastAutoTable.finalY || 70;
    doc.setFontSize(13);
    doc.text(`Total: Rs.${this.total}`, 14, finalY + 15);

    // Footer note
    doc.setFontSize(10);
    doc.text('Thank you for choosing CarePlus Hospital!', 105, finalY + 30, { align: 'center' });

    // Save file
    doc.save('careplus_bill.pdf');
  }
}
