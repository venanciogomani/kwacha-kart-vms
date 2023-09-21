import { Component } from '@angular/core';
import { PlanApiService } from 'src/services/api/plan.api.service';
import { RoleApiService } from 'src/services/api/role.api.service';
import { StoreApiService } from 'src/services/api/store.api.service';

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
        private roleApiService: RoleApiService
    ) { }

    ngOnInit() {
        this.storeApiService.createInitialStoresState();
        this.plansApiService.createInitialPlansState();
        this.roleApiService.createInitialRolesState();
    }
}
