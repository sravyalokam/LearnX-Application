import { TestBed } from '@angular/core/testing';

import { CompletedAssignments } from './completed-assignments';

describe('CompletedAssignments', () => {
  let service: CompletedAssignments;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CompletedAssignments);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
