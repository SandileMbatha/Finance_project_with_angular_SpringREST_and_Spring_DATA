import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ErrorMessageComponent } from '../reusables/error-message/error-message.component';

@NgModule({
    imports: [
        CommonModule
     ],
    declarations: [
      ErrorMessageComponent
    ],
    exports: [
      ErrorMessageComponent
    ]
})
export class SharedModule {}
