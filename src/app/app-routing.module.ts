import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { VendorsComponent } from './pages/vendors/vendors.component';
import { UsersComponent } from './pages/users/users.component';
import { ProductsComponent } from './pages/products/products.component';
import { StoresComponent } from './pages/stores/stores.component';
import { NotFoundComponent } from './errors/not-found/not-found.component';
import { SomethingWentWrongComponent } from './errors/something-went-wrong/something-went-wrong.component';
import { AccessUnavailableComponent } from './errors/access-unavailable/access-unavailable.component';
import { ViewStoreComponent } from './pages/stores/view-store/view-store.component';
import { StorePlansComponent } from './pages/stores/store-plans/store-plans.component';
import { ViewVendorComponent } from './pages/vendors/view-vendor/view-vendor.component';
import { VendorOrdersComponent } from './pages/vendors/vendor-orders/vendor-orders.component';
import { VendorCustomersComponent } from './pages/vendors/vendor-customers/vendor-customers.component';
import { VendorChatComponent } from './pages/vendors/vendor-chat/vendor-chat.component';
import { VendorDealsComponent } from './pages/vendors/vendor-deals/vendor-deals.component';
import { VendorMarketingComponent } from './pages/vendors/vendor-marketing/vendor-marketing.component';
import { VendorAnalyticsComponent } from './pages/vendors/vendor-analytics/vendor-analytics.component';
import { VendorRevenueComponent } from './pages/vendors/vendor-revenue/vendor-revenue.component';
import { VendorStatusComponent } from './pages/vendors/vendor-status/vendor-status.component';
import { VendorSettingsComponent } from './pages/vendors/vendor-settings/vendor-settings.component';
import { ViewProductComponent } from './pages/products/view-product/view-product.component';
import { ProductCategoriesComponent } from './pages/products/product-categories/product-categories.component';
import { ProductTagsComponent } from './pages/products/product-tags/product-tags.component';
import { ProductBrandsComponent } from './pages/products/product-brands/product-brands.component';
import { ProductAttributesComponent } from './pages/products/product-attributes/product-attributes.component';
import { ProductReviewsComponent } from './pages/products/product-reviews/product-reviews.component';
import { ViewUserComponent } from './pages/users/view-user/view-user.component';
import { UserRolesComponent } from './pages/users/user-roles/user-roles.component';
import { UserProfileComponent } from './pages/users/user-profile/user-profile.component';
import { UserSettingsComponent } from './pages/users/user-settings/user-settings.component';
import { StoreRolesComponent } from './pages/stores/store-roles/store-roles.component';

const routes: Routes = [
    {
        path: '',
        redirectTo: '/dashboard',
        pathMatch: 'full'
    },
    {
        path: 'dashboard',
        component: HomeComponent,
    },
    {
        path: 'store',
        component: StoresComponent
    },
    {
        path: 'store/view/:id',
        component: ViewStoreComponent
    },
    {
        path: 'store/plans',
        component: StorePlansComponent
    },
    {
        path: 'store/roles',
        component: StoreRolesComponent
    },
    {
        path: 'vendors',
        component: VendorsComponent
    },
    {
        path: 'vendors/view/:id',
        component: ViewVendorComponent
    },
    {
        path: 'vendors/orders',
        component: VendorOrdersComponent
    },
    {
        path: 'vendors/customers',
        component: VendorCustomersComponent
    },
    {
        path: 'vendors/chat',
        component: VendorChatComponent
    },
    {
        path: 'vendors/deals',
        component: VendorDealsComponent
    },
    {
        path: 'vendors/marketing',
        component: VendorMarketingComponent
    },
    {
        path: 'vendors/analytics',
        component: VendorAnalyticsComponent
    },
    {
        path: 'vendors/revenue',
        component: VendorRevenueComponent
    },
    {
        path: 'vendors/status',
        component: VendorStatusComponent
    },
    {
        path: 'vendors/settings',
        component: VendorSettingsComponent
    },
    {
        path: 'users',
        component: UsersComponent
    },
    {
        path: 'users/view/:id',
        component: ViewUserComponent
    },
    {
        path: 'users/roles',
        component: UserRolesComponent
    },
    {
        path: 'users/status',
        component: UserRolesComponent
    },
    {
        path: 'users/profile',
        component: UserProfileComponent
    },
    {
        path: 'users/settings',
        component: UserSettingsComponent
    },
    {
        path: 'products',
        component: ProductsComponent
    },
    {
        path: 'products/view/:id',
        component: ViewProductComponent
    },
    {
        path: 'products/categories',
        component: ProductCategoriesComponent
    },
    {
        path: 'products/tags',
        component: ProductTagsComponent
    },
    {
        path: 'products/brands',
        component: ProductBrandsComponent
    },
    {
        path: 'products/attributes',
        component: ProductAttributesComponent
    },
    {
        path: 'products/reviews',
        component: ProductReviewsComponent
    },
    {
        path: 'dashboard/not-found',
        component: NotFoundComponent
    },
    {
        path: 'dashboard/something-went-wrong',
        component: SomethingWentWrongComponent
    },
    {
        path: 'dashboard/forbidden',
        component: AccessUnavailableComponent
    },
    {
        path: '**',
        redirectTo: 'dashboard/not-found'
    }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
