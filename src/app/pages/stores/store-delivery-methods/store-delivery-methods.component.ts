import { Component, ViewChild } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Store } from '@ngrx/store';
import { Subject } from 'rxjs';
import { ModalComponent } from 'src/app/shared/modal/modal.component';
import { ToasterComponent } from 'src/app/shared/toaster/toaster.component';
import { AuthApiService } from 'src/services/api/auth.api.service';
import { DeliveryApiService } from 'src/services/api/delivery.api.service';
import { DeliveryMethodModel } from 'src/state';

type SortStatus = {
  [key in 'name' | 'status']: boolean;
}

@Component({
  selector: 'app-store-delivery-methods',
  templateUrl: './store-delivery-methods.component.html',
  styleUrls: ['./store-delivery-methods.component.scss']
})
export class StoreDeliveryMethodsComponent {
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

  deliveryMethods$: DeliveryMethodModel[] = [];
  filteredDeliveryMethods$: DeliveryMethodModel[] = [];
  
  deliveryMethodEdit: DeliveryMethodModel = {
    id: '',
    name: '',
    logo: '',
    deliveryTime: '',
    deliveryFee: 0
  };

  isDeletingDeliveryMethod = false;
  isEditingDeliveryMethod = false;

  isDeliveryMethodLoading$ = false;

  searchTerm: string = '';

  pageSize = 10;
  currentPage = 1;
  totalPage = 1;
  totalPages = 0;
  totalDeliveryMethods = 0;
  startIndex = 0;
  endIndex = 0;

  sortDirection = 'asc';

  editRow: { [key: string]: boolean } = {};

  addRow = false;
  deleteRow = false;

  private destroy$: Subject<void> = new Subject<void>();
  
  constructor(
      private authApiService: AuthApiService,
      private store: Store<{ deliveryMethods: DeliveryMethodModel[]}>,
      private deliveryApiService: DeliveryApiService,
      private sanitizer: DomSanitizer
  ) {
      this.authApiService.resetInactivityTimer(); // reset inactivity timer
  }

  ngOnInit() {
    if (this.deliveryMethods$.length === 0) {
      this.filterDeliveryMethodsBySearchTerm();
      this.getDeliveryMethods();
      this.totalDeliveryMethods = this.deliveryMethods$.length;
    }
  }

  getDeliveryMethods() {
    return this.deliveryApiService.getAllDeliveryMethods().subscribe((deliveryMethods: DeliveryMethodModel[]): void => {
      this.deliveryMethods$ = deliveryMethods;
      this.filterDeliveryMethodsBySearchTerm();
    });
  }

  filterDeliveryMethodsBySearchTerm() {
    this.startIndex = (this.currentPage - 1) * this.pageSize;
    this.endIndex = (this.startIndex + this.pageSize) > this.deliveryMethods$.length ? this.deliveryMethods$.length : (this.startIndex + this.pageSize);

    if (this.searchTerm === '') {
        this.filteredDeliveryMethods$ = this.deliveryMethods$.slice(this.startIndex, this.endIndex);
    } else {
        this.filteredDeliveryMethods$ = this.deliveryMethods$.filter((deliveryMethod: DeliveryMethodModel) => {
            return deliveryMethod.name.toLowerCase().includes(this.searchTerm.toLowerCase());
        }).slice(this.startIndex, this.endIndex);
    }

    this.calculateTotalPages();
    this.authApiService.resetInactivityTimer(); // reset inactivity timer
  }

  calculateTotalPages() {
    this.totalPages = Math.ceil(this.deliveryMethods$.length / this.pageSize);
  }

  goToPrevPage() {
    if (this.currentPage > 1) {
        this.currentPage--;
        this.filterDeliveryMethodsBySearchTerm();
    }
  }

  goToNextPage() {
      if (this.currentPage < this.totalPages) {
          this.currentPage++;
          this.filterDeliveryMethodsBySearchTerm();
      }
  }

  goToFirstPage() {
      this.currentPage = 1;
      this.filterDeliveryMethodsBySearchTerm();
  }

  goToLastPage() {
      this.currentPage = this.totalPages;
      this.filterDeliveryMethodsBySearchTerm();
  }

  setPage(pageNumber: number) {
      this.currentPage = pageNumber;
      this.filterDeliveryMethodsBySearchTerm();
  }

