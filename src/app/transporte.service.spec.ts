import { TestBed } from '@angular/core/testing';

import { TransporteService } from './transporte.service';

describe('TransporteService', () => {
  let service: TransporteService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TransporteService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
