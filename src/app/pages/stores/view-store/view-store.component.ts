import { Component, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { StoreApiService } from 'src/services/api/store.api.service';
import { StorePaymentDetailsModel, StoresModel } from 'src/state';
import { capitalizeFirstLetter, maskString } from 'src/services/helpers';
import { ModalComponent } from 'src/app/shared/modal/modal.component';
import { VendorApiService } from 'src/services/api/vendor.api.service';
import { ProductApiService } from 'src/services/api/products.api.service';

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

    isWidthdrawModal: boolean = false;

    constructor(
        private router: ActivatedRoute,
        private vendorApiService: VendorApiService,
        private productApiService: ProductApiService,
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
        this.isWidthdrawModal = false;
        if (this.modal) {
            this.modal.isOpen = !this.modal.isOpen;
        }
    }

    toggleWithdrawPaymentModal() {
        this.isWidthdrawModal = !this.isWidthdrawModal;
        if (this.modal) {
            this.modal.isOpen = !this.modal.isOpen;
        }
    }

    get getAllProductsByVendorIdOfStoreId() {
        const vendorIds = this.vendorApiService.getVendorsByStoreId(this.singleStore$.id).map(vendor => vendor.id);
        const products = vendorIds.map(vendorId => this.productApiService.getProductsByVendorId(vendorId));
        return products.flat();
    }

    get calculateProductQuantities() {
        const products = this.getAllProductsByVendorIdOfStoreId;
        const quantities = products.map(product => product.quantity);
        return quantities.reduce((a, b) => a + b, 0);
    }
}
