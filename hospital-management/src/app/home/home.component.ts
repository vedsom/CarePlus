import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html'
})
export class HomeComponent {
  testimonials = [
  {
        name: 'Riya Sharma',
        message: 'I received the best care here. The entire staff, from the reception to the nurses, was incredibly friendly and made me feel very comfortable throughout my visit.'
    },
    {
        name: 'Amit Verma',
        message: 'I was thoroughly impressed by the professionalism of the medical team. The doctors are not only knowledgeable but also take the time to listen and explain everything clearly.'
    },
    {
        name: 'Sneha Gupta',
        message: 'The service was remarkably efficient and quick, with minimal waiting time. I was also very impressed with how clean, hygienic, and well-maintained the entire hospital is.'
    },
    {
        name: 'Rahul Kumar',
        message: 'I wholeheartedly recommend this place for any family. They provide compassionate and comprehensive care for all age groups, giving us great peace of mind for our health.'
    }
  ];

  doctors = [
    { id: 1, name: 'Dr. Arjun Singh', speciality: 'Cardiologist', img: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fGRvY3RvcnN8ZW58MHx8MHx8fDA%3D' },
    { id: 2, name: 'Dr. Meera Nair', speciality: 'Neurologist', img: 'https://plus.unsplash.com/premium_photo-1682089872205-dbbae3e4ba32?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8aW5kaWFuJTIwZG9jdG9yfGVufDB8fDB8fHww' },
    { id: 3, name: 'Dr. Karan Patel', speciality: 'Orthopedic', img: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8aW5kaWFuJTIwZG9jdG9yfGVufDB8fDB8fHww' },
    { id: 4, name: 'Dr. Shivam Das', speciality: 'Pediatrician', img: 'https://plus.unsplash.com/premium_photo-1661699704375-847063f963c6?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8aW5kaWFuJTIwZG9jdG9yfGVufDB8fDB8fHww' }
  ];

  whyUs = [
    { icon: 'bi bi-heart-pulse', title: 'Trusted Care', desc: 'Over 20 years of trusted service.' },
    { icon: 'bi bi-people', title: 'Expert Doctors', desc: 'Specialists across all fields.' },
    { icon: 'bi bi-hospital', title: 'Modern Facilities', desc: 'State-of-the-art infrastructure.' },
    { icon: 'bi bi-shield-check', title: 'Safe & Secure', desc: 'Top-class hygiene & safety.' }
  ];
}
