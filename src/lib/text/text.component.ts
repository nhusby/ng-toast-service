import { Component, Input } from '@angular/core';
import { TextToasterComponent } from '../toaster.service';

@Component({
  selector: 'lib-text',
  imports: [],
  templateUrl: './text.component.html',
  styleUrl: './text.component.scss'
})
export class TextComponent implements TextToasterComponent {
  @Input() text: string = '';
}
