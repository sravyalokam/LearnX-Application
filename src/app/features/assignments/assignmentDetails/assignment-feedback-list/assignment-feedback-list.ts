import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Api } from '../../../../services/api';
import { User, Feedback } from '../../../../models/user.model';

@Component({
  selector: 'app-feedback-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './assignment-feedback-list.html',
  styleUrls: ['./assignment-feedback-list.css']
})
export class FeedbackList implements OnInit {
  feedbacks: { user: User; feedback: Feedback }[] = [];
  loading = true;

  constructor(private api: Api) {}

  ngOnInit() {
    this.api.getAllFeedbacks().subscribe({
      next: (data) => {
        this.feedbacks = data;
        this.loading = false;
      },
      error: (err) => {
        console.error(' Error loading feedbacks', err);
        this.loading = false;
      }
    });
  }
}
