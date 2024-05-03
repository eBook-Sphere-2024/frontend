import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EBookListComponent } from './e-book-list.component';

describe('EBookListComponent', () => {
  let component: EBookListComponent;
  let fixture: ComponentFixture<EBookListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EBookListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EBookListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
