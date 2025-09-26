import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Chapter } from '../../../../models/courses.model';

@Component({
  selector: 'app-course-sidebar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './course-sidebar.html',
  styleUrls: ['./course-sidebar.css']
})
export class CourseSidebar implements OnInit {
  @Input() chapters: Chapter[] = [];
  @Input() courseTitle?: string;
  @Output() chapterSelected = new EventEmitter<Chapter>();

  ngOnInit() {
    if (this.chapters.length > 0 && !this.chapters.some(c => c.isActive)) {
      this.chapters[0].isActive = true;
    }
  }

  onChapterSelect(chapter: Chapter) {
    this.chapters.forEach(c => (c.isActive = false));
    chapter.isActive = true;
    this.chapterSelected.emit(chapter);
  }
}
