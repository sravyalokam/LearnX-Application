import { Component, Input } from '@angular/core';
import { Faq } from '../../../../models/courses.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-course-faqs',
  imports: [CommonModule],
  templateUrl: './course-faqs.html',
  styleUrl: './course-faqs.css'
})
export class CourseFAQs {
  @Input() faqs: Faq[] = [];
  toggleFaq(faq: Faq): void {
    faq.isExpanded = !faq.isExpanded;
  }
}
