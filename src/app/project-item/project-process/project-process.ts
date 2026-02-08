import { AfterViewInit, Component, ElementRef, Input, OnInit } from '@angular/core';
import { ProcessStep } from '../../services/data.service';
import { Swiper } from 'swiper';
import { Navigation, Pagination } from 'swiper/modules';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-project-process',
  imports: [CommonModule],
  templateUrl: './project-process.html',
  styles: ``
})
export class ProjectProcessComponent implements AfterViewInit, OnInit {
  @Input() processStep: Array<ProcessStep> = [];
  private swiper?: Swiper;

  constructor(private elementRef: ElementRef) { }

  ngOnInit(): void {
    this.processStep.forEach(step => step.isFocused = false);
  }

  ngAfterViewInit() {
    this.swiper = new Swiper('.process-swiper', {
      modules: [Navigation, Pagination],
      slidesPerView: "auto",
      centeredSlides: true,
      initialSlide: 0,
      spaceBetween: 40,
      speed: 500,
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      },
      pagination: {
        el: '.swiper-pagination',
        type: "bullets",
        clickable: true,
      },
      grabCursor: true,
      loop: false,
    });

    this.updateSlideStates(this.swiper.activeIndex);

    this.swiper.on('slideChangeTransitionStart', () => {
      if (this.swiper) {
        this.updateSlideStates(this.swiper.activeIndex);

      }
    });
  }

  navigateToSlide(index: number) {
    if (this.swiper && !this.processStep[index].isFocused) {
      this.swiper.slideTo(index);
    }
  }

  updateSlideStates(activeIndex: number) {
    this.processStep.forEach((step, idx) => {
      step.isFocused = idx === activeIndex;
      this.updateSlideLinks(idx, step.isFocused);
    });

    
    // Update ARIA live region
    const announcer = this.elementRef.nativeElement.querySelector('#slide-announcer');
    if (announcer) {
      const currentSlide = this.processStep[activeIndex];
      announcer.textContent = `Slide ${activeIndex + 1}: ${currentSlide.step_title}`;
    }

  }

  getInnerTransform(isFocused?: boolean) {
    // Responsive scaleX and min-width for inner slides so that they match the outer slide's growth on focus
    if (!isFocused) {
      return { 'transform': 'scaleX(1)', 'transform-origin': 'top left', 'min-width': '100%' };
    }

    if (window.innerWidth >= 1280) { // xl
      return { 'transform': 'scaleX(0.5)', 'transform-origin': 'top left', 'min-width': '200%' };
    } else if (window.innerWidth >= 1024) { // lg
      return { 'transform': 'scaleX(0.4)', 'transform-origin': 'top left', 'min-width': '250%' };
    } else { // md and below
      return { 'transform': 'scaleX(0.345)', 'transform-origin': 'top left', 'min-width': '290%' };
    }

  }

  /** 
   * Dynamically set tabindex for links inside slides based on focus state
   */
  private updateSlideLinks(idx: number, isFocused: boolean) {
    const slideEl: HTMLElement | null = this.elementRef.nativeElement.querySelectorAll('.swiper-slide')[idx];
    if (!slideEl) return;

    const focusableLinks: NodeListOf<HTMLAnchorElement> = slideEl.querySelectorAll('a');
    focusableLinks.forEach(link => {
      link.tabIndex = isFocused ? 0 : -1;


      if (link.href.startsWith('http')) {
        link.setAttribute('aria-label', `${link.textContent?.trim()} (opens external website)`);
        link.setAttribute('target', '_blank');
        link.setAttribute('rel', 'noopener noreferrer');
      }
    });
  }
}