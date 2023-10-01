import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home/home.component';
import { MatIconModule } from '@angular/material/icon';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { StoresModule } from './stores/stores.module';
import { VendorsModule } from './vendors/vendors.module';
import { ProductsModule } from './products/products.module';
import { UsersModule } from './users/users.module';
import { ToasterComponent } from '../shared/toaster/toaster.component';
import { SharedModule } from '../shared/shared.module';



@NgModule({
    declarations: [
        HomeComponent
    ],
    imports: [
        CommonModule,
        StoresModule,
        VendorsModule,
        ProductsModule,
        UsersModule,
        MatIconModule,
        MatSlideToggleModule,
        SharedModule
    ],
    exports: [
        HomeComponent
    ]
})
export class PagesModule { }
