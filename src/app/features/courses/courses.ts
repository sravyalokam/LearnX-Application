import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterModule, Router } from '@angular/router';
import { Courses } from '../../models/courses.model';
import { UpperCasePipe } from '@angular/common';
import { User } from '../../models/user.model';
import { Auth } from '../../services/auth';
import { Api } from '../../services/api';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { FormArray } from '@angular/forms';
import { Role } from '../../services/role';

@Component({
  selector: 'app-courses',
  imports: [CommonModule, RouterOutlet, RouterModule, UpperCasePipe, ReactiveFormsModule, FormsModule],
  templateUrl: './courses.html',
  styleUrl: './courses.css'
})
export class CoursesSection implements OnInit {

  @Input() courses: Courses[] = [];
  @Input() title: string = 'Courses';
  @Input() fetchCourses: boolean = true; 

  Admin: boolean =false;
  AssignmentManager: boolean=false;

  selectedFile: File | null = null;
  imagePreview: string | ArrayBuffer | null = null;


  // isAssignmentManager: boolean =false;
  user?: User;
  enrolledCourses: string[] = [];

  showCourseModal = false;
  courseForm!: FormGroup;

  constructor(
    private api: Api,
    private router: Router,
    private auth: Auth,
    private fb: FormBuilder,
    private role: Role
  ) {  
    
  }

 

  get chapters(): FormArray {
  return this.courseForm.get('chapters') as FormArray;
}

  ngOnInit(): void {

    this.Admin=this.role.isAdmin;
    this.AssignmentManager=this.role.isAssignmentManager;

    const session = this.auth.getSession();
    if (!session) {
      alert('User not logged in!');
      this.router.navigate(['/signin']);
      return;
    }


   this.courseForm = this.fb.group({
  title: ['', Validators.required],
  image: ['', Validators.required],
  rating: [0, [Validators.required, Validators.min(0), Validators.max(5)]],
  ratingsCount: ['', Validators.required],
  totalHours: ['', Validators.required],
  price: [0, [Validators.required, Validators.min(0)]],
  chapters: this.fb.array([]) 
});

    
    this.api.getUserById(session.userId).subscribe(user => {
      this.user = user;
      this.enrolledCourses = user.enrolledCourses || [];
      console.log('User Enrolled Courses:', this.enrolledCourses);
    });

    
    if ((!this.courses || this.courses.length === 0) && this.fetchCourses) {
      this.api.getCourses().subscribe(data => {
        this.courses = data;
      });
    }

    
    // this.auth.getCurrentUser().subscribe((user: User | null) => {
    //   if (user?.role === 'admin') {
    //     this.role.isAdmin = true;
    //   }
    //   else if(user?.role === 'assignment-manager'){
    //     this.isAssignmentManager=true;
    //   }
    // });
  }

  
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.selectedFile = input.files[0];

      this.courseForm.patchValue({ image: this.selectedFile.name });
      this.courseForm.get('image')?.updateValueAndValidity();

      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result;
      };
      reader.readAsDataURL(this.selectedFile);
    }
  }

  addChapter() {
    this.chapters.push(this.fb.group({
      id: [''], 
      title: ['', Validators.required],
      videoUrl: ['', Validators.required],
      videoDuration: ['', Validators.required],
      isActive: [false]
    }));
  }

   removeChapter(index: number) {
    this.chapters.removeAt(index);
  }

  
  onAddCourseSubmit(): void {
  if (this.courseForm.valid && this.imagePreview) {
    const newCourse: Courses = {
      title: this.courseForm.value.title,
      image: this.imagePreview as string,
      rating: this.courseForm.value.rating,
      ratingsCount: this.courseForm.value.ratingsCount,
      totalHours: this.courseForm.value.totalHours,
      price: this.courseForm.value.price,
      courseDetails: {
        description: [],                
        chapters: this.courseForm.value.chapters,  
        currentChapter: { title: '', videoUrl: '', videoDuration: '' },
        faqs: []
      }
    };

    this.api.postCourses(newCourse).subscribe({
      next: res => {
        alert('Course added successfully!');
        this.courseForm.reset();
        this.imagePreview = null;
        this.chapters.clear();
        this.closeCourseModal();
      },
      error: err => console.error('Error adding course:', err)
    });
  }
}


  
  handleEnrollment(isEnrolled: boolean, course: Courses) {
    if (isEnrolled || this.Admin) {
      this.router.navigate(['/course-details', course.title]);
    } else {
      this.router.navigate(['/course-enrollment', course.title]);
    }
  }

  openCourseModal() {
    this.showCourseModal = true;
  }

  closeCourseModal() {
    this.showCourseModal = false;
  }

  onSubmit(): void {
    if (this.courseForm.valid) {
      const newCourse = this.courseForm.value;
      console.log('Course Submitted:', newCourse);
    }
  }

  showDeleteModal = false;
selectedCourse: string | null = null;

openDeleteModal() {
  this.showDeleteModal = true;
}

closeDeleteModal() {
  this.showDeleteModal = false;
  this.selectedCourse = null;
}

onDeleteCourseSubmit() {
  if (!this.selectedCourse) return;

  const courseToDelete = this.courses.find(c => c.title === this.selectedCourse);
  if (!courseToDelete?.id) {
    console.error("Course not found or missing ID");
    return;
  }

  this.api.deleteCourse(courseToDelete.id).subscribe({
    next: () => {
      this.courses = this.courses.filter(c => c.id !== courseToDelete.id);
      console.log(`Deleted course: ${courseToDelete.title}`);
      alert('Course Deleted Successfully');
      this.closeDeleteModal();
    },
    error: (err) => {
      console.error('Error deleting course:', err);
      alert('Error deleting the course');
    }
  });
}





}
