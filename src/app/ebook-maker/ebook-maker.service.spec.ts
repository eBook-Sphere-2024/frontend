import { TestBed } from '@angular/core/testing';

import { EbookMakerService } from './ebook-maker.service';

describe('EbookMakerService', () => {
  let service: EbookMakerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EbookMakerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
