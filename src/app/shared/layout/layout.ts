import { Component } from '@angular/core';
import { HeaderComponent } from '../header/header';
import { FooterComponent } from '../footer/footer';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [HeaderComponent, FooterComponent, RouterOutlet],
  template: `
    <div class="flex flex-col bg-light min-h-svh">
        <!-- Skip link -->
      <a href="#main" 
  class="absolute left-2 -top-20 focus:top-4 bg-accent_purple text-light p-3 rounded-md z-[1000] transition-all duration-200 
        focus-visible:top-4">
      Skip to content</a>
      <app-header />
      <main id="main" tabindex="-1" class=" grow px-6 py-5 lg:py-16 md:px-[7%] lg:px-[10%] xl:px-[15%]">
        <router-outlet />
      </main>
      <app-footer class="px-0 md:px-[7%] lg:px-[10%]  xl:px-[15%]" />
    </div>
  `,
})
export class LayoutComponent { }

