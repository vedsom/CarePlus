import { Component, OnInit } from '@angular/core';
import { DoctorProfileService } from '../services/doctor-profile.service';
import { AuthService } from '../../patient/services/auth.service';
import { CalendarView, CalendarEvent } from 'angular-calendar';
import { endOfDay } from 'date-fns';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  // --- Dropdown Options ---
  specializations = ['Cardiology', 'Neurology', 'Pediatrics', 'Orthopedics', 'Dermatology'];
  qualifications = ['MD', 'DO', 'MBBS', 'FRCS', 'MRCP'];

  // --- Component State ---
  doctor: any = {};
  isLoading = true;
  profileExists = false;
  activeTab: 'view' | 'edit' = 'view';

  // --- Calendar Properties ---
  view: CalendarView = CalendarView.Week; // Default to week view
  CalendarView = CalendarView; // Make the enum available to the template
  viewDate: Date = new Date();
  events: CalendarEvent[] = [];

  // --- Add Event Modal Properties ---
  showEventModal = false;
  newEvent = {
    title: '',
    start: new Date(),
    end: new Date()
  };

  constructor(
    private profileService: DoctorProfileService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadProfile();
    this.loadScheduleEvents();
  }

  loadProfile(): void {
    this.isLoading = true;
    this.profileService.getProfile().subscribe({
      next: (data) => {
        this.doctor = data;
        this.profileExists = true;
        this.activeTab = 'view';
        this.isLoading = false;
      },
      error: (err) => {
        if (err.status === 404) {
          this.profileExists = false;
          this.activeTab = 'edit';
        }
        this.isLoading = false;
      }
    });
  }

  loadScheduleEvents(): void {
    this.profileService.getScheduleEvents().subscribe(data => {
      // Convert backend events to the format angular-calendar expects
      this.events = data.map(event => ({
        id: event.id,
        title: event.title,
        start: new Date(event.start),
        end: new Date(event.end),
      }));
    });
  }

  setTab(tabName: 'view' | 'edit'): void {
    this.activeTab = tabName;
  }

  saveProfile(): void {
    const saveObservable = this.profileExists 
      ? this.profileService.updateProfile(this.doctor)
      : this.profileService.createProfile(this.doctor);

    saveObservable.subscribe({
      next: () => {
        alert('Profile details saved successfully!');
        this.authService.updateUserProfile(this.doctor);
        this.loadProfile();
      },
      error: (err) => {
        alert('Failed to save profile details.');
        console.error('Save profile failed', err);
      }
    });
  }

  // --- Calendar-Specific Methods ---

  dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
    // When a day is clicked on the month view, open the modal to add a new event
    this.newEvent = {
      title: '',
      start: date,
      end: endOfDay(date) // Default end time is the end of the clicked day
    };
    this.showEventModal = true;
  }
  
  saveEvent(): void {
    if (!this.newEvent.title) {
      alert('Please enter an event title.');
      return;
    }
    
    const eventToSave = {
      title: this.newEvent.title,
      start: this.newEvent.start.toISOString(),
      end: this.newEvent.end.toISOString()
    };

    this.profileService.createScheduleEvent(eventToSave).subscribe({
        next: () => {
            this.loadScheduleEvents(); // Reload events from the backend
            this.showEventModal = false; // Close the modal
        },
        error: (err) => {
            alert('Failed to save the event.');
            console.error('Save event failed', err);
        }
    });
  }
}