import { Component } from '@angular/core';
import { ContactFormComponent } from './contactForm/contactForm';


@Component({
  selector: 'app-contact',
  templateUrl: './contact.html',
  standalone: true,
  imports: [ContactFormComponent],
})
export class ContactComponent {

}
