import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from '../models/user.model';
import { Api } from '../services/api';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-signup-page',
  standalone: true,
  imports: [ReactiveFormsModule, RouterModule, CommonModule],
  templateUrl: './signup-page.html',
  styleUrls: ['./signup-page.css']
})
export class SignupPage implements OnInit {
  form!: FormGroup;
  error: string | null = null;
  submitted = false; 

  constructor(
    private fb: FormBuilder,
    private api: Api,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.form = this.fb.group(
      {
        name: ['', [Validators.required, Validators.minLength(3), Validators.pattern(/^[A-Za-z\s]+$/) ]],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [
          Validators.required,
          Validators.minLength(8),
          Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])/)
        ]],
        confirmPassword: ['', Validators.required]
      },
      { validators: this.passwordMatchValidator }
    );
  }

  passwordMatchValidator(group: FormGroup) {
    const password = group.get('password')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { mismatch: true };
  }


  get name() { return this.form.get('name'); }
  get email() { return this.form.get('email'); }
  get password() { return this.form.get('password'); }
  get confirmPassword() { return this.form.get('confirmPassword'); }

  onSubmit(): void {
    this.submitted = true; 
    this.error = null;

    if (this.form.valid) {
      const user: User = {
        name: this.form.value.name,
        email: this.form.value.email,
        password: this.form.value.password,
        avatarUrl: 'https://api.dicebear.com/7.x/identicon/svg?seed=' + this.form.value.name,
        role: 'student',
        createdAt: new Date().toISOString()
      };

      
      this.api.getUsers().subscribe({
        next: (users: User[]) => {
          const existingUser = users.find(u => u.email === user.email);
          if (existingUser) {
            this.error = 'Email is already registered. Please sign in.';
          } else {
            
            this.api.addUser(user).subscribe({
              next: () => {
                alert('Signup successful!');
                this.router.navigate(['/signin']);
              },
              error: (err) => {
                console.error('Error adding user:', err);
                this.error = 'Something went wrong. Try again.';
              }
            });
          }
        },
        error: (err) => {
          console.error('Error fetching users:', err);
          this.error = 'Unable to check existing users.';
        }
      });
    } else {
      this.form.markAllAsTouched();
    }
  }
}
