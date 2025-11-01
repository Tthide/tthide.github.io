import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { DataService, Project } from '../services/data.service';

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
export class ProjectListComponent implements OnInit {
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

  showLeftShadow = false;
  showRightShadow = true; // initially true if scrollable

  onScroll(event: Event) {
    const target = event.target as HTMLElement;
    const { scrollLeft, scrollWidth, clientWidth } = target;
    this.showLeftShadow = scrollLeft > 10;
    this.showRightShadow = scrollLeft + clientWidth < scrollWidth - 10;
  }

  ngOnInit(): void {
    this.dataService.getProjects().subscribe(data => {
      this.projects = data.projects;
    });
  }
}
