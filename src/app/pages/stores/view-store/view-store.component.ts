import { Component, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { StoreApiService } from 'src/services/api/store.api.service';
import { PaymentMethodModel, StorePaymentDetailsModel, StoresModel, VendorModel } from 'src/state';
import { capitalizeFirstLetter, maskString } from 'src/services/helpers';
import { ModalComponent } from 'src/app/shared/modal/modal.component';
import { VendorApiService } from 'src/services/api/vendor.api.service';
import { ProductApiService } from 'src/services/api/products.api.service';
import { AuthApiService, UserRole } from 'src/services/api/auth.api.service';
import { PaymentApiService } from 'src/services/api/payment.api.service';

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
    paymentMethods$: PaymentMethodModel[] = [] as PaymentMethodModel[];

    constructor(
        private router: ActivatedRoute,
        private vendorApiService: VendorApiService,
        private productApiService: ProductApiService,
        private storeApiService: StoreApiService,
        private paymentApiService: PaymentApiService,
        private authApiService: AuthApiService
    ) { 
        this.authApiService.resetInactivityTimer(); // reset inactivity timer
    }

    ngOnInit() {
        if (this.paymentMethods$.length === 0) {
            this.getAllPaymentMethods();
        }

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

    sanitizeAccountNumber(account: StorePaymentDetailsModel | undefined) {
        if (account) {
            return maskString(account.accountNumber);
        }

        return '';
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
            if (paymentDetails?.length > 0) {
                this.paymentDetails$ = paymentDetails;
            }
            this.isLoading$ = false;
        });
    }

    get getStorePrimaryPaymentDetails() {
        return this.paymentDetails$?.find(paymentDetail => paymentDetail.isPrimary);
    }

    getPaymentMethodById(id: string | undefined) {
        return this.paymentDetails$?.find(paymentDetail => paymentDetail.paymentMethodId === id) || {} as StorePaymentDetailsModel;
    }

    getPaymentMethodNameById(id: string) {
        return this.paymentMethods$.find(paymentMethod => paymentMethod.id === id)?.name || '';
    }

    getPaymentMethodLogoById(id: string) {
        return this.paymentMethods$.find(paymentMethod => paymentMethod.id === id)?.logo || '';
    }

    async getAllPaymentMethods() {
        return (await this.paymentApiService.getAllPaymentMethods()).subscribe((paymentMethods: PaymentMethodModel[]) => {
            if (paymentMethods?.length > 0) {
                this.paymentMethods$ = paymentMethods;
            }
        });
    }

    get getAllPaymentMethodTypes() {
        return [] as PaymentMethodModel[];
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

    hasRole(role: keyof UserRole): boolean {
        return this.authApiService.hasRole(role);
    }
}
