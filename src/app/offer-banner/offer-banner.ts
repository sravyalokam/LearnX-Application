import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-offer-banner',
  imports: [CommonModule],
  templateUrl: './offer-banner.html',
  styleUrl: './offer-banner.css'
})
export class OfferBanner {
  @Output() close = new EventEmitter<void>();

  closeBanner() {
    this.close.emit();
  }

 
}
