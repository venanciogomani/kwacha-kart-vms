import { Component, ViewChild } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subject, filter, switchMap, takeUntil } from 'rxjs';
import { ModalComponent } from 'src/app/shared/modal/modal.component';
import { ToasterComponent } from 'src/app/shared/toaster/toaster.component';
import { PlanApiService } from 'src/services/api/plan.api.service';
import { StoreApiService } from 'src/services/api/store.api.service';
import { VendorApiService } from 'src/services/api/vendor.api.service';
import { StorePlansModel, StoresModel, VendorModel } from 'src/state';
import { StoresState } from 'src/state/reducers/stores.reducer';
import { selectLoading, selectStores } from 'src/state/selectors/stores.selectors';

type SortStatus = {
    [key in 'name' | 'city' | 'status']: boolean;
}

@Component({
  selector: 'app-stores',
  templateUrl: './stores.component.html',
  styleUrls: ['./stores.component.scss']
})
export class StoresComponent {
    @ViewChild(ModalComponent) modal!: ModalComponent;
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

    stores$: StoresModel[] = [];
    fileterdStores$: StoresModel[] = [];
    isStoresLoading$ = false;

    editStore: StoresModel = {
        id: '',
        name: '',
        status: false,
        vendorId: '',
        planId: '',
        createdAt: ''
    };

    allPlans$: StorePlansModel[] = [];
    vendors$: VendorModel[] = [];

    editRow: { [key: string]: boolean } = {};

    addRow = false;
    deleteRow = false;

    searchTerm = '';

    pageSize = 10;
    currentPage = 1;
    totalPage = 1;
    totalPages = 0;
    totalStores = 0;
    startIndex = 0;
    endIndex = 0;

    sortDirection = 'asc';

    private destroy$: Subject<void> = new Subject<void>();

    constructor(
        private router: Router,
        private storeApiService: StoreApiService,
        private vendorApiService: VendorApiService,
        private planApiService: PlanApiService,
        private store: Store<{ stores: StoresState[] }>,
        private sanitizer: DomSanitizer
    ) {
        this.store.select(selectStores).subscribe((stores: StoresModel[]) => {
            this.stores$ = stores;
        });

        this.store.select(selectLoading).subscribe((isLoading: boolean) => {
            this.isStoresLoading$ = isLoading; // use this for loading screen or lazyloading
        });
    }

