import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignmentScoreCard } from './assignment-score-card';

describe('AssignmentScoreCard', () => {
  let component: AssignmentScoreCard;
  let fixture: ComponentFixture<AssignmentScoreCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AssignmentScoreCard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssignmentScoreCard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
