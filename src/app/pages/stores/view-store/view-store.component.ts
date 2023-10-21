import { Component, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { StoreApiService } from 'src/services/api/store.api.service';
import { StorePaymentDetailsModel, StoresModel, VendorModel } from 'src/state';
import { capitalizeFirstLetter, maskString } from 'src/services/helpers';
import { ModalComponent } from 'src/app/shared/modal/modal.component';
import { VendorApiService } from 'src/services/api/vendor.api.service';
import { ProductApiService } from 'src/services/api/products.api.service';
import { AuthApiService } from 'src/services/api/auth.api.service';

@Component({
  selector: 'app-view-store',
  templateUrl: './view-store.component.html',
  styleUrls: ['./view-store.component.scss']
})
export class ViewStoreComponent {
    @ViewChild(ModalComponent) modal!: ModalComponent;

    isLoading$ = true;
    
    showEdit = false;
    singleStoreId$ = this.router.snapshot.paramMap.get('id') || '';
    singleStore$: StoresModel = {} as StoresModel;
    transactionType: string = 'all';
    transactionTitle: string = 'Transactions History';
    hideAccountNumber: boolean = true;
    isShowAccountNumber: string[] = [];

    isWidthdrawModal: boolean = false;

    vendors$: VendorModel[] = [];

    paymentDetails$: StorePaymentDetailsModel[] = [] as StorePaymentDetailsModel[];

    constructor(
        private router: ActivatedRoute,
        private vendorApiService: VendorApiService,
        private productApiService: ProductApiService,
        private storeApiService: StoreApiService,
        private authApiService: AuthApiService
    ) { 
        this.authApiService.resetInactivityTimer(); // reset inactivity timer
    }

    ngOnInit() {
        if (this.singleStoreId$) {
            this.getStore();
        }

        if (this.vendors$.length === 0) {
            this.getAllVendors();
        }
    }

    async getStore() {
        (await this.storeApiService.getStoreById(this.singleStoreId$)).subscribe((store: StoresModel) => {
            this.singleStore$ = store;

            if (this.paymentDetails$.length === 0) {
                this.getStorePaymentDetails();
            }
            
            this.isLoading$ = false;
        });
    }
    
    async getAllVendors() {
        (await this.vendorApiService.getAllVendors()).subscribe((vendors: VendorModel[]) => {
            this.vendors$ = vendors;
        });
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

    async getStorePaymentDetails() {
        return (await this.storeApiService.getStorePaymentDetailsByStoreId(this.singleStore$.id)).subscribe((paymentDetails: StorePaymentDetailsModel[]) => {
            console.log(this.singleStore$.id);
            if (paymentDetails?.length > 0) {
                this.paymentDetails$ = paymentDetails;
            }
            this.isLoading$ = false;
        });
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
        const vendorIds = this.vendors$.map(vendor => vendor.id);
        const products = vendorIds.map(vendorId => this.productApiService.getProductsByVendorId(vendorId));
        return products.flat();
    }

    get calculateProductQuantities() {
        const products = this.getAllProductsByVendorIdOfStoreId;
        const quantities = products.map(product => product.quantity);
        return quantities.reduce((a, b) => a + b, 0);
    }
}
