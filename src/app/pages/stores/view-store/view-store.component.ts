import { Component, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { StoreApiService } from 'src/services/api/store.api.service';
import { StorePaymentDetailsModel, StoresModel } from 'src/state';
import { capitalizeFirstLetter, maskString } from 'src/services/helpers';
import { ModalComponent } from 'src/app/shared/modal/modal.component';

@Component({
  selector: 'app-view-store',
  templateUrl: './view-store.component.html',
  styleUrls: ['./view-store.component.scss']
})
export class ViewStoreComponent {
    @ViewChild(ModalComponent) modal!: ModalComponent;
    
    showEdit = false;
    singleStore$: StoresModel;
    transactionType: string = 'all';
    transactionTitle: string = 'Transactions History';
    hideAccountNumber: boolean = true;
    isShowAccountNumber: string[] = [];

    constructor(
        private router: ActivatedRoute,
        private storeApiService: StoreApiService
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

    sanitizeAccountNumber(account: StorePaymentDetailsModel) {
        return this.hideAccountNumber ? maskString(account.accountNumber) : account.accountNumber;
    }

    toggleOnHideAccountNumber(account: StorePaymentDetailsModel) {
        const isShowAccountNumber = this.isShowAccountNumber.includes(account.id);

        if (isShowAccountNumber) {
            this.isShowAccountNumber = this.isShowAccountNumber.filter(id => id !== account.id);
        } else {
            this.isShowAccountNumber.push(account.id);
        }
    }

    isShowAccountNumberToggle(account: StorePaymentDetailsModel): boolean {
        return this.isShowAccountNumber.includes(account.id);
    }

    get getStorePaymentDetails() {
        return this.storeApiService.getStorePaymentDetailsByStoreId(this.singleStore$.id);
    }

    get getStorePrimaryPaymentDetails() {
        return this.storeApiService.getStorePrimaryPaymentDetailsByStoreId(this.singleStore$.id);
    }

    getPaymentMethodById(id: string) {
        return this.storeApiService.getPaymentMethodById(id);
    }

    getPaymentMethodTypeById(id: string) {
        return this.storeApiService.getPaymentMethodTypeById(id);
    }

    get getAllPaymentMethods() {
        return this.storeApiService.getAllPaymentMethods();
    }

    get getAllPaymentMethodTypes() {
        return this.storeApiService.getAllPaymentMethodTypes();
    }

    toggleAddPaymentModal() {
        if (this.modal) {
            this.modal.isOpen = !this.modal.isOpen;
        }
    }
}
