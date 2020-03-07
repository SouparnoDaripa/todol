import { TestBed } from '@angular/core/testing';

import { AuthFilterService } from './auth-filter.service';

describe('AuthFilterService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AuthFilterService = TestBed.get(AuthFilterService);
    expect(service).toBeTruthy();
  });
});
