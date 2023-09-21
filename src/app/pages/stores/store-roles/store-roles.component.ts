import { Component, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import { ModalComponent } from 'src/app/shared/modal/modal.component';
import { RoleApiService } from 'src/services/api/role.api.service';
import { VendorApiService } from 'src/services/api/vendor.api.service';
import { StorePermissionsModel, StoreRoleModel, VendorModel } from 'src/state/models';
import { selectLoading, selectRoles } from 'src/state/selectors/roles.selectors';

@Component({
  selector: 'app-store-roles',
  templateUrl: './store-roles.component.html',
  styleUrls: ['./store-roles.component.scss']
})
export class StoreRolesComponent {
    @ViewChild(ModalComponent) modal!: ModalComponent;

    roles$: StoreRoleModel[] = [];
    filteredRoles$: StoreRoleModel[] = [];
    
    roleEdit: StoreRoleModel = {
        id: '',
        name: '',
        description: '',
        createdAt: '',
        updatedAt: '',
        status: false,
        permissionsId: []
    }

    isAddingRole$ = false;
    isEditingRole$ = false;
    isViewingRole$ = false;

    isRolesLoading$ = false;

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
        private vendorApiService: VendorApiService,
        private roleApiService: RoleApiService,
        private store: Store<{ roles: StoreRoleModel[] }>,
    ) {
        this.store.select(selectRoles).subscribe((roles: StoreRoleModel[]) => {
            this.roles$ = roles;
        });

        this.store.select(selectLoading).subscribe((isLoading: boolean) => {
            this.isRolesLoading$ = isLoading; // use this for loading screen or lazyloading
        });
    }

    ngOnInit() {
        this.filterRoleBySearchTerm();
        this.totalPlans = this.roles$.length;
    }

    filterRoleBySearchTerm() {
        this.startIndex = (this.currentPage - 1) * this.pageSize;
        this.endIndex = (this.startIndex + this.pageSize) > this.roles$.length ? this.roles$.length : (this.startIndex + this.pageSize);

        if (this.searchTerm === '') {
            this.filteredRoles$ = this.roles$.slice(this.startIndex, this.endIndex);
        } else {
            this.filteredRoles$ = this.roles$.filter((role: StoreRoleModel) => {
                return role.name.toLowerCase().includes(this.searchTerm.toLowerCase());
            }).slice(this.startIndex, this.endIndex);
        }

        this.calculateTotalPages();
    }

    goToPrevPage() {
        if (this.currentPage > 1) {
            this.currentPage--;
            this.filterRoleBySearchTerm();
        }
    }

    goToNextPage() {
        if (this.currentPage < this.totalPages) {
            this.currentPage++;
            this.filterRoleBySearchTerm();
        }
    }

    goToFirstPage() {
        this.currentPage = 1;
        this.filterRoleBySearchTerm();
    }

    goToLastPage() {
        this.currentPage = this.totalPages;
        this.filterRoleBySearchTerm();
    }

    setPage(pageNumber: number) {
        this.currentPage = pageNumber;
        this.filterRoleBySearchTerm();
    }

    calculateTotalPages() {
        this.totalPages = Math.ceil(this.roles$.length / this.pageSize);
    }

    sortBy(key: string) {
        this.filteredRoles$.sort((a: any, b: any) => {
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

    getVendorsById(id: string): VendorModel[] {
        return this.vendorApiService.getVendorsByRoleId(id);
    }

    toggleAddRoleModal() {
        this.isAddingRole$ = !this.isAddingRole$;
        this.isEditingRole$ = false;
        this.isViewingRole$ = false;
        
        this.resetRoleEdit();

        if (this.modal) {
            this.modal.isOpen = !this.modal.isOpen;
        }
    }

    toggleEditRoleModal(role: StoreRoleModel) {
        this.isAddingRole$ = false;
        this.isEditingRole$ = !this.isEditingRole$;
        this.isViewingRole$ = false;

        this.resetRoleEdit();
        
        this.roleEdit =  {...role }
        
        if (this.modal) {
            this.modal.isOpen = !this.modal.isOpen;
        }
    }

    toggleViewRoleModal(role: StoreRoleModel) {
        this.isAddingRole$ = false;
        this.isEditingRole$ = false;
        this.isViewingRole$ = !this.isViewingRole$;

        this.resetRoleEdit();
        
        this.roleEdit =  {...role }
        
        if (this.modal) {
            this.modal.isOpen = !this.modal.isOpen;
        }
    }

    resetRoleEdit() {
        this.roleEdit = {
            id: '',
            name: '',
            description: '',
            createdAt: '',
            updatedAt: '',
            status: false,
            permissionsId: []
        };
    }

    get allPermissions(): StorePermissionsModel[] {
        return this.roleApiService.getAllPermissions();
    }

    getAllPermissionsIdsByRole(roleId: string) {
        return this.roleApiService.getAllPermissionIdsByRole(roleId);
    }
}
