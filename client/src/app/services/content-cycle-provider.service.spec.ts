import { TestBed } from '@angular/core/testing';

import { ContentCycleProviderService } from './content-cycle-provider.service';

describe('ContentCycleProviderService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ContentCycleProviderService = TestBed.get(ContentCycleProviderService);
    expect(service).toBeTruthy();
  });
});
