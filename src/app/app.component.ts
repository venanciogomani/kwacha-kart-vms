import { Component } from '@angular/core';
import { PlanApiService } from 'src/services/api/plan.api.service';
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
    ) { }

    ngOnInit() {
        this.storeApiService.createInitialStoresState();
        this.plansApiService.createInitialPlansState();
    }
}
