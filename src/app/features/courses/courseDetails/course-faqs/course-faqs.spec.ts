import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CourseFAQs } from './course-faqs';

describe('CourseFAQs', () => {
  let component: CourseFAQs;
  let fixture: ComponentFixture<CourseFAQs>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CourseFAQs]
    })
      .compileComponents();

    fixture = TestBed.createComponent(CourseFAQs);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
