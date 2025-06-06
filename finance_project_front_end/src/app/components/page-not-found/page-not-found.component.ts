import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-page-not-found',
  templateUrl: './page-not-found.component.html',
  styleUrls: ['./page-not-found.component.scss'],
})
export class PageNotFoundComponent implements OnInit {
  public errorHeader: string = 'Error 404!';
  public errorMessage: string = 'Page not found.';

  constructor() {}

  ngOnInit(): void {}
}
