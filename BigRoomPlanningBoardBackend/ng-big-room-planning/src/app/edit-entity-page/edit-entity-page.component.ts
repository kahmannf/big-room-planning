import {
  Component,
  Injectable,
  Input,
  OnInit,
} from '@angular/core';
import {
  MatButton,
  MatIconButton,
} from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';

@Injectable()
export abstract class EditEntityComponent {
  abstract checkValidAndTouch(): boolean;
  abstract saveAndClose(): void;
  abstract registerOnSubmitCallback(callback: () => void): void;
}

@Component({
  selector: 'app-edit-entity-page',
  standalone: true,
  imports: [
    MatButton,
    MatIconButton,
    MatIcon
  ],
  templateUrl: './edit-entity-page.component.html',
  styleUrl: './edit-entity-page.component.scss'
})
export class EditEntityPageComponent implements OnInit {

  @Input()
  title: string;

  @Input()
  isNew: boolean;

  constructor (
    private editEntityComponent: EditEntityComponent
  ) {}

  ngOnInit(): void {
    this.editEntityComponent.registerOnSubmitCallback(() => this.saveClick());
  }

  saveClick() {
    if (!this.editEntityComponent.checkValidAndTouch()) {
      return;
    }

    this.editEntityComponent.saveAndClose();
  }

  backClick() {
    history.back();
  }
}
