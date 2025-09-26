import { Component, OnInit } from '@angular/core';
import { Api } from '../../services/api';
import { User } from '../../models/user.model';
import { Courses } from '../../models/courses.model';
import { Router } from '@angular/router';
import { Auth } from '../../services/auth';
import { CoursesSection } from '../courses/courses';
import { CommonModule } from '@angular/common';
import { ContactUs } from '../contact-us/contact-us';
import { AssignmentList } from '../assignments/assignments';
import { Assignment } from '../../models/assignments.model';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-profile-dashboard',
  imports: [CoursesSection, CommonModule, AssignmentList, ReactiveFormsModule],
  templateUrl: './profile-dashboard.html',
  styleUrls: ['./profile-dashboard.css']
})
export class ProfileDashboard implements OnInit {

  showModal = false;
  passwordForm!: FormGroup;

  
  user!: User;
  enrolledCourses: Courses[] = [];
  completedAssignmentsList!: Assignment[];

  constructor(
    private api: Api,
    private auth: Auth,
    private router: Router,
    private fb: FormBuilder
  ) {
    
    this.passwordForm = this.fb.group({
      currentPassword: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    });
  }


  changePassModel() {
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
  }


  onPasswordSubmit() {


    if (this.passwordForm.valid) {
      const { currentPassword, newPassword, confirmPassword } = this.passwordForm.value;

      if (newPassword !== confirmPassword) {
        alert('New password and confirm password do not match!');
        return;
      }

       this.api.changeUserPassword(Number(this.user.id),newPassword).subscribe(() =>{
          this.user.password=newPassword;
        })

      
      console.log('Password change request:', { currentPassword, newPassword });
      alert('Password updated successfully!');

      this.passwordForm.reset();
      this.closeModal();
    }
  }

 
  ngOnInit(): void {
    const session = this.auth.getSession();
    if (!session) {
      this.router.navigate(['/signin']);
      return;
    }

    this.auth.getCurrentUser().subscribe((u) => {
      if (!u) {
        this.router.navigate(['/signin']);
      } else {
        this.user = u;
      }
    });

    
    this.api.getUserById(session.userId).subscribe(user => {
      this.user = user;

      
      this.api.getAssignments().subscribe(assignments => {
        this.completedAssignmentsList = assignments.filter(a =>
          this.user.completedAssignments?.some(ca =>
            ca.title === a.title && ca.level === a.level
          )
        );
        console.log('Filtered completed assignments:', this.completedAssignmentsList);
      });

      
      if (this.user.enrolledCourses?.length) {
        this.api.getCourses().subscribe(allCourses => {
          this.enrolledCourses = allCourses.filter(course =>
            this.user.enrolledCourses?.includes(course.title)
          );
          console.log('Enrolled courses:', this.enrolledCourses);
        });
      } else {
        this.enrolledCourses = [];
      }
    });
  }
}
