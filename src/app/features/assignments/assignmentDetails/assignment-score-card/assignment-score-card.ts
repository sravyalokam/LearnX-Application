import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AssignmentFeedbackForm } from '../assignment-feedback-form/assignment-feedback-form';
import { Api } from '../../../../services/api';
import { Auth } from '../../../../services/auth';
import { User, Feedback } from '../../../../models/user.model';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-assignment-score-card',
  standalone: true,
  imports: [CommonModule, AssignmentFeedbackForm],
  templateUrl: './assignment-score-card.html',
  styleUrls: ['./assignment-score-card.css']
})
export class AssignmentScoreCard implements OnInit {
  score = 0;
  totalQuestions = 0;
  percentage = 0;
  assignmentTitle = '';
  assignmentId = 0;

  currentUser: User | null = null;

  constructor(
    private api: Api,
    private auth: Auth,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
  
    this.auth.getCurrentUser().subscribe({
      next: (user) => {
        this.currentUser = user;
        console.log(' Current user loaded:', user);
      },
      error: (err) => {
        console.error(' Failed to load current user:', err);
        this.currentUser = null;
      }
    });

    this.route.queryParams.subscribe((params) => {
      this.score = +params['score'] || 0;
      this.totalQuestions = +params['total'] || 0;
      this.percentage = +params['percentage'] || 0;
      this.assignmentTitle = params['title'] || '';
      this.assignmentId = +params['assignmentId'] || 0;

      console.log(' ScoreCard loaded from query params:', {
        assignmentId: this.assignmentId,
        title: this.assignmentTitle,
        score: this.score,
        total: this.totalQuestions,
        percentage: this.percentage,
      });
    });
  }

  handleFeedback(event: { rating: number; comment: string }) {
    if (!this.currentUser?.id) {
      console.error(' No logged-in user found. Cannot save feedback.');
      alert('You must be logged in to submit feedback.');
      return;
    }

    const feedback: Feedback = {
      assignmentId: this.assignmentId,
      rating: event.rating,
      comment: event.comment,
    };

    this.api.addFeedbackToUser(this.currentUser.id, feedback).subscribe({
      next: (user) => {
        console.log(' Feedback saved successfully:', user);
        alert('Thank you! Your feedback was saved.');
      },
      error: (err) => {
        console.error(' Error saving feedback:', err);
        alert('Failed to save feedback. Please try again.');
      }
    });
  }
}






