import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatedBooksComponent } from './created-books.component';

describe('CreatedBooksComponent', () => {
  let component: CreatedBooksComponent;
  let fixture: ComponentFixture<CreatedBooksComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CreatedBooksComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CreatedBooksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
