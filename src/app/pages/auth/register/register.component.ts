import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
    constructor(
        private router: Router,
    ) { }

    register() {
        this.router.navigate(['dashboard']);
    }

    forgotPassword() {
        this.router.navigate(['auth/forgot-password']);
    }

    login() {
        this.router.navigate(['auth/login']);
    }
}