    ngOnInit(): void {
        if (this.allPlans$.length === 0) {
            this.planApiService
                .isDataLoaded()
                .pipe(takeUntil(this.destroy$),
                    filter((isLoaded: boolean) => isLoaded),
                    switchMap(() => this.store.select(selectLoading))
                )
                .subscribe((isLoading: boolean) => {
                    if (!isLoading) {
                        this.getAllPlans();
                    }
                });
        } else {
            this.getAllPlans();
        }

        if (this.stores$.length === 0) {
            this.storeApiService
                .isDataLoaded()
                .pipe(takeUntil(this.destroy$),
                    filter((isLoaded: boolean) => isLoaded),
                    switchMap(() => this.store.select(selectStores))
                )
                .subscribe((stores: StoresModel[]) => {
                    this.getAllStores();
                });
        } else {
            this.filterStoresBySearchTerm();
            this.totalStores = this.stores$.length;
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
                    }
                });
        } else {
            this.getAllVendors();
        }
    }

    isEditRow(id: string): boolean {
        return this.editRow[id];
    }

    toggleEditStore(store: StoresModel): void {
        this.resetEditStore();
        this.deleteRow = false;
        this.addRow = false;
        this.editRow[store.id] = !this.editRow[store.id];
        this.editStore = { ...store };
    }

    toggleAddStore(): void {
        this.resetEditStore();
        this.addRow = !this.addRow;
        this.deleteRow = false;
    }

    toggleDeleteStore(store: StoresModel): void {
        this.resetEditStore();
        this.editStore = { ...store };
        this.deleteRow = true;
        this.addRow = false;
        this.modal.isOpen = true;
    }

    getVendorById(id: string) {
        return this.vendors$.find(vendor => vendor.id === id);
    }

    async getAllVendors() {
        return (await this.vendorApiService.getAllVendors()).subscribe((vendors: VendorModel[]) => {
            this.vendors$ = vendors;
        });
    }

    getPlanById(id: string) {
        return this.planApiService.getPlanById(id);
    }

    getAllPlans() {
        this.planApiService.getAllPlans().subscribe((plans: StorePlansModel[]) => {
            this.allPlans$ = plans;
        });
    }

    async getAllStores() {
        return (await this.storeApiService.getAllStores()).subscribe((stores: StoresModel[]) => {
            this.stores$ = stores;
            this.filterStoresBySearchTerm();
        });
    }

    filterStoresBySearchTerm() {
        this.startIndex = (this.currentPage - 1) * this.pageSize;
        this.endIndex = (this.startIndex + this.pageSize) > this.stores$.length ? this.stores$.length : (this.startIndex + this.pageSize);

        if (!this.searchTerm) {
            this.fileterdStores$ = this.stores$.slice(this.startIndex, this.endIndex);
        } else {
            this.fileterdStores$ = this.stores$.filter(store => {
                return store.name.toLowerCase().includes(this.searchTerm.toLowerCase());
            }).slice(this.startIndex, this.endIndex);
        }
        
        this.calculateTotalPages();
    }

    goToPrevPage() {
        if (this.currentPage > 1) {
            this.currentPage--;
            this.filterStoresBySearchTerm();
        }
    }

    goToNextPage() {
        if (this.currentPage < this.totalPages) {
            this.currentPage++;
            this.filterStoresBySearchTerm();
        }
    }

    goToFirstPage() {
        this.currentPage = 1;
        this.filterStoresBySearchTerm();
    }

    goToLastPage() {
        this.currentPage = this.totalPages;
        this.filterStoresBySearchTerm();
    }

    setPage(pageNumber: number) {
        this.currentPage = pageNumber;
        this.filterStoresBySearchTerm();
    }

    calculateTotalPages() {
        this.totalPages = Math.ceil(this.stores$.length / this.pageSize);
    }

    sortBy(key: string) {
        this.fileterdStores$.sort((a: any, b: any) => {
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

    toggleViewStore(id: string) {
        this.router.navigate([`dashboard/store/view/${id}`]);
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    toggleStoreStatus() {
        this.editStore.status = !this.editStore.status;
    }

    resetEditStore() {
        this.editStore = {
            id: '',
            name: '',
            description: '',
            address: '',
            status: false,
            vendorId: '',
            planId: '',
            roleId: '',
            country: '',
            province: '',
            city: '',
            createdAt: '',
            updatedAt: '',
        };
    }

    publishStore() {
        if (this.editStore.name === '' 
            || this.editStore.vendorId === '' 
            || this.editStore.planId === '' 
            || this.editStore.address === ''
            || this.editStore.city === ''
        ) {
            this.toasterMessage = 'Please fill all the fields!';
            this.toasterType = 'error';
            this.toaster.isOpen = true;
            setTimeout(() => {
                this.toaster.isOpen = false;
            }, 3000);
            return;
        }

        this.editStore.createdAt = new Date().toISOString();
        this.editStore.updatedAt = new Date().toISOString();
        this.editStore.country = 'Zambia';
        this.editStore.province = this.editStore.city;
        this.editStore.roleId = 'store';

        const modifiedStoreName = this.editStore.name.toLocaleLowerCase().replace(/\s/g, '_');
        const timestamp = new Date().getTime();
        const storeId = modifiedStoreName + '_store_' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15) + '_' + timestamp;
        this.editStore.id = storeId;

        this.storeApiService.saveStore(this.editStore).subscribe((store: StoresModel) => {
            this.toasterMessage = 'Store published successfully!';
            this.toasterType = 'success';
            this.toaster.isOpen = true;
            setTimeout(() => {
                this.toaster.isOpen = false;
            }, 3000);
            this.getAllStores();
            this.toggleAddStore();
        }, (error: any) => {
            this.toasterMessage = 'Something went wrong!';
            this.toasterType = 'error';
            this.toaster.isOpen = true;
            setTimeout(() => {
                this.toaster.isOpen = false;
            }, 3000);
        });
    }

    performUpdateStore() {
        if (this.editStore.name === '' 
            || this.editStore.vendorId === '' 
            || this.editStore.planId === '' 
            || this.editStore.address === ''
            || this.editStore.city === ''
        ) {
            this.toasterMessage = 'Please fill all the fields!';
            this.toasterType = 'error';
            this.toaster.isOpen = true;
            setTimeout(() => {
                this.toaster.isOpen = false;
            }, 3000);
            return;
        }

        this.editStore.updatedAt = new Date().toISOString();
        this.editStore.country = 'Zambia';
        this.editStore.province = this.editStore.city;
        this.editStore.roleId = 'store';

        this.storeApiService.updateStore(this.editStore).subscribe((store: StoresModel) => {
            this.toasterMessage = 'Store updated successfully!';
            this.toasterType = 'success';
            this.toaster.isOpen = true;
            setTimeout(() => {
                this.toaster.isOpen = false;
            }, 3000);
            this.getAllStores();
            this.toggleEditStore(this.editStore);
        }, (error: any) => {
            this.toasterMessage = 'Something went wrong!';
            this.toasterType = 'error';
            this.toaster.isOpen = true;
            setTimeout(() => {
                this.toaster.isOpen = false;
            }, 3000);
        });
    }

    performDeleteStore() {
        this.storeApiService.deleteStore(this.editStore.id).subscribe((store: StoresModel) => {
            this.toasterMessage = 'Store deleted successfully!';
            this.toasterType = 'success';
            this.toaster.isOpen = true;
            setTimeout(() => {
                this.toaster.isOpen = false;
            }, 3000);
            this.getAllStores();
            this.resetEditStore();
            this.deleteRow = false;
            this.modal.isOpen = false;
        }, (error: any) => {
            this.toasterMessage = 'Something went wrong!';
            this.toasterType = 'error';
            this.toaster.isOpen = true;
            setTimeout(() => {
                this.toaster.isOpen = false;
            }, 3000);
        });
    }

    sanitizeUserInput() {
        this.sanitizedDescription = this.sanitizer.bypassSecurityTrustHtml(this.userDescription);
    }

    closeToaster() {
        this.toaster.isOpen = false;
    }

    closeStoreModal() {
        this.resetEditStore();
        this.deleteRow = false;
        this.addRow = false;
        this.modal.isOpen = false;
    }
}
