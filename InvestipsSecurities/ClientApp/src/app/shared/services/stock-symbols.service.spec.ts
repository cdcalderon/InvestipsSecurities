import { TestBed } from '@angular/core/testing';

import { StockSymbolsService } from './stock-symbols.service';

describe('StockSymbolsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: StockSymbolsService = TestBed.get(StockSymbolsService);
    expect(service).toBeTruthy();
  });
});
