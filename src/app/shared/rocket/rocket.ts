import { Component, ElementRef, Input, ViewChild, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-rocket',
  templateUrl: './rocket.html',
  styleUrls: ['./rocket.css']
})
export class Rocket implements AfterViewInit {
  @ViewChild('rocket') rocketElement!: ElementRef<HTMLDivElement>;

  /** Inputs to toggle animations */
  @Input() enableBounce: boolean = true;
  @Input() enableExhaust: boolean = true;
  @Input() enableLaunchAnimation: boolean = true;

  ngAfterViewInit() {
    // Apply initial animation classes based on inputs
    if (this.enableBounce) {
      this.rocketElement.nativeElement
        .querySelector('.rocket-body')
        ?.classList.add('animate-bounce-smooth');
    }

    if (this.enableExhaust) {
      this.rocketElement.nativeElement
        .querySelector('.exhaust-flame')
        ?.classList.add('animate-exhaust');
    }
  }

  launchRocket() {
    if (!this.enableLaunchAnimation) return;

    const el = this.rocketElement.nativeElement;

    // Remove and re-add the animation class for repeated launches
    el.classList.remove('animate-launch');
    void el.offsetWidth; // force reflow
    el.classList.add('animate-launch');
  }
}
