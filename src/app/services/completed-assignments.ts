import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CompletedAssignments {
  private completed: string[] = [];

  constructor() {
    this.completed = JSON.parse(localStorage.getItem('completedAssignments') || '[]');
  }

  getAll(): string[] {
    return this.completed;
  }

 
  isCompleted(title: string): boolean {
    return this.completed.includes(title);
  }

 
  markCompleted(title: string): void {
    if (!this.completed.includes(title)) {
      this.completed.push(title);
      this.save();
    }
  }

 
  unmarkCompleted(title: string): void {
    this.completed = this.completed.filter(t => t !== title);
    this.save();
  }

  private save(): void {
    localStorage.setItem('completedAssignments', JSON.stringify(this.completed));
  }
}
