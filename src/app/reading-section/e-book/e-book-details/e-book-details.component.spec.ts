import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EBookDetailsComponent } from './e-book-details.component';

describe('EBookDetailsComponent', () => {
  let component: EBookDetailsComponent;
  let fixture: ComponentFixture<EBookDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EBookDetailsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EBookDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
