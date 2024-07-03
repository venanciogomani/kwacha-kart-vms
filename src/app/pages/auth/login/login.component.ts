import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { AuthApiService } from 'src/services/api/auth.api.service';
import { UserModel } from 'src/state';
import { selectAuth } from 'src/state/selectors/auth.selectors';

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
    
    error: string | null = null;

    loginBtnDisabled = true;
    
    constructor(
        private router: Router,
        private authApiService: AuthApiService
    ) { }

    ngOnInit(): void {}

    async performLogin() {
        this.authApiService.login(this.user.email, this.user.password).subscribe(
            (user) => {
                this.authApiService.isUserLoggedIn().subscribe((isUserLoggedIn: boolean) => {
                    if (isUserLoggedIn) {
                        this.login();
                    }
                });
            },
            (error) => {
                this.error = error.message;
            }
        );
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

    checkLoginInputs() {
        if (this.user.email && this.user.password) {
            this.loginBtnDisabled = false;
        } else {
            this.loginBtnDisabled = true;
        }
    }
}
