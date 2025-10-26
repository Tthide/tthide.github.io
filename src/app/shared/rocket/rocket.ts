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


}
