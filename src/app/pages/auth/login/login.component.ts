import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { AuthApiService } from 'src/services/api/auth.api.service';
import { UserModel } from 'src/state';
import { selectUser } from 'src/state/selectors/user.selectors';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
    user = {
        email: '',
        password: ''
    }
    
    constructor(
        private router: Router,
        private authApiService: AuthApiService,
        private store: Store<UserModel>
    ) { }

    ngOnInit(): void {
        this.store.select(selectUser).subscribe((user: UserModel) => {
            if (Object.keys(user).length !== 0) {
                this.login();
            }
        });
    }

    async performLogin() {
        (await this.authApiService.login(this.user.email, this.user.password));

        this.authApiService.isUserLoggedIn().subscribe((isUserLoggedIn: boolean) => {
            if (isUserLoggedIn) {
                this.login();
            }
        });
    }

    login() {
        this.router.navigate(['dashboard']);
    }

    forgotPassword() {
        this.router.navigate(['auth/forgot-password']);
    }

    register() {
        this.router.navigate(['auth/register']);
    }
}
