import { AfterViewInit, Component, Input } from '@angular/core';
import { ProcessStep } from '../../services/data.service';
import { Swiper } from 'swiper';
import { Navigation, Pagination } from 'swiper/modules';

@Component({
  selector: 'app-project-process',
  imports: [],
  templateUrl: './project-process.html',
  styles: ``
})
export class ProjectProcessComponent implements AfterViewInit {

  @Input() processStep: Array<ProcessStep> = [];

  ngAfterViewInit() {
    new Swiper('.process-swiper', {
      modules: [Navigation, Pagination],
      slidesPerView: 1,
      spaceBetween: 40,
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      },
      pagination: {
        el: '.swiper-pagination',
        clickable: true,
      },
      loop: false,
    });
  }

}

