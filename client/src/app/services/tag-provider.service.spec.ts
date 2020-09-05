import { TestBed } from '@angular/core/testing';

import { TagProviderService } from './tag-provider.service';

describe('TagProviderService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TagProviderService = TestBed.get(TagProviderService);
    expect(service).toBeTruthy();
  });
});
