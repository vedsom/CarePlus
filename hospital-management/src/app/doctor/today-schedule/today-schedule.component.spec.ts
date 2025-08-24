import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TodayScheduleComponent } from './today-schedule.component';

describe('TodayScheduleComponent', () => {
  let component: TodayScheduleComponent;
  let fixture: ComponentFixture<TodayScheduleComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TodayScheduleComponent]
    });
    fixture = TestBed.createComponent(TodayScheduleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
