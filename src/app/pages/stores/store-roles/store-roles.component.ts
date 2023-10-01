import { Component, ViewChild } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Store } from '@ngrx/store';
import { Subject, filter, switchMap, takeUntil } from 'rxjs';
import { ModalComponent } from 'src/app/shared/modal/modal.component';
import { ToasterComponent } from 'src/app/shared/toaster/toaster.component';
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
    @ViewChild(ToasterComponent) toaster!: ToasterComponent;

    userDescription: string = '<script>alert("XSS Attack")</script>';
    sanitizedDescription!: SafeHtml;

    toasterMessage = 'Something went wrong!';
    toasterType = 'error';

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

    allPermissions$: StorePermissionsModel[] = [];
    availablePermissions$: StorePermissionsModel[] = [];

    isAddingRole$ = false;
    isEditingRole$ = false;
    isViewingRole$ = false;
    isDeletingRole$ = false;

    isRolesLoading$ = true;

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
        private vendorApiService: VendorApiService,
        private roleApiService: RoleApiService,
        private store: Store<{ roles: StoreRoleModel[] }>,
        private sanitizer: DomSanitizer
    ) {
        this.store.select(selectRoles).subscribe((roles: StoreRoleModel[]) => {
            this.roles$ = roles;
        });
    }

    ngOnInit() {
        if (this.roles$.length === 0) {
            this.roleApiService
                .isDataLoaded()
                .pipe(takeUntil(this.destroy$),
                    filter((isLoaded: boolean) => isLoaded),
                    switchMap(() => this.store.select(selectLoading))
                )
                .subscribe((isLoading: boolean) => {
                    this.isRolesLoading$ = isLoading;
                    this.filterRoleBySearchTerm();
                    this.getAllPermissions();
                    this.totalPlans = this.roles$.length;
                });
        } else {
            this.isRolesLoading$ = false;
            this.filterRoleBySearchTerm();
            this.getAllPermissions();
            this.totalPlans = this.roles$.length;
        }
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

    publishRole() {
        if (this.roleEdit.name === '') {
            this.toaster.isOpen = true;
            this.toasterMessage = 'Role name is required!';
            this.toasterType = 'error';
            setTimeout(() => {
                this.toaster.isOpen = false;
            }, 5000);
            return;
        }

        if (this.roleEdit.permissionsId.length === 0) {
            this.toaster.isOpen = true;
            this.toasterMessage = 'At least one permission is required!';
            this.toasterType = 'error';
            setTimeout(() => {
                this.toaster.isOpen = false;
            }, 5000);
            return;
        }

        this.roleEdit.createdAt = new Date().toISOString();
        this.roleEdit.updatedAt = new Date().toISOString();

        const modifiedRoleName = this.roleEdit.name.toLocaleLowerCase().replace(/\s/g, '_');
        const timestamp = new Date().getTime();
        const id = modifiedRoleName + '_role_' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15) + '_' + timestamp;
        
        this.roleEdit.id = id;

        this.roleApiService.saveRole(this.roleEdit).subscribe((response) => {
                this.toaster.isOpen = true;
                this.toasterMessage = 'Role has been added successfully!';
                this.toasterType = 'success';
                setTimeout(() => {
                    this.toaster.isOpen = false;
                }, 5000);
                this.getAllRoles();
                this.closeRoleModal();
            },
            (error) => {
                this.toaster.isOpen = true;
                this.toasterMessage = 'Something went wrong!';
                this.toasterType = 'error';
                setTimeout(() => {
                    this.toaster.isOpen = false;
                }, 5000);
            }
        );
    }

    performUpdateRole() {
        if (this.roleEdit.name === '') {
            this.toaster.isOpen = true;
            this.toasterMessage = 'Role name is required!';
            this.toasterType = 'error';
            setTimeout(() => {
                this.toaster.isOpen = false;
            }, 5000);
            return;
        }

        if (this.roleEdit.permissionsId.length === 0) {
            this.toaster.isOpen = true;
            this.toasterMessage = 'At least one permission is required!';
            this.toasterType = 'error';
            setTimeout(() => {
                this.toaster.isOpen = false;
            }, 5000);
            return;
        }

        this.roleEdit.updatedAt = new Date().toISOString();

        this.roleApiService.updateRole(this.roleEdit).subscribe((response) => {
                this.toaster.isOpen = true;
                this.toasterMessage = 'Role has been updated successfully!';
                this.toasterType = 'success';
                setTimeout(() => {
                    this.toaster.isOpen = false;
                }, 5000);
                this.getAllRoles();
                this.closeRoleModal();
            },
            (error) => {
                this.toaster.isOpen = true;
                this.toasterMessage = 'Something went wrong!';
                this.toasterType = 'error';
                setTimeout(() => {
                    this.toaster.isOpen = false;
                }, 5000);
            }
        );
    }

    performDeleteRole() {
        this.roleApiService.deleteRole(this.roleEdit.id).subscribe((response) => {
                this.toaster.isOpen = true;
                this.toasterMessage = 'Role has been deleted successfully!';
                this.toasterType = 'success';
                setTimeout(() => {
                    this.toaster.isOpen = false;
                }, 5000);
                this.getAllRoles();
                this.closeRoleModal();
            },
            (error) => {
                this.toaster.isOpen = true;
                this.toasterMessage = error;
                this.toasterType = 'error';
                setTimeout(() => {
                    this.toaster.isOpen = false;
                }, 5000);
            }
        );
    }

    sanitizeUserInput() {
        this.sanitizedDescription = this.sanitizer.bypassSecurityTrustHtml(this.userDescription);
    }

    toggleRoleStatus() {
        this.roleEdit.status = !this.roleEdit.status;
    }

    toggleAddPermissionToRole(permissionId: string) {
        if (this.roleEdit.permissionsId.includes(permissionId)) {
            this.roleEdit.permissionsId = this.roleEdit.permissionsId.filter((id: string) => id !== permissionId);
        } else {
            this.roleEdit.permissionsId.push(permissionId);
        }
    }

    toggleAddRoleModal() {
        this.isAddingRole$ = true;
        this.isEditingRole$ = false;
        this.isViewingRole$ = false;
        this.isDeletingRole$ = false;
        
        this.resetRoleEdit();

        if (this.modal) {
            this.modal.isOpen = !this.modal.isOpen;
        }
    }

    toggleEditRoleModal(role: StoreRoleModel) {
        this.isAddingRole$ = false;
        this.isEditingRole$ = true;
        this.isViewingRole$ = false;
        this.isDeletingRole$ = false;
        this.availablePermissions$ = this.getAllPermissionsIdsByRole(role.id);

        this.resetRoleEdit();
        
        this.roleEdit =  {...role }
        
        if (this.modal) {
            this.modal.isOpen = !this.modal.isOpen;
        }
    }

    toggleViewRoleModal(role: StoreRoleModel) {
        this.isAddingRole$ = false;
        this.isEditingRole$ = false;
        this.isViewingRole$ = true;
        this.isDeletingRole$ = false;
        this.availablePermissions$ = this.getAllPermissionsIdsByRole(role.id);

        this.resetRoleEdit();
        
        this.roleEdit =  {...role }
        
        if (this.modal) {
            this.modal.isOpen = !this.modal.isOpen;
        }
    }

    toggleDeleteRoleModal(role: StoreRoleModel) {
        this.isDeletingRole$ = true;
        this.roleEdit =  {...role }
        console.log(this.roleEdit);
        
        if (this.modal) {
            this.modal.isOpen = !this.modal.isOpen;
        }
    }

    closeRoleModal() {
        this.isAddingRole$ = false;
        this.isEditingRole$ = false;
        this.isViewingRole$ = false;
        this.isDeletingRole$ = false;
        this.resetRoleEdit();
        
        if (this.modal) {
            this.modal.isOpen = false;
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

    closeToaster() {
        this.toaster.isOpen = false;
    }

    getAllPermissions() {
        this.roleApiService.getAllPermissions().subscribe((permissions: StorePermissionsModel[]) => {
            this.allPermissions$ = permissions;
        });
    }

    getAllPermissionsIdsByRole(roleId: string): StorePermissionsModel[] {
        // get all permissionIds from role
        const permissionIds = this.roles$.find((role: StoreRoleModel) => role.id === roleId)?.permissionsId;

        // get all permissions from allPermissions$ by permissionIds
        return this.allPermissions$.filter((permission: StorePermissionsModel) => {
            return permissionIds?.includes(permission.id);
        });
    }

    isPermissionChecked(permissionId: string): boolean {
        return this.roleEdit.permissionsId.includes(permissionId);
    }

    async getAllRoles() {
        (await this.roleApiService.getAllRoles()).subscribe((roles: StoreRoleModel[]) => {
            this.roles$ = roles;
            this.filterRoleBySearchTerm();
        });
    }

    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
