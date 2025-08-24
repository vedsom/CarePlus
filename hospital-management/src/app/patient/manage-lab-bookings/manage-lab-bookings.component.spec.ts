import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageLabBookingsComponent } from './manage-lab-bookings.component';

describe('ManageLabBookingsComponent', () => {
  let component: ManageLabBookingsComponent;
  let fixture: ComponentFixture<ManageLabBookingsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ManageLabBookingsComponent]
    });
    fixture = TestBed.createComponent(ManageLabBookingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
