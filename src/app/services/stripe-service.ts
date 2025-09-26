import { Injectable } from '@angular/core';
import { loadStripe, Stripe } from '@stripe/stripe-js';

@Injectable({
  providedIn: 'root'
})
export class StripeService {
  private stripePromise: Promise<Stripe | null>;

  constructor() {
    this.stripePromise = loadStripe('pk_test_51S7vAlRrP42AumGxBYDtioOmg1fLnwsnhxeJKM9s76aotp0TVY5RK2vD5uDhrhWPoLecE9xrLVTbvnL9GumK5Toz00FN5CMEJ9'); // Replace with your test public key
  }

  async getStripe() {
    return await this.stripePromise;
  }
}
