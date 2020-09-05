import { TestBed } from '@angular/core/testing';

import { ChatProviderService } from './chat-provider.service';

describe('ChatProviderService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ChatProviderService = TestBed.get(ChatProviderService);
    expect(service).toBeTruthy();
  });
});
