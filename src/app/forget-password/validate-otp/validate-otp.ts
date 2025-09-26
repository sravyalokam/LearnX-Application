import { Component, OnInit, NgZone} from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { OtpService } from '../../services/otp-service';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-validate-otp',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './validate-otp.html',
  styleUrls: ['./validate-otp.css']
})
export class ValidateOtp implements OnInit {
  isValidOtp: boolean | null = null;
  submitted = false;
  isverify=false;
  form!: FormGroup;
  message: string | null = null;
  otpFromService: string | null = null;
  email: string | null = null;

  constructor(private fb: FormBuilder, private otpService: OtpService, private router: Router, private ngZone: NgZone) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      otp: ['', [Validators.required, Validators.pattern(/^\d{6}$/)]]
    });

    this.otpFromService = this.otpService.otp;
    this.email = this.otpService.email;

    console.log('OTP from service:', this.otpFromService);
    console.log('Email from service:', this.email);

    if (!this.otpFromService) {
      this.router.navigate(['/forget-password']);
    }
  }

  verifyOtp(): void {
    this.submitted=true;
    this.message='';
    console.log(`Beforecheck:`, this.form.value);
    if(this.form.invalid)
      {
        
        return;
        console.log(`check:`, this.form.value.otp);
      }else{
        console.log(`Testing`);
      }
    
    if (this.form.value.otp === this.otpFromService) {
      this.isValidOtp=true;
      this.message = 'OTP verified successfully';
       this.otpService.markVerified();
       this.isverify=true;
      this.ngZone.run(() => {
      setTimeout(() => {
        this.router.navigate(['/change-password']);
      }, 2000);
    });
    
    } else {
      this.isValidOtp=false;
      this.isverify=false;

      this.message = 'Invalid OTP. Please try again.';
    }
  }
}
