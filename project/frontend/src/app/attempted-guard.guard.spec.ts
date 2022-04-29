import { TestBed } from '@angular/core/testing';

import { AttemptedGuardGuard } from './attempted-guard.guard';

describe('AttemptedGuardGuard', () => {
  let guard: AttemptedGuardGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(AttemptedGuardGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
