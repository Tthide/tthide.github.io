import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ProjectListComponent } from '../project-list/project-list';
import { RotatingTextIconComponent } from '../shared/rotating-text-icon/rotating-text-icon';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterModule,ProjectListComponent,RotatingTextIconComponent],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class HomeComponent {

}
