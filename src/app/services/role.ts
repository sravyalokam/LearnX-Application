import { Injectable, OnInit } from '@angular/core';
import { Auth } from './auth';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class Role implements OnInit {
  user!: User;

  isAdmin: boolean = false;
  isAssignmentManager: boolean = false;

  constructor(private auth: Auth) {}

  ngOnInit(): void {
     this.auth.getCurrentUser().subscribe((u) => {
      if (u) {
        this.user = u;
        if(this.user.role==='admin'){
          this.isAdmin=true;
        }
        else if(this.user.role==='assignment-manager'){
          this.isAssignmentManager=true;
        }
      }
    });
  }

  // private setRoleFlags(): void {
  //   this.isAdmin = this.user?.role === 'admin';
  //   this.isAssignmentManager = this.user?.role === 'assignment-manager';
  // }
}
