import { TestBed } from '@angular/core/testing';

import { GroupProviderService } from './group-provider.service';

describe('GroupProviderService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: GroupProviderService = TestBed.get(GroupProviderService);
    expect(service).toBeTruthy();
  });
});