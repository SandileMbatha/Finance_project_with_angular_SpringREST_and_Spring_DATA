import { Component, Input, OnInit } from '@angular/core';
import { CardData } from 'src/app/models/card-data';
import { NavigationService } from 'src/app/services/navigation.service';

@Component({
  selector: 'app-details-card',
  templateUrl: './details-card.component.html',
  styleUrls: ['./details-card.component.scss'],
})
export class DetailsCardComponent implements OnInit {
  @Input() public cardData: CardData = {
    header: '',
    rows: [],
    editButton: false,
  };

  constructor(private navigationService: NavigationService) {}

  ngOnInit(): void {}

  public update(): void {
    this.navigationService.goToUpdatePage();
  }
}
