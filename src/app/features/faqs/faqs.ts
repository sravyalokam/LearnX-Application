import { Component, OnInit, Input } from '@angular/core';
import { Api } from '../../services/api';
import { FAQs } from '../../models/faqs.model';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router'

@Component({
  selector: 'app-faqs',
  imports: [CommonModule, RouterModule],
  templateUrl: './faqs.html',
  styleUrl: './faqs.css'
})
export class Faqs implements OnInit {
    faqs: FAQs[] = [];   
    constructor(private api : Api) {}

    ngOnInit(): void {
      this.api.getFaqs().subscribe((data) => {
        this.faqs = data;
      });
    }

    toggleFaq(faq: FAQs): void {
        // faqs.isExpanded = !faq.isExpanded;
      }

  //  @Input() faqs: FAQs[] = [];   
  //   toggleFaq(faq: FAQs): void {
  //     faq.isExpanded = !faq.isExpanded;
  //   }

}
