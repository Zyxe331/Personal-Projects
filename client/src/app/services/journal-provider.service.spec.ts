import { TestBed } from '@angular/core/testing';

import { JournalProviderService } from './journal-provider.service';

describe('JournalProviderService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: JournalProviderService = TestBed.get(JournalProviderService);
    expect(service).toBeTruthy();
  });
});
