import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CourseVideoPlayer } from './course-video-player';

describe('CourseVideoPlayer', () => {
  let component: CourseVideoPlayer;
  let fixture: ComponentFixture<CourseVideoPlayer>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CourseVideoPlayer]
    })
      .compileComponents();

    fixture = TestBed.createComponent(CourseVideoPlayer);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
