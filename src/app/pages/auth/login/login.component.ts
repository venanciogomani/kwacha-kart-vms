import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthApiService } from 'src/services/api/auth.api.service';

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
        private authApiService: AuthApiService
    ) { }

    async performLogin() {
        (await this.authApiService.login(this.user.email, this.user.password)).subscribe(
            (data) => {
                console.log(data); // we get back a token
                this.login();
            },
            (error) => {
                console.log(error);
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
}
