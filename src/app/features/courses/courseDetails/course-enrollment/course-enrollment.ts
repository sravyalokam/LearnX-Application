import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Courses } from '../../../../models/courses.model';
import { Api } from '../../../../services/api';
import { Auth } from '../../../../services/auth';

@Component({
  selector: 'app-course-enrollment',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule],
  templateUrl: './course-enrollment.html',
  styleUrls: ['./course-enrollment.css']
})
export class CourseEnrollment implements OnInit {
  @Output() isEnrolled = new EventEmitter<boolean>;

  showSuccess: boolean = false; 

  enrollForm!: FormGroup;
  couponCode: string = '';
  couponMsg: string = '';
  confirmed: boolean = false;
  enrolling: boolean = false;

  
showToast: boolean = false;
toastMsg: string = '';
toastType: 'success' | 'error' = 'success';

  paymentMethod: string = 'card';

  course!: Courses; 
  breakdown = {
    courseFee: 0,
    discount: 0,
    total: 0
  };

  userId!: number; 

  constructor(
    private fb: FormBuilder,
    private api: Api,
    private route: ActivatedRoute,
    private router: Router,
    private auth: Auth 
  ) {}

  ngOnInit() {
  const session = this.auth.getSession();
  if (!session) {
    alert('User not logged in!');
    this.router.navigate(['/signin']);
    return;
  }
  this.userId = session.userId; 

  this.enrollForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]]
  });

  const courseTitle = this.route.snapshot.paramMap.get('title');
  if (courseTitle) {
    this.api.getCourseByTitle(courseTitle).subscribe((res) => {
      if (res.length > 0) {
        this.course = res[0]; 
        this.breakdown.courseFee = this.course.price;
        this.breakdown.total = this.course.price;
      }
    });
  }
}

  applyCoupon() {
    if (this.couponCode.trim().toLowerCase() === 'learnx50') {
      this.breakdown.discount = this.breakdown.courseFee * 0.5;
      this.couponMsg = 'Coupon applied! 50% off';
    } else {
      this.breakdown.discount = 0;
      this.couponMsg = 'Invalid coupon';
    }
    this.breakdown.total = this.breakdown.courseFee - this.breakdown.discount;
  }



onSubmit() {
  if (!this.course || !this.course.title) {
    alert('Course not loaded!');
    return;
  }

  this.enrolling = true;
  this.isEnrolled.emit(true);

  this.api.addCourseToUser(this.userId, this.course.title).subscribe({
    next: updatedUser => {
      console.log('Course added:', updatedUser.enrolledCourses);

      
      this.showSuccess = true;
      this.enrolling = false;

     
      setTimeout(() => {
        this.showSuccess = false;
        this.router.navigate(['/course-details', this.course.title]);
      }, 3000);
    },
    error: err => {
      console.error('Error:', err);
      alert('Failed to enroll in the course. Please try again.');
      this.enrolling = false;
    }
  });
}



showToastMessage(message: string, type: 'success' | 'error') {
  this.toastMsg = message;
  this.toastType = type;
  this.showToast = true;

  setTimeout(() => this.showToast = false, 0); 
}


  closeConfirmation() {
    this.confirmed = false;
  }
}
