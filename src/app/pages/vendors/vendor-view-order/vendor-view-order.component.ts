import { Component } from '@angular/core';
import { AuthApiService } from 'src/services/api/auth.api.service';

@Component({
  selector: 'app-vendor-view-order',
  templateUrl: './vendor-view-order.component.html',
  styleUrls: ['./vendor-view-order.component.scss']
})
export class VendorViewOrderComponent {
    constructor(
        private authApiService: AuthApiService
    ) { 
        this.authApiService.resetInactivityTimer(); // reset inactivity timer
    }
}
