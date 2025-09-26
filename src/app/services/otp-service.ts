import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class OtpService {
  public otp: string | null = null;
  public email: string | null = null;
  public otpVerified: boolean = false;

  setOtp(otp: string, email: string) {
    this.otp = otp;
    this.email = email;
    this.otpVerified = false;
  }

  markVerified() {
    this.otpVerified = true;
  }

  clearOtp() {
    this.otp = null;
    this.email = null;
    this.otpVerified = false;
  }
}
