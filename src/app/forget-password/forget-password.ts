import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import emailjs from '@emailjs/browser';
import { Router } from '@angular/router';
import { OtpService } from '../services/otp-service';
import { User } from '../models/user.model';
import { Api } from '../services/api';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-forget-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './forget-password.html',
  styleUrls: ['./forget-password.css']
})
export class ForgetPassword implements OnInit {
  user!: User;
  form!: FormGroup;
  successMessage: string | null = null;
  errorMessage: string | null = null;
  otp: string | null = null;
  submitted =false;
  emailNotFound: string | null = null;

  constructor(private fb: FormBuilder, private router: Router, private otpService: OtpService, private api: Api) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email, Validators.pattern(/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/) ]],
    });
  }

  get email() {
    return this.form.get('email');
  }

  sendEmail(): void {
  this.submitted = true;
  this.successMessage = null;
  this.errorMessage = null;

  if (this.form.invalid) {
    this.form.markAllAsTouched();
    return;
  }

  const emailValue = this.form.value.email;

  
  this.api.getUserByEmail(emailValue).subscribe({
    next: (users: User[]) => {
      if (!users || users.length === 0) {
        
        this.errorMessage = 'User does not exist with this email.';
        return;
      }

      
      this.otp = this.generateOTP();

      
      this.otpService.setOtp(this.otp, emailValue);

      
      const templateParams = {
        to_email: emailValue,
        otp: this.otp,
      };

      emailjs
        .send(
          'service_bf9iepq',
          'template_nvhrqwf',
          templateParams,
          'mtHaMyE3X7KJZAgdJ'
        )
        .then(() => {
  this.successMessage = `An OTP has been sent to ${emailValue}.`;
  
  
  setTimeout(() => {
    this.router.navigate(['/validate-otp']);
  }, 2000);
})
        .catch((error) => {
          console.error('FAILED...', error);
          this.errorMessage = 'Failed to send OTP. Please try again later.';
        });
    },
    error: (err) => {
      console.error('Error checking email:', err);
      this.errorMessage = 'Unable to verify email. Try again later.';
    },
  });
}


  generateOTP(): string {
    const otp = Math.floor(100000 + Math.random() * 900000); 
    return otp.toString();
  }
}
