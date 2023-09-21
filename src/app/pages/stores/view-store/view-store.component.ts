import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { StoreApiService } from 'src/services/api/store.api.service';
import { StoresModel } from 'src/state';
import { capitalizeFirstLetter } from 'src/services/helpers';

@Component({
  selector: 'app-view-store',
  templateUrl: './view-store.component.html',
  styleUrls: ['./view-store.component.scss']
})
export class ViewStoreComponent {
    showEdit = false;
    singleStore$: StoresModel;
    transactionType: string = 'all';
    transactionTitle: string = 'Transactions History';

    constructor(
        private router: ActivatedRoute,
        private storeApiService: StoreApiService,
    ) { 
        this.singleStore$ = this.storeApiService.getStoreById(this.router.snapshot.paramMap.get('id') || '')
    }

    toggleEdit() {
        this.showEdit = !this.showEdit;
    }

    setTransactionType(type: string): void {
        this.transactionType = type;
        this.transactionTitle = type === 'all' 
            ? 'Transactions History' 
            : capitalizeFirstLetter(type) + ' Transactions';
    }
}
