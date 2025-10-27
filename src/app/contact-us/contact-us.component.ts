import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-contact-us',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './contact-us.component.html',
  styleUrls: ['./contact-us.component.css']
})
export class ContactUsComponent {

  onSubmit(): void {
    // In a real application, this would handle form submission
    console.log('Contact form submitted');
    alert('Thank you for your message! We will get back to you soon.');
  }
}
