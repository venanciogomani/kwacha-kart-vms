import { Component, ViewChild } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Store } from '@ngrx/store';
import { Subject, filter, switchMap, takeUntil } from 'rxjs';
import { ModalComponent } from 'src/app/shared/modal/modal.component';
import { ToasterComponent } from 'src/app/shared/toaster/toaster.component';
import { AuthApiService } from 'src/services/api/auth.api.service';
import { PlanApiService } from 'src/services/api/plan.api.service';
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
    @ViewChild(ToasterComponent) toaster!: ToasterComponent;

    userDescription: string = '<script>alert("XSS Attack")</script>';
    sanitizedDescription!: SafeHtml;

    toasterMessage = 'Something went wrong!';
    toasterType = 'error';
    
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

    isDeletingPlan = false;
    isEditingPlan = false;

    isPlansLoading$ = false;

    searchTerm: string = '';

    pageSize = 10;
    currentPage = 1;
    totalPage = 1;
    totalPages = 0;
    totalPlans = 0;
    startIndex = 0;
    endIndex = 0;

    sortDirection = 'asc';

    private destroy$: Subject<void> = new Subject<void>();
    
    constructor(
        private storeApiService: StoreApiService,
        private planApiService: PlanApiService,
        private authApiService: AuthApiService,
        private store: Store<{ plans: StorePlansModel[] }>,
        private sanitizer: DomSanitizer
    ) {
        this.store.select(selectPlans).subscribe((plans: StorePlansModel[]) => {
            this.plans$ = plans;
        });

        this.store.select(selectLoading).subscribe((isLoading: boolean) => {
            this.isPlansLoading$ = isLoading; // use this for loading screen or lazyloading
        });

        this.authApiService.resetInactivityTimer(); // reset inactivity timer
    }

    ngOnInit() {
        if (this.plans$.length === 0) {
            this.planApiService
                .isDataLoaded()
                .pipe(takeUntil(this.destroy$),
                    filter((isLoaded: boolean) => isLoaded),
                    switchMap(() => this.store.select(selectLoading))
                )
                .subscribe((isLoading: boolean) => {
                    if (!isLoading) {
                        this.getAllPlans();
                        this.filterPlanBySearchTerm();
                        this.totalPlans = this.plans$.length;
                    }
                });
        } else {
            this.filterPlanBySearchTerm();
            this.getAllPlans();
            this.totalPlans = this.plans$.length;
        }
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
        this.authApiService.resetInactivityTimer(); // reset inactivity timer
    }

    toggleAddPlanModal() {
        this.resetPlanEdit();
        this.isDeletingPlan = false;
        this.isEditingPlan = false;
        if (this.modal) {
            this.modal.isOpen = !this.modal.isOpen;
        }
    }

    toggleEditPlanModal(plan: StorePlansModel) {
        this.resetPlanEdit();
        this.isDeletingPlan = false;
        this.isEditingPlan = true;
        this.planEdit =  {...plan }
        if (this.modal) {
            this.modal.isOpen = !this.modal.isOpen;
        }
    }

    toggleDeletePlanModal(plan: StorePlansModel) {
        this.resetPlanEdit();
        this.planEdit =  {...plan }
        this.isDeletingPlan = true;
        this.isEditingPlan = false;
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

    publishPlan() {
        if (this.planEdit.name === '' || this.planEdit.description === '' || this.planEdit.price === 0) {
            this.toasterMessage = 'Please fill all the required fields';
            this.toasterType = 'error';
            this.toaster.isOpen = true;
            setTimeout(() => {
                this.toaster.isOpen = false;
            }, 3000);
            return;
        }

        this.planEdit.createdAt = new Date().toISOString();
        this.planEdit.updatedAt = new Date().toISOString();

        const modifiedRoleName = this.planEdit.name.toLowerCase().replace(/\s/g, '-');
        const timestamp = new Date().getTime();
        const newPlanId = modifiedRoleName + '_' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15) + '_' + timestamp;

        this.planEdit.id = newPlanId;
        
        this.planApiService.savePlan(this.planEdit).subscribe((plan: StorePlansModel) => {
            this.toasterMessage = 'Plan published successfully!';
            this.toasterType = 'success';
            this.toaster.isOpen = true;
            setTimeout(() => {
                this.toaster.isOpen = false;
            }, 3000);
            this.getAllPlans();
            this.toggleAddPlanModal();
        },
        (error) => {
            this.toasterMessage = 'Something went wrong!';
            this.toasterType = 'error';
            this.toaster.isOpen = true;
            setTimeout(() => {
                this.toaster.isOpen = false;
            }, 3000);
        });
    }

    performUpdatePlan() {
        if (this.planEdit.name === '' || this.planEdit.description === '' || this.planEdit.price === 0) {
            this.toasterMessage = 'Please fill all the required fields';
            this.toasterType = 'error';
            this.toaster.isOpen = true;
            setTimeout(() => {
                this.toaster.isOpen = false;
            }, 3000);
            return;
        }

        this.planEdit.updatedAt = new Date().toISOString();

        this.planApiService.updatePlan(this.planEdit).subscribe((plan: StorePlansModel) => {
            this.toasterMessage = 'Plan updated successfully!';
            this.toasterType = 'success';
            this.toaster.isOpen = true;
            setTimeout(() => {
                this.toaster.isOpen = false;
            }, 3000);
            this.getAllPlans();
            this.toggleAddPlanModal();
        },
        (error) => {
            this.toasterMessage = error;
            this.toasterType = 'error';
            this.toaster.isOpen = true;
            setTimeout(() => {
                this.toaster.isOpen = false;
            }, 3000);
        });
    }

    performDeletePlan() {
        this.planApiService.deletePlan(this.planEdit.id).subscribe((response: any) => {
            this.toasterMessage = 'Plan deleted successfully!';
            this.toasterType = 'success';
            this.toaster.isOpen = true;
            setTimeout(() => {
                this.toaster.isOpen = false;
            }, 3000);
            this.getAllPlans();
            this.toggleAddPlanModal();
        },
        (error) => {
            this.toasterMessage = 'Something went wrong!';
            this.toasterType = 'error';
            this.toaster.isOpen = true;
            setTimeout(() => {
                this.toaster.isOpen = false;
            }, 3000);
        });
    }

    closeToaster() {
        this.toaster.isOpen = false;
    }

    sanitizeUserInput() {
        this.sanitizedDescription = this.sanitizer.bypassSecurityTrustHtml(this.userDescription);
    }

    togglePlanStatus() {
        this.planEdit.status = !this.planEdit.status;
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

    getAllPlans() {
        return this.planApiService.getAllPlans().subscribe((plans: StorePlansModel[]) => {
            this.plans$ = plans;
            this.filterPlanBySearchTerm();
        });
    }
}
