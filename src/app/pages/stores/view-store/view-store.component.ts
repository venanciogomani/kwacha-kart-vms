import { Component, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { StoreApiService } from 'src/services/api/store.api.service';
import { PaymentAccountTypeModel, PaymentMethodModel, StorePaymentDetailsModel, StoresModel, UserModel, VendorDeductionModel, VendorModel } from 'src/state';
import { capitalizeFirstLetter, maskString } from 'src/services/helpers';
import { ModalComponent } from 'src/app/shared/modal/modal.component';
import { VendorApiService } from 'src/services/api/vendor.api.service';
import { ProductApiService } from 'src/services/api/products.api.service';
import { AuthApiService, UserRole } from 'src/services/api/auth.api.service';
import { PaymentApiService } from 'src/services/api/payment.api.service';
import { ToasterComponent } from 'src/app/shared/toaster/toaster.component';
import { convertToPrice } from 'src/services/helpers';

@Component({
  selector: 'app-view-store',
  templateUrl: './view-store.component.html',
  styleUrls: ['./view-store.component.scss']
})
export class ViewStoreComponent {
    @ViewChild(ModalComponent) modal!: ModalComponent;
    @ViewChild(ToasterComponent) toaster!: ToasterComponent;

    toasterMessage = 'Something went wrong!';
    toasterType = 'error';

    isLoading$ = true;
    
    showEdit = false;
    isEditing = false;
    singleStoreId$ = this.router.snapshot.paramMap.get('id') || '';
    singleStore$: StoresModel = {} as StoresModel;
    transactionType: string = 'all';
    transactionTitle: string = 'Transactions History';
    hideAccountNumber: boolean = true;
    isShowAccountNumber: string[] = [];
    currentUser: UserModel = {} as UserModel;
    currentVendor: VendorModel = {} as VendorModel;

    mainBalance: number = 673412.50;

    isWidthdrawModal: boolean = false;

    vendors$: VendorModel[] = [];

    paymentDetails$: StorePaymentDetailsModel[] = [] as StorePaymentDetailsModel[];
    editPaymentDetails$: StorePaymentDetailsModel = {} as StorePaymentDetailsModel;
    editWithdraw$: VendorDeductionModel = {} as VendorDeductionModel;

    paymentMethods$: PaymentMethodModel[] = [] as PaymentMethodModel[];

    paymentAccountTypes$: PaymentAccountTypeModel[] = [] as PaymentAccountTypeModel[];

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

        if (this.paymentAccountTypes$.length === 0) {
            this.getAllPaymentAccountTypes();
        }

        if (this.singleStoreId$) {
            this.isLoading$ = true;
            this.getStore();
        }

        if (this.vendors$.length === 0) {
            this.getAllVendors();
        }

        if (!this.currentUser.id) {
            this.isLoading$ = true;
            this.getMyCurrentUser();
        }

        convertToPrice(this.mainBalance);
    }

    async getStore() {
        (await this.storeApiService.getStoreById(this.singleStoreId$)).subscribe((store: StoresModel) => {
            this.singleStore$ = store;

            if (!this.currentVendor.id) {
                this.getMyCurrentVendor(store.vendorId);
            }

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

    toggleEditDropdown() {
        this.showEdit = !this.showEdit;
    }

    toggleEditMode() {
        if (!this.checkPrivileges()) {
            this.toasterMessage = "You do not have permission to perform this action.";
            this.toasterType = 'error';
            this.toaster.isOpen = true;
            setTimeout(() => {
                this.closeToaster();
            }, 3000);
            return;
        }

        this.isEditing =!this.isEditing;
        this.toggleEditDropdown();
    }

    setTransactionType(type: string): void {
        this.transactionType = type;
        this.transactionTitle = type === 'all' 
            ? 'Transactions History' 
            : capitalizeFirstLetter(type) + ' Transactions';
    }

    sanitizeAccountNumber(account: StorePaymentDetailsModel | undefined) {
        if (account) {
            const accountNumberToString = account.accountNumber.toString();
            return maskString(accountNumberToString);
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

    getPaymentAccountTypeById(id?: string): string {
        if (!id) return 'Account';

        return this.paymentAccountTypes$.find(paymentAccountType => paymentAccountType.id === id)?.name || 'Account';
    }

    getPaymentMethodById(id: string | undefined) {
        if (!id) return 'Account Type';

        const paymentAccountType = this.paymentAccountTypes$.find(accountType => accountType.id === id)?.name;

        return paymentAccountType || 'Unknown';
    }

    getPaymentMethodNameById(id: string) {
        return this.paymentMethods$.find(paymentMethod => paymentMethod.id === id)?.name || '';
    }

    getPaymentMethodLogoById(id: string) {
        return this.paymentMethods$.find(paymentMethod => paymentMethod.id === id)?.logo || '';
    }

    async getAllPaymentMethods() {
        return this.paymentApiService.getAllPaymentMethods().subscribe((paymentMethods: PaymentMethodModel[]) => {
            if (paymentMethods?.length > 0) {
                this.paymentMethods$ = paymentMethods;
            }
        });
    }

    async getAllPaymentAccountTypes() {
        return this.paymentApiService.getAllPaymentMethodTypes().subscribe((paymentAccountTypes: PaymentAccountTypeModel[]) => {
            if (paymentAccountTypes?.length > 0) {
                this.paymentAccountTypes$ = paymentAccountTypes;
            }
        });
    }

    toggleAddPaymentModal() {
        if (!this.checkPrivileges()) {
            this.toasterMessage = "You do not have permission to perform this action.";
            this.toasterType = 'error';
            this.toaster.isOpen = true;
            setTimeout(() => {
                this.closeToaster();
            }, 3000);
            return;
        }
        
        this.isWidthdrawModal = false;
        if (this.modal) {
            this.resetPaymentDetails();
            this.modal.isOpen = !this.modal.isOpen;
        }
    }

    AddPaymentDetails() {
        if (
            this.editPaymentDetails$.paymentMethodId === ''
            || this.editPaymentDetails$.accountNumber === ''
            || this.editPaymentDetails$.accountName === ''
        ) {
            this.toasterMessage = "Please fill all required fields.";
            this.toasterType = 'error';
            this.toaster.isOpen = true;
            setTimeout(() => {
                this.closeToaster();
            }, 3000);
            return;
        }

        this.editPaymentDetails$.storeId = this.singleStore$.id;
        this.editPaymentDetails$.accountType = this.paymentMethods$.find(method => method.id === this.editPaymentDetails$.paymentMethodId)?.name || '';
        this.editPaymentDetails$.accountTypeId = this.paymentMethods$.find(method => method.id === this.editPaymentDetails$.paymentMethodId)?.accountTypeId || '';

        this.storeApiService.addPaymentDetails(this.editPaymentDetails$).subscribe(() => {
            this.modal.isOpen = false;
            this.getStorePaymentDetails();
            this.resetPaymentDetails();
            this.toasterMessage = "Payment details added successfully.";
            this.toasterType ='success';
            this.toaster.isOpen = true;
            setTimeout(() => {
                this.closeToaster();
            }, 3000);
        }, (error: any) => {
            this.toasterMessage = error.error.message;
            this.toasterType = 'error';
            this.toaster.isOpen = true;
            setTimeout(() => {
                this.closeToaster();
            }, 3000);
        });
    }

    resetPaymentDetails() {
        this.editPaymentDetails$ = {} as StorePaymentDetailsModel;
    }

    toggleWithdrawPaymentModal() {
        if (!this.checkPrivileges()) {
            this.toasterMessage = "You do not have permission to perform this action.";
            this.toasterType = 'error';
            this.toaster.isOpen = true;
            setTimeout(() => {
                this.closeToaster();
            }, 3000);
            return;
        }

        this.isWidthdrawModal = true;
        if (this.modal) {
            this.resetWithdraw();
            this.modal.isOpen = !this.modal.isOpen;
        }
    }

    resetWithdraw() {
        this.editWithdraw$ = {} as VendorDeductionModel;
    }

    performWithdraw() {}

    get getAllProductsByVendorIdOfStoreId() {
        const products = this.productApiService.getProductsByVendorId(this.singleStore$.vendorId);
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

    async getMyCurrentUser() {
        (await (this.authApiService.getCurrentUser())).subscribe(async (user: UserModel) => {
            this.currentUser = user;
            this.isLoading$ = false;
        });
    }

    async getMyCurrentVendor(vendorId: string) {
        (await (this.vendorApiService.getVendorById(vendorId))).subscribe(async (vendor: VendorModel) => {
            this.currentVendor = vendor;
            this.isLoading$ = false;
        })
    }

    editStore() {}

    checkPrivileges(): Boolean {
        const rolePrivilege = this.hasRole('ROLE_SUPER_ADMIN') || this.hasRole('ROLE_ADMIN');
        const ownerPrivilege = this.currentVendor?.id === this.singleStore$.vendorId;
        return rolePrivilege && ownerPrivilege;
    }

    closeToaster() {
        this.toaster.isOpen = false;
    }
}
