import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookAnalysisComponent } from './book-analysis.component';

describe('BookAnalysisComponent', () => {
  let component: BookAnalysisComponent;
  let fixture: ComponentFixture<BookAnalysisComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BookAnalysisComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BookAnalysisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
