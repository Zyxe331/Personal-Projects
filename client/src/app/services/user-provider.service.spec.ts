import { TestBed } from '@angular/core/testing';

import { UserProviderService } from './user-provider.service';

describe('UserProviderService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: UserProviderService = TestBed.get(UserProviderService);
    expect(service).toBeTruthy();
  });
});
