import { Component, Input } from '@angular/core';
import { DataService } from '../data.service';
import { MatButton } from '@angular/material/button'

@Component({
  selector: 'app-connection-lost',
  standalone: true,
  imports: [
    MatButton
  ],
  templateUrl: './connection-lost.component.html',
  styleUrl: './connection-lost.component.scss'
})
export class ConnectionLostComponent {

  @Input()
  error: string | undefined;

  constructor (
    private dataService: DataService
  ) {
  }

  ngOnChange(a) {
    console.log(a)
  }

  reconnect() {
    this.dataService.openConnection();
  }
}
