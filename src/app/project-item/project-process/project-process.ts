import { Component, Input } from '@angular/core';
import { ProcessStep} from '../../services/data.service';

@Component({
  selector: 'app-project-process',
  imports: [],
  templateUrl: './project-process.html',
  styles: ``
})
export class ProjectProcessComponent {

  @Input() processStep:Array<ProcessStep> = [];

}
