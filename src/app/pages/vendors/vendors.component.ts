import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { RoleApiService } from 'src/services/api/role.api.service';
import { StoreApiService } from 'src/services/api/store.api.service';
import { StoreRoleModel, StoresModel, VendorModel } from 'src/state';
import { selectLoading, selectVendors } from 'src/state/selectors/vendors.selectors';

type SortStatus = {
    [key in 'name' | 'city' | 'status']: boolean;
}

@Component({
  selector: 'app-vendors',
  templateUrl: './vendors.component.html',
  styleUrls: ['./vendors.component.scss']
})
export class VendorsComponent {
    sortStatus: SortStatus = {
        name: false,
        city: false,
        status: false,
    };

    vendors$: VendorModel[] = [];
    fileteredVendors$: VendorModel[] = [];
    isVendorsLoading$ = false;

    availableStores$: StoresModel = {
        id: '',
        name: '',
        status: false,
        vendorId: '',
        planId: '',
        createdAt: ''
    };

    availableRoles$: StoreRoleModel = {
        id: '',
        name: '',
        permissionsId: [],
        status: false,
        createdAt: ''
    };

    editRow: { [key: string]: boolean } = {};

    addRow = false;

    searchTerm = '';

    pageSize = 10;
    currentPage = 1;
    totalPage = 1;
    totalPages = 0;
    totalVendors = 0;
    startIndex = 0;
    endIndex = 0;

    sortDirection = 'asc';

    constructor(
        private router: Router,
        private storeApiService: StoreApiService,
        private roleApiService: RoleApiService,
        private store: Store<{ vendors: VendorModel[] }>,
    ) {
        this.store.select(selectVendors).subscribe((vendor: VendorModel[]) => {
            this.vendors$ = vendor;
        });

        this.store.select(selectLoading).subscribe((isLoading: boolean) => {
            this.isVendorsLoading$ = isLoading; // use this for loading screen or lazyloading
        });
    }

    ngOnInit(): void {
        this.filterVendorsBySearchTerm();
        this.totalVendors = this.vendors$.length;
    }

    isEditRow(id: string): boolean {
        return this.editRow[id];
    }

    toggleEditVendor(id: string): void {
        this.editRow[id] = !this.editRow[id];
    }

    toggleAddVendor(): void {
        this.addRow = !this.addRow;
    }

    filterVendorsBySearchTerm() {
        this.startIndex = (this.currentPage - 1) * this.pageSize;
        this.endIndex = (this.startIndex + this.pageSize) > this.vendors$.length ? this.vendors$.length : (this.startIndex + this.pageSize);

        if (!this.searchTerm) {
            this.fileteredVendors$ = this.vendors$.slice(this.startIndex, this.endIndex);
        } else {
            this.fileteredVendors$ = this.vendors$.filter(vendor => {
                return vendor.name.toLowerCase().includes(this.searchTerm.toLowerCase());
            }).slice(this.startIndex, this.endIndex);
        }
        
        this.calculateTotalPages();
    }

    goToPrevPage() {
        if (this.currentPage > 1) {
            this.currentPage--;
            this.filterVendorsBySearchTerm();
        }
    }

    goToNextPage() {
        if (this.currentPage < this.totalPages) {
            this.currentPage++;
            this.filterVendorsBySearchTerm();
        }
    }

    goToFirstPage() {
        this.currentPage = 1;
        this.filterVendorsBySearchTerm();
    }

    goToLastPage() {
        this.currentPage = this.totalPages;
        this.filterVendorsBySearchTerm();
    }

    setPage(pageNumber: number) {
        this.currentPage = pageNumber;
        this.filterVendorsBySearchTerm();
    }

    calculateTotalPages() {
        this.totalPages = Math.ceil(this.vendors$.length / this.pageSize);
    }

    sortBy(key: string) {
        this.fileteredVendors$.sort((a: any, b: any) => {
            if (a[key] < b[key]) {
                return this.sortDirection === 'asc' ? -1 : 1;
            }

            if (a[key] > b[key]) {
                return this.sortDirection === 'asc' ? 1 : -1;
            }

            return 0;
        });

        this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    }

    get pagesArray(): number[] {
        return Array.from({length: this.totalPages}, (_, i) => i + 1);
    }

    toggleViewVendor(id: string) {
        this.router.navigate([`/vendors/view/${id}`]);
    }

    getStoreById(id: string) {
        return this.storeApiService.getStoreById(id);
    }

    get getAllStores() {
        return this.storeApiService.getAllStores();
    }

    getRoleById(id: string) {
        return this.roleApiService.getRoleById(id);
    }

    get getAllRoles() {
        return this.roleApiService.getAllRoles();
    }
}
