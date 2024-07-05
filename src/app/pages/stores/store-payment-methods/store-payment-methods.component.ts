import { Component, ViewChild } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Store } from '@ngrx/store';
import { Subject, filter, switchMap, takeUntil } from 'rxjs';
import { ModalComponent } from 'src/app/shared/modal/modal.component';
import { ToasterComponent } from 'src/app/shared/toaster/toaster.component';
import { AuthApiService } from 'src/services/api/auth.api.service';
import { PaymentApiService } from 'src/services/api/payment.api.service';
import { PaymentAccountTypeModel, PaymentMethodModel, StorePaymentDetailsModel } from 'src/state';
import { selectPaymentMethods, selectPaymentMethodsLoading } from 'src/state/selectors/payment-methods.selectors';

type SortStatus = {
  [key in 'name' | 'status']: boolean;
}

@Component({
  selector: 'app-store-payment-methods',
  templateUrl: './store-payment-methods.component.html',
  styleUrls: ['./store-payment-methods.component.scss']
})
export class StorePaymentMethodsComponent {
    @ViewChild(ModalComponent) modal!: ModalComponent;
    @ViewChild(ToasterComponent) toaster!: ToasterComponent;

    userDescription: string = '<script>alert("XSS Attack")</script>';
    sanitizedDescription!: SafeHtml;

    toasterMessage = 'Something went wrong!';
    toasterType = 'error';
    
    sortStatus: SortStatus = {
        name: false,
        status: false,
    };

    paymentMethods$: PaymentMethodModel[] = [];
    filteredPaymentMethods$: PaymentMethodModel[] = [];

    storesByPlanId: PaymentMethodModel[] = [];
    
    paymentMethodEdit: PaymentMethodModel = {
        id: '',
        name: '',
        description: '',
        fee: 0,
        logo: '',
        status: false,
        accountTypeId: '',
        createdAt: '',
        updatedAt: '',
    };

    paymentAccountTypes$: PaymentAccountTypeModel[] = [];

    isDeletingPaymentMethod = false;
    isEditingPaymentMethod = false;

    isPaymentMethodLoading$ = false;

    searchTerm: string = '';

    pageSize = 10;
    currentPage = 1;
    totalPage = 1;
    totalPages = 0;
    totalPaymentMethods = 0;
    startIndex = 0;
    endIndex = 0;

    sortDirection = 'asc';

    editRow: { [key: string]: boolean } = {};

    addRow = false;
    deleteRow = false;

    private destroy$: Subject<void> = new Subject<void>();
    
    constructor(
        private authApiService: AuthApiService,
        private store: Store<{ paymentMethods: PaymentMethodModel[]}>,
        private paymentApiService: PaymentApiService,
        private sanitizer: DomSanitizer
    ) {
        this.authApiService.resetInactivityTimer(); // reset inactivity timer
    }

    ngOnInit() {
      if (this.paymentMethods$.length === 0) {
        this.filterPaymentMethodsBySearchTerm();
        this.getPaymentMethods();
        this.getAllPaymentMethodTypes();
        this.totalPaymentMethods = this.paymentMethods$.length;
      }
    }

    getPaymentMethods() {
      return this.paymentApiService.getAllPaymentMethods().subscribe((paymentMethods: PaymentMethodModel[]): void => {
        this.paymentMethods$ = paymentMethods;
        this.filterPaymentMethodsBySearchTerm();
      });
    }

    filterPaymentMethodsBySearchTerm() {
      this.startIndex = (this.currentPage - 1) * this.pageSize;
      this.endIndex = (this.startIndex + this.pageSize) > this.paymentMethods$.length ? this.paymentMethods$.length : (this.startIndex + this.pageSize);

      if (this.searchTerm === '') {
          this.filteredPaymentMethods$ = this.paymentMethods$.slice(this.startIndex, this.endIndex);
      } else {
          this.filteredPaymentMethods$ = this.paymentMethods$.filter((paymentMethod: PaymentMethodModel) => {
              return paymentMethod.name.toLowerCase().includes(this.searchTerm.toLowerCase());
          }).slice(this.startIndex, this.endIndex);
      }

      this.calculateTotalPages();
      this.authApiService.resetInactivityTimer(); // reset inactivity timer
  }

  getAllPaymentMethodTypes() {
    return this.paymentApiService.getAllPaymentMethodTypes().subscribe((paymentMethodTypes: PaymentAccountTypeModel[]): void => {
      this.paymentAccountTypes$ = paymentMethodTypes;
    });
  }

  getAccountTypeById(id: string): PaymentAccountTypeModel {
    return this.paymentAccountTypes$.find((paymentAccountType: PaymentAccountTypeModel) => paymentAccountType.id === id) || {} as PaymentAccountTypeModel;
  }

