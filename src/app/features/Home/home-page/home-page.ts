import { Component } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { FormBuilder, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Api } from '../../../services/api';
import { Courses } from '../../../models/courses.model';
import { CoursesSection } from '../../courses/courses';
import { ContactUs } from '../../contact-us/contact-us';
import { User, Feedback } from '../../../models/user.model';
import { FeedbackList } from '../../assignments/assignmentDetails/assignment-feedback-list/assignment-feedback-list';
import { ChangeDetectorRef } from '@angular/core';



@Component({
  selector: 'app-home-page',
  imports: [CommonModule, FormsModule, CoursesSection, FeedbackList, RouterModule],
  templateUrl: './home-page.html',
  styleUrls: ['./home-page.css']
})
export class HomePage {

  featuredCourses: Courses[] = [];

  constructor(private api: Api) { }

  ngOnInit(): void {
    this.loadFeaturedCourses();

  }

  loadFeaturedCourses(): void {
  this.api.getFeaturedCourses().subscribe(courses => {
    this.featuredCourses = courses;
  });
  }

 

  
}
