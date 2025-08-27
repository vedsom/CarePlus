import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReferredPatientsComponent } from './referred-patients.component';

describe('ReferredPatientsComponent', () => {
  let component: ReferredPatientsComponent;
  let fixture: ComponentFixture<ReferredPatientsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ReferredPatientsComponent]
    });
    fixture = TestBed.createComponent(ReferredPatientsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
