import { Component } from '@angular/core';

type SubmenuStatus = {
    [key in 'dashboard' | 'stores' | 'vendors' | 'products' | 'users' | 'settings']: boolean;
}

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent {
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
}
