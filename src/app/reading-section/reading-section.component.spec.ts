import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReadingSectionComponent } from './reading-section.component';

describe('ReadingSectionComponent', () => {
  let component: ReadingSectionComponent;
  let fixture: ComponentFixture<ReadingSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ReadingSectionComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ReadingSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
