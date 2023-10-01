import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { AuthApiService } from 'src/services/api/auth.api.service';
import { UserModel } from 'src/state';
import { selectAuth } from 'src/state/selectors/auth.selectors';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent {
    isEditing$: boolean = false;
    editUser$: UserModel = {} as UserModel;
    password$: string = '';

    constructor(
        private store: Store<{ user: UserModel }>,
        private authApiService: AuthApiService
    ) { 
        this.store.select(selectAuth).subscribe((user: UserModel) => {
            this.editUser$ = user;
        });

        this.authApiService.resetInactivityTimer(); // reset inactivity timer
    }

    ngOnInit(): void {
        if (this.editUser$) {
            this.editUser$ = this.editUser$;
        }
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
