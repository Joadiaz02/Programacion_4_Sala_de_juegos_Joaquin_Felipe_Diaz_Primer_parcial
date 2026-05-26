import { TestBed } from '@angular/core/testing';

import { SopaLetras } from './sopa-letras';

describe('SopaLetras', () => {
  let service: SopaLetras;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SopaLetras);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
