import { Component, ViewChild } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subject, filter, switchMap, takeUntil } from 'rxjs';
import { ToasterComponent } from 'src/app/shared/toaster/toaster.component';
import { RoleApiService } from 'src/services/api/role.api.service';
import { StoreApiService } from 'src/services/api/store.api.service';
import { VendorApiService } from 'src/services/api/vendor.api.service';
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
    @ViewChild(ToasterComponent) toaster!: ToasterComponent;

    userDescription: string = '<script>alert("XSS Attack")</script>';
    sanitizedDescription!: SafeHtml;

    toasterMessage = 'Something went wrong!';
    toasterType = 'error';
    
    sortStatus: SortStatus = {
        name: false,
        city: false,
        status: false,
    };

    vendors$: VendorModel[] = [];
    fileteredVendors$: VendorModel[] = [];
    isVendorsLoading$ = false;

    showSpinner: boolean = true;

    vendorEdit$: VendorModel = {
        id: '',
        name: '',
        address: '',
        city: '',
        province: '',
        country: '',
        phone: '',
        email: '',
        status: false,
        isVerified: false,
        storeId: '',
        roleId: '',
        createdAt: ''
    }

    availableStores$: StoresModel = {
        id: '',
        name: '',
        status: false,
        vendorId: '',
        planId: '',
        createdAt: ''
    };

    availableRoles$: StoreRoleModel[] = [];
    allStores$: StoresModel[] = [];

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

    private destroy$: Subject<void> = new Subject<void>();

    constructor(
        private router: Router,
        private storeApiService: StoreApiService,
        private roleApiService: RoleApiService,
        private vendorApiService: VendorApiService,
        private store: Store<{ vendors: VendorModel[] }>,
        private sanitizer: DomSanitizer
    ) {
        this.store.select(selectVendors).subscribe((vendor: VendorModel[]) => {
            this.vendors$ = vendor;
        });
    }

    ngOnInit(): void {
        if (this.allStores$.length === 0) {
            this.storeApiService
                .isDataLoaded()
                .pipe(takeUntil(this.destroy$),
                    filter((isLoaded: boolean) => isLoaded),
                    switchMap(() => this.store.select(selectLoading))
                )
                .subscribe((isLoading: boolean) => {
                    if (!isLoading) {
                        this.getAllStores();
                    }
                });
        } else {
            this.getAllStores();
        }

        if (this.vendors$.length === 0) {
            this.vendorApiService
                .isDataLoaded()
                .pipe(takeUntil(this.destroy$),
                    filter((isLoaded: boolean) => isLoaded),
                    switchMap(() => this.store.select(selectLoading))
                )
                .subscribe((isLoading: boolean) => {
                    if (!isLoading) {
                        this.getAllVendors();
                        this.isVendorsLoading$ = false;
                    }
                });
        } else {
            this.filterVendorsBySearchTerm();
            this.totalVendors = this.vendors$.length;
            this.isVendorsLoading$ = false;
        }
        
        this.getAllRoles();
    }

    isEditRow(id: string): boolean {
        return this.editRow[id];
    }

    toggleEditVendor(vendorToEdit: VendorModel): void {
        this.resetVendorEdit();
        this.editRow[vendorToEdit.id] = !this.editRow[vendorToEdit.id];
        this.vendorEdit$ = this.editRow[vendorToEdit.id] == true ? vendorToEdit : {} as VendorModel;
    }

    toggleAddVendor(): void {
        this.resetVendorEdit();
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
        this.router.navigate([`dashboard/vendors/view/${id}`]);
    }

    getStoreById(id: string): StoresModel {
        return this.allStores$.filter(store => store.id === id)[0] || {} as StoresModel;
    }

    async getAllStores() {
        return (await this.storeApiService.getAllStores()).subscribe((stores: StoresModel[]) => {
            this.allStores$ = stores;
        });
    }

    getRoleById(id: string): StoreRoleModel {
        return this.availableRoles$.filter(role => role.id === id)[0] || {} as StoreRoleModel;
    }

    async getAllRoles() {
        return (await this.roleApiService.getAllRoles()).subscribe((roles: StoreRoleModel[]) => {
            this.availableRoles$ = roles;
        });
    }

    async getAllVendors() {
        return (await this.vendorApiService.getAllVendors()).subscribe((vendors: VendorModel[]) => {
            this.vendors$ = vendors;
            this.filterVendorsBySearchTerm();
        });
    }

    publishVendor() {
        if (this.vendorEdit$.name === '' 
            || this.vendorEdit$.address === '' 
            || this.vendorEdit$.city === '' 
            || this.vendorEdit$.phone === '' 
            || this.vendorEdit$.email === '' 
            || this.vendorEdit$.storeId === '' 
            || this.vendorEdit$.roleId === ''
        ) {
            this.toasterMessage = 'Please fill all the fields!';
            this.toasterType = 'error';
            this.toaster.isOpen = true;
            setTimeout(() => {
                this.closeToaster();
            }, 3000);

            return;
        }

        const modifiedVendorName = this.vendorEdit$.name.replace(/\s/g, '_').toLowerCase();
        const timestamp = new Date().getTime();
        const vendorId = `${modifiedVendorName}_vendor_${Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)}_${timestamp}`;

        this.vendorEdit$.id = vendorId;

        this.vendorEdit$.createdAt = new Date().toISOString();
        this.vendorEdit$.country = 'Zambia';
        this.vendorEdit$.province = this.vendorEdit$.city;
        this.vendorEdit$.updatedAt = new Date().toISOString();

        this.vendorApiService.saveVendor(this.vendorEdit$).subscribe((vendor: VendorModel) => {
            this.toasterMessage = 'Vendor saved successfully!';
            this.toasterType = 'success';
            this.toaster.isOpen = true;
            setTimeout(() => {
                this.closeToaster();
            }, 3000);
            this.getAllVendors();
            this.resetVendorEdit();
            this.toggleAddVendor();
        }, (error: any) => {
            this.toasterMessage = 'Something went wrong!';
            this.toasterType = 'error';
            this.toaster.isOpen = true;
            setTimeout(() => {
                this.closeToaster();
            }, 3000);
        });
    }

    sanitizeUserInput() {
        this.sanitizedDescription = this.sanitizer.bypassSecurityTrustHtml(this.userDescription);
    }

    closeToaster() {
        this.toaster.isOpen = false;
    }

    toggleVendorStatus() {
        this.vendorEdit$.status = !this.vendorEdit$.status;
    }

    toggleVendorVerification() {
        this.vendorEdit$.isVerified = !this.vendorEdit$.isVerified;
    }

    resetVendorEdit() {
        this.vendorEdit$ = {
            id: '',
            name: '',
            address: '',
            city: '',
            province: '',
            country: '',
            phone: '',
            email: '',
            status: false,
            isVerified: false,
            storeId: '',
            roleId: '',
            createdAt: ''
        };
    }

    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
