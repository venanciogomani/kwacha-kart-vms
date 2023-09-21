import { Component, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import { ModalComponent } from 'src/app/shared/modal/modal.component';
import { StoreApiService } from 'src/services/api/store.api.service';
import { StorePlansModel, StoresModel } from 'src/state';
import { selectLoading, selectPlans } from 'src/state/selectors/plans.selectors';

type SortStatus = {
    [key in 'name' | 'status']: boolean;
}

@Component({
  selector: 'app-store-plans',
  templateUrl: './store-plans.component.html',
  styleUrls: ['./store-plans.component.scss']
})
export class StorePlansComponent {
    @ViewChild(ModalComponent) modal!: ModalComponent;
    sortStatus: SortStatus = {
        name: false,
        status: false,
    };

    plans$: StorePlansModel[] = [];
    filteredPlans$: StorePlansModel[] = [];

    storesByPlanId: StoresModel[] = [];
    
    planEdit: StorePlansModel = {
        id: '',
        name: '',
        status: false,
        description: '',
        price: 0,
        createdAt: '',
        updatedAt: '',
        billingCycle: ''
    };

    isPlansLoading$ = false;

    editRow: { [key: string]: boolean } = {};

    searchTerm: string = '';

    pageSize = 10;
    currentPage = 1;
    totalPage = 1;
    totalPages = 0;
    totalPlans = 0;
    startIndex = 0;
    endIndex = 0;

    sortDirection = 'asc';
    
    constructor(
        private storeApiService: StoreApiService,
        private store: Store<{ plans: StorePlansModel[] }>,
    ) {
        this.store.select(selectPlans).subscribe((plans: StorePlansModel[]) => {
            this.plans$ = plans;
        });

        this.store.select(selectLoading).subscribe((isLoading: boolean) => {
            this.isPlansLoading$ = isLoading; // use this for loading screen or lazyloading
        });
    }

    ngOnInit() {
        this.filterPlanBySearchTerm();
        this.totalPlans = this.plans$.length;
    }

    filterPlanBySearchTerm() {
        this.startIndex = (this.currentPage - 1) * this.pageSize;
        this.endIndex = (this.startIndex + this.pageSize) > this.plans$.length ? this.plans$.length : (this.startIndex + this.pageSize);

        if (this.searchTerm === '') {
            this.filteredPlans$ = this.plans$.slice(this.startIndex, this.endIndex);
        } else {
            this.filteredPlans$ = this.plans$.filter((plan: StorePlansModel) => {
                return plan.name.toLowerCase().includes(this.searchTerm.toLowerCase());
            }).slice(this.startIndex, this.endIndex);
        }

        this.calculateTotalPages();
    }

    toggleAddPlanModal() {
        this.resetPlanEdit();
        if (this.modal) {
            this.modal.isOpen = !this.modal.isOpen;
        }
    }

    toggleEditPlanModal(plan: StorePlansModel) {
        this.resetPlanEdit();
        this.planEdit =  {...plan }
        if (this.modal) {
            this.modal.isOpen = !this.modal.isOpen;
        }
    }

    resetPlanEdit() {
        this.planEdit = {
            id: '',
            name: '',
            status: false,
            description: '',
            price: 0,
            createdAt: '',
            updatedAt: '',
            billingCycle: ''
        };
    }

    goToPrevPage() {
        if (this.currentPage > 1) {
            this.currentPage--;
            this.filterPlanBySearchTerm();
        }
    }

    goToNextPage() {
        if (this.currentPage < this.totalPages) {
            this.currentPage++;
            this.filterPlanBySearchTerm();
        }
    }

    goToFirstPage() {
        this.currentPage = 1;
        this.filterPlanBySearchTerm();
    }

    goToLastPage() {
        this.currentPage = this.totalPages;
        this.filterPlanBySearchTerm();
    }

    setPage(pageNumber: number) {
        this.currentPage = pageNumber;
        this.filterPlanBySearchTerm();
    }

    calculateTotalPages() {
        this.totalPages = Math.ceil(this.plans$.length / this.pageSize);
    }

    sortBy(key: string) {
        this.filteredPlans$.sort((a: any, b: any) => {
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

    getStoresByPlanId(planId: string): StoresModel[] {
        return this.storeApiService.getStoreByPlanId(planId);
    }
}
