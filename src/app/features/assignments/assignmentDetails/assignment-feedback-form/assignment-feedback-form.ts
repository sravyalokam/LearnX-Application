import { Component, Input, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {CommonModule} from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-assignment-feedback-form',
    standalone: true,   
  imports: [FormsModule, CommonModule],
  templateUrl: './assignment-feedback-form.html',
  styleUrls: ['./assignment-feedback-form.css']
})
export class AssignmentFeedbackForm {
  // @Input() assignmentTitle: string = '';
  @Output() feedbackSubmitted = new EventEmitter<{ rating: number, comment: string }>();

  constructor(private router: Router) {}

  rating: number = 0;
  comment: string = '';

  submitFeedback() {
    this.feedbackSubmitted.emit({ rating: this.rating, comment: this.comment });

    this.rating = 0;
    this.comment = '';
    alert('Thank you for your feedback!');

    setTimeout(() =>{
      this.router.navigate(['/Assignments']);
    },1000);
  }
}
