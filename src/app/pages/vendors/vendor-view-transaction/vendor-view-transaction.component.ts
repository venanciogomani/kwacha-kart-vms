import { Component } from '@angular/core';
import { AuthApiService } from 'src/services/api/auth.api.service';

@Component({
  selector: 'app-vendor-view-transaction',
  templateUrl: './vendor-view-transaction.component.html',
  styleUrls: ['./vendor-view-transaction.component.scss']
})
export class VendorViewTransactionComponent {
    constructor(
        private authApiService: AuthApiService
    ) { 
        this.authApiService.resetInactivityTimer(); // reset inactivity timer
    }
}
