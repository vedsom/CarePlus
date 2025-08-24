import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignedAppointmentsComponent } from './assigned-appointments.component';

describe('AssignedAppointmentsComponent', () => {
  let component: AssignedAppointmentsComponent;
  let fixture: ComponentFixture<AssignedAppointmentsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AssignedAppointmentsComponent]
    });
    fixture = TestBed.createComponent(AssignedAppointmentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
