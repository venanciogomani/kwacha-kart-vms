import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthApiService } from 'src/services/api/auth.api.service';

@Component({
  selector: 'app-onboarding',
  templateUrl: './onboarding.component.html',
  styleUrls: ['./onboarding.component.scss']
})
export class OnboardingComponent {
    constructor(
        private authApiService: AuthApiService,
        private router: Router
    ) { }

    ngOnInit(): void {
        const token = this.authApiService.getAuthToken();
        if (token) {
            this.router.navigate(['dashboard']);
        }
    }
}
