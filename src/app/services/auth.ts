import { Injectable } from '@angular/core';
import { Api } from '../services/api';
import { User } from '../models/user.model';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class Auth {
  private readonly storageKey = 'learnx_session';

  constructor(private api: Api) {}

  
  login(email: string, password: string): Observable<User | null> {
    return this.api.get<User[]>(`users?email=${encodeURIComponent(email)}`)
      .pipe(
        map(users => {
          const user = users && users.length ? users[0] : null;

      
          if (!user) {
            return null;
          }

          
          if (user.password !== password) {
            return null;
          }

          
          const token = btoa(`${user.id}:${Date.now()}`);
          const session = { token, userId: user.id, createdAt: new Date().toISOString() };
          sessionStorage.setItem(this.storageKey, JSON.stringify(session));

          return user;
        })
      );
  }

  logout(): void {
    sessionStorage.removeItem(this.storageKey);
    localStorage.removeItem(this.storageKey);
     console.log('Session cleared:', this.storageKey);
  }

  getSession(): { token: string; userId: number; createdAt: string } | null {
    const data = sessionStorage.getItem(this.storageKey) || localStorage.getItem(this.storageKey);
    return data ? JSON.parse(data) : null;
  }

  isLoggedIn(): boolean {
    return !!this.getSession();
  }

  getCurrentUser(): Observable<User | null> {
    const session = this.getSession();
    if (!session) return of(null);
    return this.api.get<User>(`users/${session.userId}`);
  }
}
