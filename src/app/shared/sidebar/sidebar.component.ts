import { Component } from '@angular/core';
import { Router } from '@angular/router';

type SubmenuStatus = {
    [key in 'dashboard' | 'stores' | 'vendors' | 'products' | 'users' | 'settings']: boolean;
}

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent {
    constructor(private router: Router) {}

    submenuStatus: SubmenuStatus = {
        dashboard: false,
        stores: false,
        vendors: false,
        products: false,
        users: false,
        settings: false,
    };

    toggleSubmenu(submenu: keyof SubmenuStatus): void {
        this.submenuStatus[submenu] = !this.submenuStatus[submenu];
    }

    isMenuOpen(submenu: keyof SubmenuStatus): boolean {
        return this.submenuStatus[submenu];
    }

    navigateTo(path: string): void {
        this.router.navigate([path]);
    }
}
