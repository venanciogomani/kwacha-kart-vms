import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { BrandApiService } from 'src/services/api/brand.api.service';
import { CategoryApiService } from 'src/services/api/category.api.service';
import { OrderApiService } from 'src/services/api/order.api.service';
import { PlanApiService } from 'src/services/api/plan.api.service';
import { ProductApiService } from 'src/services/api/products.api.service';
import { RoleApiService } from 'src/services/api/role.api.service';
import { StoreApiService } from 'src/services/api/store.api.service';
import { VendorApiService } from 'src/services/api/vendor.api.service';
import { UserModel } from 'src/state';
import { selectUser } from 'src/state/selectors/user.selectors';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {
    constructor(
        private storeApiService: StoreApiService,
        private plansApiService: PlanApiService,
        private roleApiService: RoleApiService,
        private vendorApiService: VendorApiService,
        private productApiService: ProductApiService,
        private categoryApiService: CategoryApiService,
        private brandApiService: BrandApiService,
        private orderApiService: OrderApiService,
        private store: Store<UserModel>,
        private router: Router
    ) { }

    ngOnInit() {
        this.storeApiService.createInitialStoresState();
        this.plansApiService.createInitialPlansState();
        this.roleApiService.createInitialRolesState();
        this.vendorApiService.createInitialVendorsState();
        this.productApiService.createInitialProductsState();
        this.brandApiService.createInitialBrandsState();
        this.categoryApiService.createInitialCategoriesState();
        this.orderApiService.createInitialOrdersState();

        this.store.select(selectUser).subscribe((user: UserModel) => {
            if (Object.keys(user).length === 0) {
                // uncomment this line to enable redirect if not logged in
                //this.router.navigate(['auth/login']);
            }
        });
    }
}
