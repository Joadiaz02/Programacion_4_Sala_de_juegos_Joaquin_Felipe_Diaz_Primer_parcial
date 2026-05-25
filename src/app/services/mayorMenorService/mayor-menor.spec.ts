import { TestBed } from '@angular/core/testing';

import { MayorMenor } from './mayor-menor';

describe('MayorMenor', () => {
  let service: MayorMenor;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MayorMenor);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
