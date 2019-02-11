import { TestBed } from '@angular/core/testing';

import { ThreeArrowsService } from './three-arrows.service';

describe('ThreeArrowsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ThreeArrowsService = TestBed.get(ThreeArrowsService);
    expect(service).toBeTruthy();
  });
});
