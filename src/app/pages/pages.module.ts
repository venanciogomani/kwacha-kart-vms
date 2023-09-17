import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home/home.component';
import { ProductsComponent } from './products/products.component';
import { UsersComponent } from './users/users.component';
import { CategoriesComponent } from './categories/categories.component';



@NgModule({
    declarations: [
        HomeComponent,
        ProductsComponent,
        UsersComponent,
        CategoriesComponent
    ],
    imports: [
        CommonModule
    ],
    exports: [
        HomeComponent,
        ProductsComponent,
        UsersComponent,
        CategoriesComponent
    ]
})
export class PagesModule { }
