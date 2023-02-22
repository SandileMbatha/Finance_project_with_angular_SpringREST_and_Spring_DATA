import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-error-message',
  templateUrl: './error-message.component.html',
  styleUrls: ['./error-message.component.scss']
})
export class ErrorMessageComponent implements OnInit {

  @Input()  detailsForm: any;

  @Input() attribute: any;

  constructor() { }

  ngOnInit(): void {
  }

  public requiredAttribute(){
    let result = '';
    for(let letter of this.attribute){
      if(letter === letter.toUpperCase()){
        result += ' ';
      }
      result = result.concat(letter);
    }
    console.log(result[0].toUpperCase() + result.substring(1))
    return result[0].toUpperCase() + result.substring(1);
  }
}

