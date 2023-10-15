import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { AuthApiService } from 'src/services/api/auth.api.service';
import { RoleApiService } from 'src/services/api/role.api.service';
import { StoreRoleModel, UserModel } from 'src/state';
import { selectMyUser } from 'src/state/selectors/user.selectors';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent {
    isEditing$: boolean = false;
    isLoading$: boolean = false;

    editUser$: UserModel = {} as UserModel;
    password$: string = '';

    allRoles$: StoreRoleModel[] = [];

    constructor(
        private store: Store<{ user: UserModel }>,
        private authApiService: AuthApiService,
        private roleApiService: RoleApiService
    ) { 
        this.store.select(selectMyUser).subscribe((user: any) => {
            if (user && user.user && user.user.id) {
                this.editUser$ = user.user.id;
            }
        });

        this.authApiService.resetInactivityTimer(); // reset inactivity timer
    }

    ngOnInit(): void {
        if (!this.allRoles$ || this.allRoles$.length === 0) {
            this.getAllRoles();
        }

        if (!this.editUser$ || !this.editUser$.id) {
            this.getMyUser();
        }
    }

    async getMyUser() {
        (await this.authApiService.getCurrentUser()).subscribe(( user: any ) => {
            if (user && Object.keys(user).length > 0) {
                this.editUser$ = user.user;
                this.isLoading$ = false;
            }
        });
    }

    async getAllRoles() {
        (await this.roleApiService.getAllRoles()).subscribe((roles: StoreRoleModel[]) => {
            this.allRoles$ = roles;
        });
    }

    getRoleById(id: string) {
        return this.allRoles$.find(role => role.id === id)?.name;
    }

    toggleEdit() {
        this.isEditing$ = !this.isEditing$;
    }

    toggleStatus() {
        this.editUser$.status = !this.editUser$.status;
    }

    toggleVerified() {
        this.editUser$.isVerified = !this.editUser$.isVerified;
    }
}
