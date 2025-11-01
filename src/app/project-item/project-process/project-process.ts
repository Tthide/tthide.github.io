import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
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

  ngOnInit(): void {
    this.processStep.forEach(step => step.isFocused = false);
  }
  ngAfterViewInit() {
    const swiper = new Swiper('.process-swiper', {
      modules: [Navigation, Pagination],
      slidesPerView: "auto",
      centeredSlides: true,
      initialSlide: 0,
      spaceBetween: 30,
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
      effect: "creative",
      loop: false,
    });


    this.updateSlideStates(swiper.activeIndex);

    swiper.on('slideChange', () => {
      this.updateSlideStates(swiper.activeIndex);
    });
  }

  // Update slides' focus/size/content collapse
  updateSlideStates(activeIndex: number) {
    this.processStep.forEach((step, idx) => {
      step.isFocused = idx === activeIndex;
    });
  }


}

