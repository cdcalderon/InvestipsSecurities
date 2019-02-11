import { TestBed } from '@angular/core/testing';

import { SecuritiesService } from './securities.service';

describe('SecuritiesService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SecuritiesService = TestBed.get(SecuritiesService);
    expect(service).toBeTruthy();
  });
});
