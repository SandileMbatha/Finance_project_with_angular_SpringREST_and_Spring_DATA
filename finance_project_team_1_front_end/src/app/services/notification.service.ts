import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  constructor(private toastr: ToastrService) {}

  showSuccessMessage(message: string) {
    this.toastr.success(message, '', {
      positionClass: 'toast-bottom-right',
    });
  }

  showFailureMessage(message: string) {
    this.toastr.error(message, '', {
      positionClass: 'toast-bottom-right',
    });
  }

  showErrorMessage(error: HttpErrorResponse) {
    this.showFailureMessage(error['error']['causes']);
  }
}
