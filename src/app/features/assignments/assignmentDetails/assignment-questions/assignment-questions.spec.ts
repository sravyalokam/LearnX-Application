import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignmentQuestions } from './assignment-questions';

describe('AssignmentQuestions', () => {
  let component: AssignmentQuestions;
  let fixture: ComponentFixture<AssignmentQuestions>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AssignmentQuestions]
    })
      .compileComponents();

    fixture = TestBed.createComponent(AssignmentQuestions);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
