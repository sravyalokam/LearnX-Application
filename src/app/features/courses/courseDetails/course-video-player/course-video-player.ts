import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CurrentChapter } from '../../../../models/courses.model';
import { SafeUrlPipe } from '../../../../shared/pipes/safe-url-pipe';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-course-video-player',
  imports: [CommonModule, SafeUrlPipe],
  templateUrl: './course-video-player.html',
  styleUrl: './course-video-player.css'
})
export class CourseVideoPlayer {
  @Input() currentChapter!: CurrentChapter;
}
