import { TestBed } from '@angular/core/testing';

import { BullStoch307Service } from './bull-stoch307.service';

describe('BullStoch307Service', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: BullStoch307Service = TestBed.get(BullStoch307Service);
    expect(service).toBeTruthy();
  });
});
