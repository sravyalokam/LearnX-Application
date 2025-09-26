import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule, TitleCasePipe } from '@angular/common';
import { FormsModule, FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule } from '@angular/forms'; 
import { Router, RouterModule } from '@angular/router';
import { Api } from '../../services/api';
import { Assignment, DetailedCourse } from '../../models/assignments.model';
import { Courses } from '../../models/courses.model';
import { User } from '../../models/user.model';
import { Auth } from '../../services/auth';
import { AbstractControl } from '@angular/forms';
import { TakeAssignment } from '../../models/take-assignment.model';
import { Role } from '../../services/role';


@Component({
  selector: 'app-assignments',
  standalone: true,
  templateUrl: './assignments.html',
  styleUrls: ['./assignments.css'],
  imports: [CommonModule, TitleCasePipe, RouterModule, FormsModule, ReactiveFormsModule], 
})
export class AssignmentList implements OnInit, OnChanges {
  @Input() assignmentsInput: Assignment[]=[];
  @Input() fetchAssignments: boolean = true;
  @Input() title: string = "Assignments";
  @Input() filter: boolean = true;

  isAdmin: boolean = false;
  isAssignmentManager: boolean = false;

  user! : User | null;
  
  assignments: Assignment[] = [];
  detailedCourses: DetailedCourse[] = [];
  courses: Courses[] = [];

  selectedCourse: string = 'all';
  selectedLevel: string = 'all';
  searchTerm: string = '';

  
  showAddModal: boolean = false;
  assignmentForm!: FormGroup;

  // assignments: TakeAssignment[] = [];

  constructor(private api: Api, private router: Router, private auth: Auth, private fb: FormBuilder, private role: Role) {}

  ngOnInit(): void {

    // this.auth.getCurrentUser().subscribe(u => {
    //   this.user = u;  
    //   if(this.user?.role==='admin') {
    //     this.isAdmin=true;
    //   }
    //   else if(this.user?.role === 'assignment-manager'){
    //     this.isAssignmentManager=true;
    //   }
    // });

    this.isAdmin=this.role.isAdmin;
    this.isAssignmentManager=this.role.isAssignmentManager;

    if (this.assignmentsInput && this.assignmentsInput.length > 0) {
      this.assignments = this.assignmentsInput; 
      console.log('Data from Parent:', this.assignments);
    } else if (this.fetchAssignments) { 
      this.api.getAssignments().subscribe({
        next: (data: Assignment[]) => (this.assignments = data),
        error: (err) => console.error('Error loading assignments:', err),
      });
    }

    this.api.getCourses().subscribe({
      next: (courses: Courses[]) => (this.courses = courses),
      error: (err) => console.error('Error loading courses:', err),
    });

    // this.api.getDetailedCourses().subscribe({
    //   next: (details: DetailedCourse[]) => (this.detailedCourses = details),
    //   error: (err) => console.error('Error loading course details:', err),
    // });

  
    this.assignmentForm = this.fb.group({
      title: ['', Validators.required],
      level: ['beginner', Validators.required],
      duration: ['', Validators.required],
      points: ['', [Validators.required, Validators.min(1)]],
      questions: this.fb.array([])
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['assignmentsInput'] && this.assignmentsInput) {
      this.assignments = this.assignmentsInput;
    }
  }

  
  get questions(): FormArray {
    return this.assignmentForm.get('questions') as FormArray;
  }

  getOptions(question: AbstractControl): FormArray {
  return question.get('options') as FormArray;
}

 

  addQuestion() {
    const questionGroup = this.fb.group({
      text: ['', Validators.required],
      options: this.fb.array([
        this.fb.control('', Validators.required),
        this.fb.control('', Validators.required),
        this.fb.control('', Validators.required),
        this.fb.control('', Validators.required)
      ]),
      correctAnswer: [0, Validators.required]
    });
    this.questions.push(questionGroup);
  }

  removeQuestion(index: number) {
    this.questions.removeAt(index);
  }


onSubmit() {
  if (this.assignmentForm.valid) {
    const formValue = this.assignmentForm.value;

    
    const newTakeAssignment: TakeAssignment = {
      id: crypto.randomUUID(),
      title: formValue.title,
      course: this.selectedCourse !== 'all' ? this.selectedCourse : 'General',
      questions: formValue.questions.map((q: any, index: number) => ({
        id: index + 1,
        level: formValue.level,
        question: q.text,
        options: q.options,
        correctAns: q.correctAnswer,
        scoreCard: {
          currentScore: 0,
          correctAnswers: 0,
          incorrectAnswers: 0,
          feedback: []
        }
      }))
    };

 
    const newAssignment: Assignment = {
      id: Number(Date.now()),  
      title: formValue.title,
      description: '', 
      course: this.selectedCourse !== 'all' ? this.selectedCourse : 'General',
      level: formValue.level,
      duration: formValue.duration,
      completed: false,
      dueDate: new Date().toISOString(),
      points: formValue.points
    };

 
    this.api.addTakeAssignment(newTakeAssignment).subscribe({
      next: (res) => {
        console.log('Saved TakeAssignment:', res);

   
        this.api.addAssignment(newAssignment).subscribe({
          next: (assignmentRes) => {
            console.log('Saved Assignment:', assignmentRes);
            this.assignments.push(assignmentRes);

            
            this.showAddModal = false;
            this.assignmentForm.reset();
            this.questions.clear();
          },
          error: (err) => console.error('Error adding to assignments:', err)
        });

      },
      error: (err) => console.error('Error adding to takeAssignment:', err)
    });
  }
}




  
  get filteredAssignments(): Assignment[] {
    return this.assignments.filter((a) => {
      const courseMatch = this.selectedCourse === 'all' || a.course === this.selectedCourse;
      const levelMatch = this.selectedLevel === 'all' || a.level.toLowerCase() === this.selectedLevel.toLowerCase();
      const searchMatch = this.searchTerm === '' || a.title.toLowerCase().includes(this.searchTerm.toLowerCase());
      return courseMatch && levelMatch && searchMatch;
    });
  }

  filterByCourse(courseId: string): void {
    this.selectedCourse = courseId;
  }

  filterByLevel(level: string): void {
    this.selectedLevel = level;
  }

  isCompleted(assignment: Assignment): boolean {
    if (!this.user || !this.user.completedAssignments) return false;
    return this.user.completedAssignments.some(
      (ca) =>
        ca.title === assignment.title &&
        ca.level.toLowerCase() === assignment.level.toLowerCase()
    );
  }
}
