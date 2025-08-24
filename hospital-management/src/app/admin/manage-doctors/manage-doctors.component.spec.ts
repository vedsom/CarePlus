import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageDoctorsComponent } from './manage-doctors.component';

describe('ManageDoctorsComponent', () => {
  let component: ManageDoctorsComponent;
  let fixture: ComponentFixture<ManageDoctorsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ManageDoctorsComponent]
    });
    fixture = TestBed.createComponent(ManageDoctorsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
