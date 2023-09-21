import { Component } from '@angular/core';
import { PlanApiService } from 'src/services/api/plan.api.service';
import { RoleApiService } from 'src/services/api/role.api.service';
import { StoreApiService } from 'src/services/api/store.api.service';
import { VendorApiService } from 'src/services/api/vendor.api.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
    title = 'kwachakartvms';
    constructor(
        private storeApiService: StoreApiService,
        private plansApiService: PlanApiService,
        private roleApiService: RoleApiService,
        private vendorApiService: VendorApiService,
    ) { }

    ngOnInit() {
        this.storeApiService.createInitialStoresState();
        this.plansApiService.createInitialPlansState();
        this.roleApiService.createInitialRolesState();
        this.vendorApiService.createInitialVendorsState();
    }
}
