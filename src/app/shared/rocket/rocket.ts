import { Component, ElementRef, ViewChild } from '@angular/core';
@Component({
  selector: 'app-rocket',
  imports: [],
  templateUrl: './rocket.html',
  styleUrl: './rocket.css'
})
export class Rocket {
  @ViewChild('rocket') rocketElement!: ElementRef<HTMLDivElement>;

  launchRocket() {
    const el = this.rocketElement.nativeElement;

    // remove any existing animation class (for reuse)
    el.classList.remove('animate-launch');

    // Force reflow so animation restarts if called again
    void el.offsetWidth;

    // Add the animation class
    el.classList.add('animate-launch');
  }
}
