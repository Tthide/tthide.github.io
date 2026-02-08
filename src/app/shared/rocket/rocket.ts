import { Component, ElementRef, Input, ViewChild, AfterViewInit, input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-rocket',
  templateUrl: './rocket.html',
  styleUrls: ['./rocket.css'],
  imports: [CommonModule]
})
export class Rocket implements AfterViewInit {
  @ViewChild('rocket') rocketElement!: ElementRef<HTMLDivElement>;

  /** Inputs to toggle animations */
  @Input() enableBounce: boolean = true;
  @Input() enableExhaust: boolean = true;
  @Input() scale: number = 1;

  ngAfterViewInit() {

    // scaling the rocket
    this.setScale(this.scale);

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

  setScale(newScale: number) {
    this.rocketElement.nativeElement.style.transform = `scale(${newScale})`;
  }
}
