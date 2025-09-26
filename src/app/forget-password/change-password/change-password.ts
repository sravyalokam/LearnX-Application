import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Api } from '../../services/api';
import { OtpService } from '../../services/otp-service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-change-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './change-password.html',
  styleUrls: ['./change-password.css']
})
export class ChangePassword implements OnInit {
  submitted=false;
  form: FormGroup;
  successMessage: string | null = null;
  errorMessage: string | null = null;
  userId: number | null = null;
  loadingUser: boolean = true; 

  constructor(
    private fb: FormBuilder,
    private api: Api,
    private router: Router,
    private otpService: OtpService
  ) {
    this.form = this.fb.group({
      newPassword: [''],
      confirmPassword: ['']
    });
  }

  ngOnInit(): void {
    
    if (!this.otpService.otpVerified || !this.otpService.email) {
      this.router.navigate(['/forget-password']);
      return;
    }

  
    this.api.getUserByEmail(this.otpService.email).subscribe({
      next: (users: any[]) => {
        if (!users || users.length === 0) {
          this.router.navigate(['/forget-password']);
          return;
        }

        this.userId = users[0].id; 
        this.loadingUser = false;

       
        this.form = this.fb.group(
          {
             newPassword: ['', [
          Validators.required,
          Validators.minLength(8),
          Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])/)
        ]],
          confirmPassword: ['', Validators.required]
          },
          { validator: this.passwordsMatch }
        );
      },
      error: () => {
        this.loadingUser = false;
        this.router.navigate(['/forget-password']);
      }
    });
  }

  passwordsMatch(group: FormGroup) {
    return group.get('newPassword')?.value === group.get('confirmPassword')?.value
      ? null
      : { notMatching: true };
  }

  changePassword(): void {
    this.submitted=true;
    if (this.form.invalid || this.userId === null) {
      this.form.markAllAsTouched();
      return;
    }

    this.api.patchUser(this.userId, { password: this.form.value.newPassword }).subscribe({
      next: () => {
        this.successMessage = 'Password updated successfully!';
        this.otpService.clearOtp();
        setTimeout(() => this.router.navigate(['/signin']), 2000);
      },
      error: (err) => {
        console.error(err);
        this.errorMessage = 'Failed to update password. Please try again.';
      }
    });
  }
}
