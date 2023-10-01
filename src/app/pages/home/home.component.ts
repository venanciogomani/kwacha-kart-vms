import { Component } from '@angular/core';
import { AuthApiService } from 'src/services/api/auth.api.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
    constructor(
        private authApiService: AuthApiService
    ) { 
        this.authApiService.resetInactivityTimer();
    }

    ngOnInit(): void {}
}
