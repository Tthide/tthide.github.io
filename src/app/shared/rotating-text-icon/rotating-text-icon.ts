import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-rotating-text-icon',
  imports: [],
  standalone: true,
  template: `
<div class="flex justify-center items-center w-full">
  <svg [attr.width]="size" [attr.height]="size" [style.color]="color">
    <defs>
      <path id="circlePath" [attr.d]="circlePath" />
    </defs>

    <!-- Rotating text -->
    <g class="rotate-text" [style.animation-duration]="speed + 's'">
      <text fill="currentColor" [attr.font-size]="fontSize" font-weight="bold">
        <textPath href="#circlePath" startOffset="50%" text-anchor="middle">
          {{   repeatedText }}
        </textPath>
      </text>
    </g>

    <!-- Centered icon -->
    <g [attr.transform]="iconTransform">
      <path stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" fill="none"
        d="m4.5 5.25 7.5 7.5 7.5-7.5m-15 6 7.5 7.5 7.5-7.5" />
    </g>
  </svg>
</div>

  `,
  styles: `
  .rotate-text {
  transform-origin: center; /* rotate around SVG center */
  animation-name: spin;
  animation-timing-function: linear;
  animation-iteration-count: infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
  `
})
export class RotatingTextIconComponent implements OnChanges {
  @Input() size: number = 120;             // SVG width & height
  @Input() color: string = '#483AA0';      // Accent color
  @Input() text: string = 'READ MORE';     // Circular text
  @Input() speed: number = 10;              // Rotation speed in seconds
  @Input() scale: number = 3;              // Icon scale
  @Input() fontSize: number = 10;         // font size in px

  circleRadius: number = 50;               // Dynamic radius for the text path
  iconOffset: number = 11.5;                 // Dynamic icon offset to center
  center: number = 60;                     // SVG center
  repeatedText: string = '';
  ngOnChanges(changes: SimpleChanges) {
    // Adjust circle radius to keep text outside the icon
    this.circleRadius = (this.size / 2) - 10;
    this.iconOffset = 23 / 2;  // Original icon ~23x23 units
    this.center = this.size / 2;
    this.generateRepeatedText();
  }

  // Transform string for the icon group
  get iconTransform(): string {
    return `translate(${this.center},${this.center}) scale(${this.scale}) translate(-${this.iconOffset},-${this.iconOffset})`;
  }

  // Circle path for text
  get circlePath(): string {
    return `M${this.center},${this.center - this.circleRadius} 
            a${this.circleRadius},${this.circleRadius} 0 1,1 0,${2 * this.circleRadius} 
            a${this.circleRadius},${this.circleRadius} 0 1,1 0,-${2 * this.circleRadius}`;
  }

  generateRepeatedText() {
    // Estimate number of repetitions needed based on circle circumference
    const circumference = 2 * Math.PI * this.circleRadius;
    const approxCharWidth = this.fontSize * 0.8 // rough estimate in px per character
    const charsNeeded = Math.ceil(circumference / approxCharWidth);

    const repeatTimes = Math.floor(charsNeeded / this.text.length);
    this.repeatedText = Array(repeatTimes).fill(this.text + ' • ').join('');
  }
}