  togglePaymentMethodStatus() {
    this.paymentMethodEdit.status = !this.paymentMethodEdit.status;
}

  calculateTotalPages() {
    this.totalPages = Math.ceil(this.paymentMethods$.length / this.pageSize);
  }

  goToPrevPage() {
    if (this.currentPage > 1) {
        this.currentPage--;
        this.filterPaymentMethodsBySearchTerm();
    }
  }

  goToNextPage() {
      if (this.currentPage < this.totalPages) {
          this.currentPage++;
          this.filterPaymentMethodsBySearchTerm();
      }
  }

  goToFirstPage() {
      this.currentPage = 1;
      this.filterPaymentMethodsBySearchTerm();
  }

  goToLastPage() {
      this.currentPage = this.totalPages;
      this.filterPaymentMethodsBySearchTerm();
  }

  setPage(pageNumber: number) {
      this.currentPage = pageNumber;
      this.filterPaymentMethodsBySearchTerm();
  }

  sortBy(key: string) {
    this.filteredPaymentMethods$.sort((a: any, b: any) => {
        if (a[key] < b[key]) {
            return this.sortDirection === 'asc' ? -1 : 1;
        }

        if (a[key] > b[key]) {
            return this.sortDirection === 'asc' ? 1 : -1;
        }

        return 0;
    });

    this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
  }

  get pagesArray(): number[] {
    return Array.from({length: this.totalPages}, (_, i) => i + 1);
  }

  sanitizeUserInput() {
    this.sanitizedDescription = this.sanitizer.bypassSecurityTrustHtml(this.userDescription);
  }

  closeToaster() {
    this.toaster.isOpen = false;
  }

  isEditRow(id: string): boolean {
    return this.editRow[id];
  }

  resetEditPaymentMethod() {
    this.paymentMethodEdit = {
      id: '',
      name: '',
      description: '',
      fee: 0,
      logo: '',
      status: false,
      accountTypeId: '',
      createdAt: '',
      updatedAt: '',
    };
  }

  toggleEditPaymentMethod(paymentMethod: PaymentMethodModel): void {
    this.resetEditPaymentMethod();
    this.addRow = false;
    this.editRow[paymentMethod.id] = !this.editRow[paymentMethod.id];
    this.paymentMethodEdit = { ...paymentMethod };
  }

  toggleAddPaymentMethod(): void {
    this.resetEditPaymentMethod();
    this.addRow = !this.addRow;
    this.deleteRow = false;
}

toggleDeletePaymentMethod(paymentMethod: PaymentMethodModel): void {
    this.resetEditPaymentMethod();
    this.paymentMethodEdit = { ...paymentMethod };
    this.deleteRow = !this.deleteRow;
    this.addRow = false;
    this.modal.isOpen = true;
}

  publishPaymentMethod() {
    if (
      this.paymentMethodEdit.name === '' 
      || this.paymentMethodEdit.accountTypeId === '' 
      || this.paymentMethodEdit.description === ''
      || this.paymentMethodEdit.fee === 0 
    ) {
        this.toasterMessage = 'Please fill all the required fields!';
        this.toasterType = 'error';
        this.toaster.isOpen = true;
        setTimeout(() => {
            this.closeToaster();
        }, 3000);
        return;
    }

    this.paymentMethodEdit.logo = "airtel.png";
    this.paymentMethodEdit.createdAt = new Date().toISOString();
    this.paymentMethodEdit.updatedAt = new Date().toISOString();

    const modifiedPaymentMethodName = this.paymentMethodEdit.name.trim().toLowerCase().replace(/\s+/g, '_');
    const timestamp = new Date().getTime();
    this.paymentMethodEdit.id = `${modifiedPaymentMethodName}_${Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)}_${timestamp}`;

    this.paymentApiService.savePaymentMethod(this.paymentMethodEdit).subscribe((paymentMethod: PaymentMethodModel) => {
        this.addRow = false;
        this.resetEditPaymentMethod();
        this.toasterMessage = 'Payment method added successfully!';
        this.toasterType = 'success';
        this.toaster.isOpen = true;
        setTimeout(() => {
            this.closeToaster();
        }, 3000);
        this.getPaymentMethods();
    }, () => {
        this.toasterMessage = 'Something went wrong!';
        this.toasterType = 'error';
        this.toaster.isOpen = true;
        setTimeout(() => {
            this.closeToaster();
        }, 3000);
    });
  }

  performDeletePaymentMethod() {}

  closePaymentMethodModal() {
    this.modal.isOpen = false;
    this.deleteRow = false;
  }
}