  sortBy(key: string) {
    this.filteredDeliveryMethods$.sort((a: any, b: any) => {
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

  resetEditDeliveryMethod() {
    this.deliveryMethodEdit = {
      id: '',
      name: '',
      logo: '',
      deliveryTime: '',
      deliveryFee: 0
    };
  }

  toggleEditDeliveryMethod(deliveryMethod: DeliveryMethodModel): void {
    this.resetEditDeliveryMethod();
    this.addRow = false;
    this.editRow[deliveryMethod.id] = !this.editRow[deliveryMethod.id];
    this.deliveryMethodEdit = { ...deliveryMethod };
  }

  toggleAddDeliveryMethod(): void {
    this.resetEditDeliveryMethod();
    this.addRow = !this.addRow;
    this.deleteRow = false;
  }

  toggleDeleteDeliveryMethod(deliveryMethod: DeliveryMethodModel): void {
      this.resetEditDeliveryMethod();
      this.deliveryMethodEdit = { ...deliveryMethod };
      this.deleteRow = !this.deleteRow;
      this.addRow = false;
      this.modal.isOpen = true;
  }

  publishDeliveryMethod() {
    if (
      this.deliveryMethodEdit.name === '' 
      || this.deliveryMethodEdit.deliveryTime === '' 
      || this.deliveryMethodEdit.deliveryFee === 0
    ) {
        this.toasterMessage = 'Please fill all the required fields!';
        this.toasterType = 'error';
        this.toaster.isOpen = true;
        setTimeout(() => {
            this.closeToaster();
        }, 3000);
        return;
    }

    this.deliveryMethodEdit.logo = "dhl.png";

    const modifiedDeliveryMethodName = this.deliveryMethodEdit.name.trim().toLowerCase().replace(/\s+/g, '_');
    const timestamp = new Date().getTime();
    this.deliveryMethodEdit.id = `${modifiedDeliveryMethodName}_${Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)}_${timestamp}`;

    this.deliveryApiService.saveDeliveryMethod(this.deliveryMethodEdit).subscribe((deliveryMethod: DeliveryMethodModel) => {
        this.addRow = false;
        this.resetEditDeliveryMethod();
        this.toasterMessage = 'Delivery method added successfully!';
        this.toasterType = 'success';
        this.toaster.isOpen = true;
        setTimeout(() => {
            this.closeToaster();
        }, 3000);
        this.getDeliveryMethods();
    }, () => {
        this.toasterMessage = 'Something went wrong!';
        this.toasterType = 'error';
        this.toaster.isOpen = true;
        setTimeout(() => {
            this.closeToaster();
        }, 3000);
    });
  }

  performDeleteDeliveryMethod() {
    this.deliveryApiService.deleteDeliveryMethod(this.deliveryMethodEdit.id).subscribe(() => {
      this.addRow = false;
      this.resetEditDeliveryMethod();
      this.toasterMessage = 'Delivery method deleted successfully!';
      this.toasterType = 'success';
      this.toaster.isOpen = true;
      setTimeout(() => {
          this.closeToaster();
      }, 3000);
      this.getDeliveryMethods();
      this.deleteRow = false;
      this.modal.isOpen = false;
    }, () => {
        this.toasterMessage = 'Something went wrong!';
        this.toasterType = 'error';
        this.toaster.isOpen = true;
        setTimeout(() => {
            this.closeToaster();
        }, 3000);
    });
  }

  performUpdateDeliverMethod(id: string) {
    if (
      this.deliveryMethodEdit.name === '' 
      || this.deliveryMethodEdit.deliveryTime === '' 
      || this.deliveryMethodEdit.deliveryFee === 0
    ) {
        this.toasterMessage = 'Please fill all the required fields!';
        this.toasterType = 'error';
        this.toaster.isOpen = true;
        setTimeout(() => {
            this.closeToaster();
        }, 3000);
        return;
    }

    this.deliveryMethodEdit.logo = "dhl.png";

    this.deliveryMethodEdit.id = id;

    this.deliveryApiService.updateDeliveryMethod(this.deliveryMethodEdit).subscribe((deliveryMethod: DeliveryMethodModel) => {
        this.toggleEditDeliveryMethod(this.deliveryMethodEdit);
        this.resetEditDeliveryMethod();
        this.addRow = false;
        this.toasterMessage = `${deliveryMethod.name} Delivery method updated successfully!`;
        this.toasterType = 'success';
        this.toaster.isOpen = true;
        setTimeout(() => {
            this.closeToaster();
        }, 3000);
        this.getDeliveryMethods();
    }, () => {
        this.toasterMessage = 'Something went wrong!';
        this.toasterType = 'error';
        this.toaster.isOpen = true;
        setTimeout(() => {
            this.closeToaster();
        }, 3000);
    });
  }

  closePaymentMethodModal() {
    this.modal.isOpen = false;
    this.deleteRow = false;
  }
}
