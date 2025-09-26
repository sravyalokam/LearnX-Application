import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, switchMap } from 'rxjs';
import { Api } from './api';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class CurrentUser {
   private userSubject = new BehaviorSubject<User | null>(null);
  public user$ = this.userSubject.asObservable();

  constructor(private api: Api) {
    this.loadUserFromSession();
  }

  private loadUserFromSession() {
    const stored = localStorage.getItem('currentUser');
    if (stored) {
      const parsed: User = JSON.parse(stored);
      if (parsed.id) {
        

        this.api.getUserById(parsed.id).subscribe({
          next: (user) => this.setUser(user),
          error: () => this.setUser(parsed) 
        });
      }
    }
  }

  setUser(user: User) {
    this.userSubject.next(user);
    localStorage.setItem('currentUser', JSON.stringify(user));
  }

  getCurrentUser(): User | null {
    return this.userSubject.value;
  }

  refreshUserFromBackend(): Observable<User> {
    const current = this.getCurrentUser();
    if (!current?.id) return new Observable<User>((observer) => observer.complete());
    return this.api.getUserById(current.id).pipe(
      switchMap(user => {
        this.setUser(user);
        return new Observable<User>((observer) => {
          observer.next(user);
          observer.complete();
        });
      })
    );
}
}
