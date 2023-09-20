import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { PlanApiService } from 'src/services/api/plan.api.service';
import { StoreApiService } from 'src/services/api/store.api.service';
import { VendorApiService } from 'src/services/api/vendor.api.service';
import { StoresModel } from 'src/state';
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
    sortStatus: SortStatus = {
        name: false,
        city: false,
        status: false,
    };

    stores$: StoresModel[] = [];
    fileterdStores$: StoresModel[] = [];
    isStoresLoading$ = false;

    editRow: { [key: string]: boolean } = {};

    addRow = false;

    searchTerm = '';

    pageSize = 10;
    currentPage = 1;
    totalPage = 1;
    totalPages = 0;
    totalStores = 0;
    startIndex = 0;
    endIndex = 0;

    sortDirection = 'asc';

    constructor(
        private storeApiService: StoreApiService,
        private vendorApiService: VendorApiService,
        private planApiService: PlanApiService,
        private store: Store<{ stores: StoresState[] }>,
    ) {
        this.store.select(selectStores).subscribe((stores: StoresModel[]) => {
            this.stores$ = stores;
        });

        this.store.select(selectLoading).subscribe((isLoading: boolean) => {
            this.isStoresLoading$ = isLoading; // use this for loading screen or lazyloading
        });
    }

    ngOnInit(): void {
        this.storeApiService.createInitialStoresState();
        this.filterStoresBySearchTerm();
        this.totalStores = this.stores$.length;
    }

    isEditRow(id: string): boolean {
        return this.editRow[id];
    }

    toggleEditStore(id: string): void {
        this.editRow[id] = !this.editRow[id];
    }

    toggleAddStore(): void {
        this.addRow = !this.addRow;
    }

    getVendorById(id: string) {
        return this.vendorApiService.getVendorById(id);
    }

    getPlanById(id: string) {
        return this.planApiService.getPlanById(id);
    }

    filterStoresBySearchTerm() {
        this.startIndex = (this.currentPage - 1) * this.pageSize;
        this.endIndex = (this.startIndex + this.pageSize) > this.stores$.length ? this.stores$.length : (this.startIndex + this.pageSize);

        if (!this.searchTerm) {
            this.fileterdStores$ = this.stores$.slice(this.startIndex, this.endIndex);
        }

        const storesSearchResult = this.stores$.filter(store => {
            return store.name.toLowerCase().includes(this.searchTerm.toLowerCase());
        });

        this.fileterdStores$ = storesSearchResult.slice(this.startIndex, this.endIndex);
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
}
