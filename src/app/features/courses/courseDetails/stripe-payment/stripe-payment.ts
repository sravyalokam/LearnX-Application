import { Component } from '@angular/core';
import { loadStripe, Stripe } from '@stripe/stripe-js';

@Component({
  selector: 'app-stripe-payment',
  templateUrl: './stripe-payment.html',
  styleUrls: ['./stripe-payment.css']
})
export class StripePaymentComponent {
  stripe: Stripe | null = null;

  constructor() {
    this.initStripe();
  }

  async initStripe() {
    this.stripe = await loadStripe('pk_test_51S7vAlRrP42AumGxBYDtioOmg1fLnwsnhxeJKM9s76aotp0TVY5RK2vD5uDhrhWPoLecE9xrLVTbvnL9GumK5Toz00FN5CMEJ9'); // Your test publishable key
  }

  async pay() {
    if (!this.stripe) return;

    
    const { error } = await this.stripe.redirectToCheckout({
      lineItems: [
        { price: 'price_1S7vW7RrP42AumGx8pVq8MAF', quantity: 1 } 
      ],
      mode: 'payment',
      successUrl: window.location.href + '?success=true',
      cancelUrl: window.location.href + '?canceled=true'
    });

    if (error) {
      console.error(error);
    }
  }
}
