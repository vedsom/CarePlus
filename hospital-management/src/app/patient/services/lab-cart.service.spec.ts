import { TestBed } from '@angular/core/testing';

import { LabCartService } from './lab-cart.service';

describe('LabCartService', () => {
  let service: LabCartService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LabCartService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
