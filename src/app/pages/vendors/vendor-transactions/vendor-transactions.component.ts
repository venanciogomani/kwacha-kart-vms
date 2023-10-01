import { Component } from '@angular/core';
import { AuthApiService } from 'src/services/api/auth.api.service';

@Component({
  selector: 'app-vendor-transactions',
  templateUrl: './vendor-transactions.component.html',
  styleUrls: ['./vendor-transactions.component.scss']
})
export class VendorTransactionsComponent {
    constructor(
        private authApiService: AuthApiService
    ) { 
        this.authApiService.resetInactivityTimer(); // reset inactivity timer
    }
}
