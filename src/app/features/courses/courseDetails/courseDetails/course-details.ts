import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { CourseSidebar } from '../course-sidebar/course-sidebar';
import { CourseVideoPlayer } from '../course-video-player/course-video-player';
import { CourseFAQs } from '../course-faqs/course-faqs';
import { Courses, Chapter } from '../../../../models/courses.model';
import { Api } from '../../../../services/api';
import { Router } from '@angular/router';

@Component({
  selector: 'app-course-page',
  standalone: true,
  imports: [CommonModule, CourseSidebar, CourseVideoPlayer],
  templateUrl: './course-details.html',
  styleUrls: ['./course-details.css']
})
export class CoursePageComponent implements OnInit {
  course!: Courses;
  loading = true;

  constructor(private api: Api, private route: ActivatedRoute, private router: Router) { }

  ngOnInit() {
    const title = this.route.snapshot.paramMap.get('title');
    console.log('Title from route:', title);

    if (title) {
      this.api.getCourseByTitle(title).subscribe((data: Courses[]) => {
        console.log('API response:', data);

        if (data.length > 0) {
          this.course = data[0];


          if (this.course.courseDetails.chapters?.length > 0) {
            const firstChapter = this.course.courseDetails.chapters[0];
            firstChapter.isActive = true;

            this.course.courseDetails.currentChapter = {
              title: firstChapter.title,
              videoUrl: firstChapter.videoUrl,
              videoDuration: firstChapter.videoDuration
            };
          }
        }
        this.loading = false;
      });
    }
  }

  onChapterSelected(chapter: Chapter) {
    if (!this.course) return;

    
    this.course.courseDetails.chapters.forEach((ch: Chapter) => (ch.isActive = false));

    
    chapter.isActive = true;

    
    this.course.courseDetails.currentChapter = {
      title: chapter.title,
      videoUrl: chapter.videoUrl,
      videoDuration: chapter.videoDuration
    };

    console.log('Chapter selected:', chapter.title);
  }

  goToAssignment() {
    if (this.course?.title) {
      
      this.router.navigate(['/Assignments']);
    }
  }
}
