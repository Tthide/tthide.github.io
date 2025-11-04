import { AfterViewInit, Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { DataService, Project } from '../services/data.service';
import { Swiper } from 'swiper';
import { FreeMode } from 'swiper/modules';

@Component({
  selector: 'app-project-list',
  imports: [RouterModule],
  templateUrl: './project-list.html',
  styles: ``,
  standalone: true,
  host: {
    'class': 'w-full flex flex-col items-center gap-10 block'
  }
})
export class ProjectListComponent implements AfterViewInit, OnInit {
  projects: Project[] = [];

  constructor(private dataService: DataService) { }

  chipColors = [
    'bg-purple-600',
    'bg-blue-500',
    'bg-green-500',
    'bg-yellow-500',
    'bg-pink-500'
  ];

  getChipColor(index: number): string {
    // Rotate colors if more keywords than colors
    //console.log(index);
    return this.chipColors[index % this.chipColors.length];
  }


  ngAfterViewInit() {
    setTimeout(() => {
      const chipSwipers = document.querySelectorAll('.chips-swiper');
      chipSwipers.forEach((el) => {
        new Swiper(el as HTMLElement, {
          modules: [FreeMode], 
          slidesPerView: 'auto',
          centeredSlides: false,
          spaceBetween: 12, 
          grabCursor: true,
          freeMode: {
            enabled: true,
            sticky: false,
          },
          loop: false,
        });
      });
    }, 100);  
  }


  ngOnInit(): void {
    this.dataService.getProjects().subscribe(data => {
      this.projects = data.projects;
    });
  }
}
