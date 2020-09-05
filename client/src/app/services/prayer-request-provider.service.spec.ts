import { TestBed } from '@angular/core/testing';

import { PrayerRequestProviderService } from './prayer-request-provider.service';

describe('PrayerRequestProviderService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PrayerRequestProviderService = TestBed.get(PrayerRequestProviderService);
    expect(service).toBeTruthy();
  });
});
