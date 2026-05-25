import { TestBed } from '@angular/core/testing';

import { Ahorcado } from './ahorcado';

describe('Ahorcado', () => {
  let service: Ahorcado;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Ahorcado);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
