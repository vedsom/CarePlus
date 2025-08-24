import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LabCartComponent } from './lab-cart.component';

describe('LabCartComponent', () => {
  let component: LabCartComponent;
  let fixture: ComponentFixture<LabCartComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LabCartComponent]
    });
    fixture = TestBed.createComponent(LabCartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
