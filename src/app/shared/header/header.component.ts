import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthApiService } from 'src/services/api/auth.api.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
    isDropdownOpen = false;

    constructor(
        private authApi: AuthApiService,
        private router: Router
    ) { }

    toggleDropdown() {
        this.isDropdownOpen = !this.isDropdownOpen;
    }

    performLogout() {
        this.isDropdownOpen = false;
        this.authApi.logout();
    }

    goToProfile() {
        this.isDropdownOpen = false;
        this.router.navigate(['/dashboard/users/profile']);
    }
}
