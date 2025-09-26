import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Api } from '../../../../services/api';
import { TakeAssignment } from '../../../../models/take-assignment.model';
import { User, CompletedAssignments } from '../../../../models/user.model';
import { Assignment } from '../../../../models/assignments.model';
import { Auth } from '../../../../services/auth';

@Component({
  selector: 'app-assignment-questions',
  standalone: true,
  templateUrl: './assignment-questions.html',
  styleUrls: ['./assignment-questions.css'],
  imports: [CommonModule, FormsModule],
})
export class AssignmentQuestions implements OnInit {
  takeAssignments: TakeAssignment[] = [];
  userAnswers = signal<{ [key: string]: any }>({});
  score: number | null = null;
  totalQuestions: number = 0;
  percentage: number = 0;
  showScoreCard: boolean = false;
  
  assignmentTitle = '';
  selectedLevel = 'all';

  currentAssignmentIndex = 0;
  currentQuestionIndex = 0;

  timeLeft: number = 0;
  timerInterval: any;
  currentAssignmentTitle: string = '';

  user!: User;

  constructor(
    private api: Api,
    private route: ActivatedRoute,
    private router: Router, 
    private auth: Auth
  ) {}

  ngOnInit(): void {
    this.auth.getCurrentUser().subscribe((u) => {
      if (!u) {
        this.router.navigate(['/signin']);
      } else {
        this.user = u;
      }
    });

    this.assignmentTitle = this.route.snapshot.paramMap.get('title') || '';
    this.selectedLevel = this.route.snapshot.paramMap.get('level') || 'all';
    console.log(this.assignmentTitle);
    console.log(this.selectedLevel);

    this.route.paramMap.subscribe(params => {
      const rawTitle = params.get('title');
      const title = rawTitle ? decodeURIComponent(rawTitle) : null;
      const level = params.get('level');
      console.log('Title:', title, 'Level:', level);
    });

    if (this.assignmentTitle) {
      this.api.getTakeAssignments().subscribe((data: TakeAssignment[]) => {
      
        const filtered = data.filter(a => a.title === this.assignmentTitle);

        this.takeAssignments = filtered.map((a: TakeAssignment) => ({
          ...a,
          questions: Array.isArray(a.questions)
            ? a.questions
            : a.questions
            ? [a.questions]
            : [],
        }));

        
        this.takeAssignments.forEach((a) => {
          a.questions = a.questions.filter(
            (q) =>
              this.selectedLevel === 'all' ||
              q.level.toLowerCase() === this.selectedLevel.toLowerCase()
          );
        });

        
        const initialAnswers: { [key: string]: any } = {};
        this.takeAssignments.forEach((a) =>
          a.questions.forEach((_, i) => (initialAnswers[`${a.id}-${i}`] = ''))
        );
        this.userAnswers.set(initialAnswers);

        
        const duration = (this.currentAssignment as any)?.duration ?? 300;
        this.startTimer(duration, this.currentAssignment?.title ?? '');
      });
    }
  }

  get currentAssignment(): TakeAssignment | undefined {
    return this.takeAssignments[this.currentAssignmentIndex];
  }

  get currentQuestion() {
    return this.currentAssignment?.questions[this.currentQuestionIndex];
  }

  get isLastQuestion(): boolean {
    return this.currentAssignment
      ? this.currentQuestionIndex ===
          this.currentAssignment.questions.length - 1
      : true;
  }

  get isFirstQuestion(): boolean {
    return this.currentQuestionIndex === 0;
  }

  nextQuestion() {
    if (
      this.currentAssignment &&
      this.currentQuestionIndex < this.currentAssignment.questions.length - 1
    ) {
      this.currentQuestionIndex++;
    }
  }

  prevQuestion() {
    if (this.currentQuestionIndex > 0) {
      this.currentQuestionIndex--;
    }
  }

  onAnswerChange(assignmentId: string, questionIndex: number, value: any) {
    const currentAnswers = { ...this.userAnswers() };
    currentAnswers[`${assignmentId}-${questionIndex}`] = value;
    this.userAnswers.set(currentAnswers);
  }

  onSubmit(): void {
    let totalScore = 0;
    let total = 0;

    this.takeAssignments.forEach((a) =>
      a.questions.forEach((q, i) => {
        total++;
        const userAnswer = this.userAnswers()[`${a.id}-${i}`];
        const correctAnswer = q.options[q.correctAns];
        if (userAnswer === correctAnswer) totalScore++;
      })
    );

    this.score = totalScore;
    this.totalQuestions = total;
    this.percentage = total > 0 ? Math.round((totalScore / total) * 100) : 0;
    this.showScoreCard = true;

    const completedAssignment: CompletedAssignments = {
      id: this.firstAssignmentId,
      title: this.assignmentTitle,
      level: this.selectedLevel,
    };

    this.api.addCompletedAssignment(Number(this.user.id), completedAssignment).subscribe({
      next: (updatedUser) => {
        console.log('Assignment marked completed ', updatedUser);
        this.user = updatedUser;
      },
      error: (err) => {
        console.error('Failed to save completed assignment ', err);
      },
    });

    if (!this.user.completedAssignments) {
      this.user.completedAssignments = [];
    }

    const alreadyExists = this.user.completedAssignments.some(
      (a) => a.id === completedAssignment.id && a.level === completedAssignment.level
    );

    if (!alreadyExists) {
      this.user.completedAssignments.push(completedAssignment);
    }

    localStorage.setItem('currentUser', JSON.stringify(this.user));

    this.router.navigate(['/scorecard'], {
      queryParams: {
        assignmentId: this.firstAssignmentId,
        title: this.assignmentTitle,
        score: this.score ?? 0,
        total: this.totalQuestions ?? 0,
        percentage: this.percentage ?? 0,
      },
    });
  }

  retryAssignment(): void {
    this.showScoreCard = false;
    const resetAnswers: { [key: string]: any } = {};
    this.takeAssignments.forEach((a) =>
      a.questions.forEach((_, i) => (resetAnswers[`${a.id}-${i}`] = ''))
    );
    this.userAnswers.set(resetAnswers);
    this.score = null;
    this.totalQuestions = 0;
    this.percentage = 0;
    this.currentQuestionIndex = 0;
  }

  reviewAnswers() {
    console.log('Review answers clicked');
  }

  goToNextAssignment() {
    console.log('Next assignment clicked');
  }

  goToAssignments(): void {
    this.router.navigate(['/Assignments']);
  }

  get firstAssignmentId(): number {
    const id = this.takeAssignments?.[0]?.id;
    return id !== undefined ? +id : 0;
  }

  startTimer(duration: number, assignmentTitle: string) {
    this.clearTimer();
    this.timeLeft = duration;
    this.currentAssignmentTitle = assignmentTitle;

    this.timerInterval = setInterval(() => {
      if (this.timeLeft > 0) {
        this.timeLeft--;
      } else {
        this.clearTimer();
        alert(`Time is up for "${this.currentAssignmentTitle}"!`);
        this.router.navigate(['/Assignments']);
      }
    }, 1000);
  }

  clearTimer() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
  }

  formatTime(seconds: number): string {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  }

  ngOnDestroy() {
    this.clearTimer();
  }
}
