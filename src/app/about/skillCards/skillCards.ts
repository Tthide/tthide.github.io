import { Component } from '@angular/core';

@Component({
  selector: 'skill-card',
  templateUrl: './skillCards.html',
  styleUrls: ['../about.css'],
  standalone: true,
})
export class SkillCardsComponent {
  // Track open/closed state of each card
  isOpen: { [key: number]: boolean } = {};

  toggle(id: number) {
    this.isOpen[id] = !this.isOpen[id];
  }
}
