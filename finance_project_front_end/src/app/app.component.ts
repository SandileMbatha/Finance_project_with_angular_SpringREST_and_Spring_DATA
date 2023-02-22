import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  public onActivate(event: Event): void {
    window.scroll({
      top: 0,
    });
  }
}
