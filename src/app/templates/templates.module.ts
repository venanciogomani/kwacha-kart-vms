import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard/dashboard.component';
import { OnboardingComponent } from './onboarding/onboarding.component';
import { AppRoutingModule } from '../app-routing.module';
import { PagesModule } from '../pages/pages.module';
import { SharedModule } from "../shared/shared.module";



@NgModule({
    declarations: [
        DashboardComponent,
        OnboardingComponent
    ],
    exports: [
        DashboardComponent,
        OnboardingComponent
    ],
    imports: [
        CommonModule,
        AppRoutingModule,
        PagesModule,
        SharedModule
    ]
})
export class TemplatesModule { }
