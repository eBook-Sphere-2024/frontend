import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EbookMakerComponent } from './ebook-maker.component';

describe('EbookMakerComponent', () => {
  let component: EbookMakerComponent;
  let fixture: ComponentFixture<EbookMakerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EbookMakerComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EbookMakerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
