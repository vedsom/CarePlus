import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LabBookSlotComponent } from './lab-book-slot.component';

describe('LabBookSlotComponent', () => {
  let component: LabBookSlotComponent;
  let fixture: ComponentFixture<LabBookSlotComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LabBookSlotComponent]
    });
    fixture = TestBed.createComponent(LabBookSlotComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
