import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EBookFilterComponent } from './e-book-filter.component';

describe('EBookFilterComponent', () => {
  let component: EBookFilterComponent;
  let fixture: ComponentFixture<EBookFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EBookFilterComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EBookFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
