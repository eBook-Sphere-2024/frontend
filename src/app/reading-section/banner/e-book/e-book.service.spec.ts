import { TestBed } from '@angular/core/testing';

import { EBookService } from './e-book.service';

describe('EBookService', () => {
  let service: EBookService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EBookService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
