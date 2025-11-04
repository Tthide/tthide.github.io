import { AfterViewInit, Component, OnInit, NgZone } from '@angular/core';
import { RouterModule } from '@angular/router';
import { DataService, Project } from '../services/data.service';
import Swiper from 'swiper';
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
  showLeftShadow: { [key: number]: boolean } = {};
  showRightShadow: { [key: number]: boolean } = {};
  
  constructor(
    private dataService: DataService,
    private ngZone: NgZone
  ) { }
  
  chipColors = [
    'bg-purple-600',
    'bg-blue-500',
    'bg-green-500',
    'bg-yellow-500',
    'bg-pink-500'
  ];
  
  getChipColor(index: number): string {
    return this.chipColors[index % this.chipColors.length];
  }
  
  ngAfterViewInit() {
    // Run Swiper initialization outside Angular zone to avoid interference
    this.ngZone.runOutsideAngular(() => {
      setTimeout(() => {
        const chipSwipers = document.querySelectorAll('.chips-swiper');
        chipSwipers.forEach((el, index) => {
          const swiper = new Swiper(el as HTMLElement, {
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
            on: {
              init: (swiper: any) => {
                this.updateShadowsOutsideZone(swiper, index);
              },
              progress: (swiper: any) => {
                this.updateShadowsOutsideZone(swiper, index);
              }
            }
          });
        });
      }, 150);
    });
  }
  
  updateShadowsOutsideZone(swiper: any, index: number) {
    const showLeft = !swiper.isBeginning;
    const showRight = !swiper.isEnd;
    
    // Only update if values actually changed
    if (this.showLeftShadow[index] !== showLeft || this.showRightShadow[index] !== showRight) {
      this.ngZone.run(() => {
        this.showLeftShadow[index] = showLeft;
        this.showRightShadow[index] = showRight;
      });
    }
  }
  
  ngOnInit(): void {
    this.dataService.getProjects().subscribe(data => {
      this.projects = data.projects;

      this.projects.forEach((_, index) => {
        this.showLeftShadow[index] = false;
        this.showRightShadow[index] = false;
      });
    });
  }
}