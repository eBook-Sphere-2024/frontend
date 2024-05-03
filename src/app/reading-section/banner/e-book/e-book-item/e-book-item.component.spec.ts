import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EBookItemComponent } from './e-book-item.component';

describe('EBookItemComponent', () => {
  let component: EBookItemComponent;
  let fixture: ComponentFixture<EBookItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EBookItemComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EBookItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
