import { Component, ViewChild } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subject, filter, switchMap, takeUntil } from 'rxjs';
import { ToasterComponent } from 'src/app/shared/toaster/toaster.component';
import { AuthApiService } from 'src/services/api/auth.api.service';
import { RoleApiService } from 'src/services/api/role.api.service';
import { formatDateString } from 'src/services/helpers';
import { StoreRoleModel, UserModel } from 'src/state';
import { selectAuth } from 'src/state/selectors/auth.selectors';
import { selectRoles } from 'src/state/selectors/roles.selectors';
import { selectUsers } from 'src/state/selectors/user.selectors';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent {
    @ViewChild(ToasterComponent) toaster!: ToasterComponent;

    userDescription: string = '<script>alert("XSS Attack")</script>';
    sanitizedDescription!: SafeHtml;

    toasterMessage = 'Something went wrong!';
    toasterType = 'error';

    users$: UserModel[] = [];
    fileterdUsers$: UserModel[] = [];
    isUsersLoading$ = false;

    myUser$!: UserModel;
    allRoles$: StoreRoleModel[] = [];

    editUsers$: UserModel = {
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
        roleId: '',
        createdAt: ''
    };

    editRow: { [key: string]: boolean } = {};

    addRow = false;
    isEditing$ = false;

    searchTerm = '';

    pageSize = 10;
    currentPage = 1;
    totalPage = 1;
    totalPages = 0;
    totalUsers = 0;
    startIndex = 0;
    endIndex = 0;

    sortDirection = 'asc';

    private destroy$: Subject<void> = new Subject<void>();

    constructor(
        private authApiService: AuthApiService,
        private roleApiService: RoleApiService,
        private store: Store,
        private router: Router,
        private sanitizer: DomSanitizer
    ) {
        this.store.select(selectAuth).subscribe(( myUser: any ) => {
            if (myUser && Object.keys(myUser).length > 0) {
                this.myUser$ = myUser.user;
            }
        });

        this.store.select(selectUsers).subscribe(( users: UserModel[] ) => {
            this.users$ = this.myUser$ && this.myUser$.id !== '' ? 
                users.filter((user: UserModel) => user.id !== this.myUser$.id)
                : users;
            this.filterUsersBySearchTerm();
        });

        this.store.select(selectRoles).subscribe(( roles: StoreRoleModel[] ) => {
            this.allRoles$ = roles;
        });
    }

    ngOnInit(): void {
        if (this.users$.length === 0) {
            this.getAllUsers();
        }

        if (this.allRoles$.length === 0) {
            this.getAllRoles();
        }
    }

    isEditRow(id: string): boolean {
        return this.editRow[id];
    }

    toggleEditUsers(user: UserModel): void {
        this.isEditing$ = !this.isEditing$;
        this.editRow[user.id] = !this.editRow[user.id];
        this.addRow = false;

        if (this.isEditing$) {
            this.editUsers$ = { ...user };
        }
    }

    getUserById(id: string) {
        return this.users$.find(user => user.id === id);
    }

    getAllUsers() {
        // remove my user from the list if it exists in state
        let usersResponse: UserModel[] = [];
        this.authApiService.getAllUsers().subscribe((allUsers: UserModel[]) => {
            usersResponse = allUsers;
            this.users$ = this.myUser$ && Object.keys(this.myUser$).length > 0 ?
                 usersResponse.filter((user: UserModel) => user.id !== this.myUser$.id)
                    : usersResponse;
            
            this.filterUsersBySearchTerm();
            this.users$ = usersResponse;
        });
    }

    async getAllRoles() {
        (await this.roleApiService.getAllRoles()).subscribe((roles: StoreRoleModel[]) => {
            this.allRoles$ = roles;
        });
    }

    getRoleById(id: string) {
        return this.allRoles$.find(role => role.id === id);
    }

    filterUsersBySearchTerm() {
        this.startIndex = (this.currentPage - 1) * this.pageSize;
        this.endIndex = (this.startIndex + this.pageSize) > this.users$.length ? this.users$.length : (this.startIndex + this.pageSize);

        if (!this.searchTerm) {
            this.fileterdUsers$ = this.users$.slice(this.startIndex, this.endIndex);
        } else {
            this.fileterdUsers$ = this.users$.filter(users => {
                return users.id.toLowerCase().includes(this.searchTerm.toLowerCase());
            }).slice(this.startIndex, this.endIndex);
        }
        
        this.calculateTotalPages();
    }

    goToPrevPage() {
        if (this.currentPage > 1) {
            this.currentPage--;
            this.filterUsersBySearchTerm();
        }
    }

    goToNextPage() {
        if (this.currentPage < this.totalPages) {
            this.currentPage++;
            this.filterUsersBySearchTerm();
        }
    }

    goToFirstPage() {
        this.currentPage = 1;
        this.filterUsersBySearchTerm();
    }

    goToLastPage() {
        this.currentPage = this.totalPages;
        this.filterUsersBySearchTerm();
    }

    setPage(pageNumber: number) {
        this.currentPage = pageNumber;
        this.filterUsersBySearchTerm();
    }

    calculateTotalPages() {
        this.totalPages = Math.ceil(this.users$.length / this.pageSize);
    }

    sortBy(key: string) {
        this.fileterdUsers$.sort((a: any, b: any) => {
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

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    resetEditUser() {
        this.editUsers$ = {
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
            roleId: '',
            createdAt: ''
        };
    }

    toggleAddUser(): void {
        if (this.isEditing$) {
            this.toggleEditUsers(this.editUsers$);
        }
        this.resetEditUser();
        this.addRow = !this.addRow;
        this.isEditing$ = false;
    }

    sanitizeUserInput() {
        this.sanitizedDescription = this.sanitizer.bypassSecurityTrustHtml(this.userDescription);
    }

    closeToaster() {
        this.toaster.isOpen = false;
    }

    formatDate(dateString: string) {
        return formatDateString(dateString);
    }

    publishUser() {
        console.log(this.editUsers$);
        // check if all required fields are filled
        if (
            this.editUsers$.name === '' 
            || this.editUsers$.address === ''
            || this.editUsers$.city === '' 
            || this.editUsers$.province === '' 
            || this.editUsers$.roleId === '' 
            || this.editUsers$.phone === ''
            || this.editUsers$.email === ''
        ) {
            this.toasterMessage = 'Please fill all the required fields!';
            this.toasterType = 'error';
            this.toaster.isOpen = true;
            setTimeout(() => {
                this.closeToaster();
            }, 3000);
            return;
        }

        // check if email is valid
        if (!this.editUsers$.email.includes('@')) {
            this.toasterMessage = 'Please enter a valid email address!';
            this.toasterType = 'error';
            this.toaster.isOpen = true;
            setTimeout(() => {
                this.closeToaster();
            }, 3000);
            return;
        }

        // check if phone number is valid
        if (this.editUsers$.phone.length !== 10) {
            this.toasterMessage = 'Please enter a valid phone number!';
            this.toasterType = 'error';
            this.toaster.isOpen = true;
            setTimeout(() => {
                this.closeToaster();
            }, 3000);
            return;
        }

        // check if email already exists
        const userWithEmail = this.users$.find(user => user.email === this.editUsers$.email);
        if (userWithEmail) {
            this.toasterMessage = 'Email already exists!';
            this.toasterType = 'error';
            this.toaster.isOpen = true;
            setTimeout(() => {
                this.closeToaster();
            }, 3000);
            return;
        }

        // check if phone number already exists
        const userWithPhone = this.users$.find(user => user.phone === this.editUsers$.phone);
        if (userWithPhone) {
            this.toasterMessage = 'Phone number already exists!';
            this.toasterType = 'error';
            this.toaster.isOpen = true;
            setTimeout(() => {
                this.closeToaster();
            }, 3000);
            return;
        }

        const modifiedUserName = this.editUsers$.name.trim().toLowerCase().replace(/\s+/g, '_');
        const timestamp = new Date().getTime();
        this.editUsers$.id = `${modifiedUserName}_${Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)}_${timestamp}`;

        this.editUsers$.createdAt = new Date().toISOString();
        this.editUsers$.country = 'Zambia';

        this.authApiService.saveUser(this.editUsers$).subscribe((user: UserModel) => {
            this.resetEditUser();
            this.toasterMessage = 'User added successfully!';
            this.toasterType = 'success';
            this.toaster.isOpen = true;
            setTimeout(() => {
                this.closeToaster();
            }, 3000);
            this.getAllUsers();
            this.toggleAddUser();
        }, () => {
            this.toasterMessage = 'Something went wrong!';
            this.toasterType = 'error';
            this.toaster.isOpen = true;
            setTimeout(() => {
                this.closeToaster();
            }, 3000);
        });
    }

    toggleUserStatus() {
        this.editUsers$.status = !this.editUsers$.status;
    }

    toggleUserVerified() {
        this.editUsers$.isVerified = !this.editUsers$.isVerified;
    }
}
