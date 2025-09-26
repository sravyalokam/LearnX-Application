import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignmentFeedbackForm } from './assignment-feedback-form';

describe('AssignmentFeedbackForm', () => {
  let component: AssignmentFeedbackForm;
  let fixture: ComponentFixture<AssignmentFeedbackForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AssignmentFeedbackForm]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssignmentFeedbackForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
