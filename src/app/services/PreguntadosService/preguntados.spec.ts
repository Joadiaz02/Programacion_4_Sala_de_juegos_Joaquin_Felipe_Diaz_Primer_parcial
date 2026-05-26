import { TestBed } from '@angular/core/testing';

import { Preguntados } from './preguntados';

describe('Preguntados', () => {
  let service: Preguntados;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Preguntados);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
