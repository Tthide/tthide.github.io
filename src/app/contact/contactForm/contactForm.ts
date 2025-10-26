import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import emailjs, { EmailJSResponseStatus } from 'emailjs-com';
import { CommonModule, DatePipe } from '@angular/common';
import { Rocket } from '../../shared/rocket/rocket';

@Component({
  selector: 'app-contact-form',
  templateUrl: './contactForm.html',
  styleUrls: ['./contactForm.css'],
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, Rocket],
})
export class ContactFormComponent {

  @ViewChild(Rocket) rocket!: Rocket;

  contactForm: FormGroup;

  controlsValidity: { [key: string]: boolean } = {};
  submittedOnce: boolean = false;
  sendingMessage: boolean = false;
  messageSent: boolean = false;

  constructor(private fb: FormBuilder) {
    this.contactForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      subject: ['', Validators.required],
      message: ['', Validators.required],
      company: [''],
    });
  }

  triggerErrorDisplay(controlName: string): boolean {
    const control = this.contactForm.get(controlName);
    return !!(control && control.invalid && this.controlsValidity[controlName] && (control.dirty || control.pristine || control.touched));
  }

  triggerShake(controlName: string) {
    const control = this.contactForm.get(controlName);
    if (control && control.invalid) {
      const input = document.getElementById(controlName);
      if (input) {
        input.classList.remove('animate-shake'); // reset animation
        void input.offsetWidth;
        input.classList.add('animate-shake');
      }
    }
  }

  launchRocket(messageSent: boolean): string {
    if (messageSent) return 'animate-launch';
    return "";
  }

  onRocketLaunchEnd() {
    //Resets properties when rocket launch animations ends
    this.messageSent = false;
    this.submittedOnce = false;
    this.sendingMessage = false;
  }

  onSubmit() {
    this.submittedOnce = true;

    if (this.contactForm.value.company) {
      console.warn('Invalid sender detected, ignoring submission.');
      return;
    }

    if (this.contactForm.valid) {
      this.sendingMessage = true;
      const now = new Date();
      const datePipe = new DatePipe('en-US');
      const formattedTime = datePipe.transform(now, 'yyyy-MM-dd HH:mm:ss');

      const templateParams = {
        name: this.contactForm.value.name,
        email: this.contactForm.value.email,
        title: this.contactForm.value.subject,
        message: this.contactForm.value.message,
        time: formattedTime,
      };

      emailjs
        .send('service_rs6300r', 'template_ksg5a0i', templateParams, 'cG_TAg_JcDAAzxOp-')
        .then(
          (result: EmailJSResponseStatus) => {
            this.messageSent = true; //starts launch rocket animation in template
            //alert('Message sent successfully!');

            // reset 
            this.contactForm.reset();
            this.controlsValidity = {};
          },
          (error) => {
            console.error(error.text);
            alert('Oops! Something went wrong.');
          }
        );
    } else {
      // trigger shake on all invalid fields
      Object.keys(this.contactForm.controls).forEach((key) => {
        const control = this.contactForm.get(key);
        this.controlsValidity[key] = !!control && control.invalid;
        if (control && control.invalid) {
          this.triggerShake(key);
        }
      });
    }
  }

  debugSendMessage() {
    this.submittedOnce = true;
    this.sendingMessage = true;
    console.log("debugSend sending")
    setTimeout(() => {
      this.messageSent = true;
    }, 2000);
  }
}



