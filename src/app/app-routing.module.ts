import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { VendorsComponent } from './pages/vendors/vendors.component';
import { UsersComponent } from './pages/users/users.component';
import { CategoriesComponent } from './pages/categories/categories.component';
import { ProductsComponent } from './pages/products/products.component';

const routes: Routes = [
    {
        path: '',
        component: HomeComponent,
    },
    {
        path: 'vendors',
        component: VendorsComponent
    },
    {
        path: 'users',
        component: UsersComponent
    },
    {
        path: 'categories',
        component: CategoriesComponent
    },
    {
        path: 'products',
        component: ProductsComponent
    }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
