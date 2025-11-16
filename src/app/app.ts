import { Component, signal, OnInit } from '@angular/core';
import { Router, RouterOutlet, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  standalone: true,
  template: `<router-outlet /> `,
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('portfolio-angular');

  constructor(private router: Router) { }

  ngOnInit() {
    // Scroll to top on every route change
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        window.scrollTo({ top: 0, behavior: 'instant' });
      });
  }
}
