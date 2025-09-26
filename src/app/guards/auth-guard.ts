import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Auth } from '../services/auth';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private auth: Auth, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    const expectedRoles: string[] = route.data['roles'] || [];

    return this.auth.getCurrentUser().pipe(
      map(user => {
        if (!user) {
          this.router.navigate(['/signin']);
          return false;
        }

        if (expectedRoles.length > 0 && !expectedRoles.includes(user.role || '')) {
          this.router.navigate(['/unauthorized']); 
          return false;
        }

        return true;
      })
    );
  }
}
