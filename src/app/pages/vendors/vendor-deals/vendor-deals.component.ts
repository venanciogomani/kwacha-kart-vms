import { Component, ViewChild } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subject } from 'rxjs';
import { ModalComponent } from 'src/app/shared/modal/modal.component';
import { ToasterComponent } from 'src/app/shared/toaster/toaster.component';
import { AuthApiService } from 'src/services/api/auth.api.service';
import { PromotionsApiService } from 'src/services/api/promotions.api.service';
import { VendorApiService } from 'src/services/api/vendor.api.service';
import { formatDateString } from 'src/services/helpers';
import { UserModel, VendorModel, VendorPromotionModel } from 'src/state';

type SortStatus = {
  [key in 'name' | 'startDate' | 'endDate' | 'price' | 'vendor' | 'status']: boolean;
}

@Component({
  selector: 'app-vendor-deals',
  templateUrl: './vendor-deals.component.html',
  styleUrls: ['./vendor-deals.component.scss']
})
export class VendorDealsComponent {
  @ViewChild(ModalComponent) modal!: ModalComponent;
  @ViewChild(ToasterComponent) toaster!: ToasterComponent;

  userDescription: string = '<script>alert("XSS Attack")</script>';
  sanitizedDescription!: SafeHtml;

  toasterMessage = 'Something went wrong!';
  toasterType = 'error';
  
  sortStatus: SortStatus = {
      name: false,
      startDate: false,
      endDate: false,
      price: false,
      vendor: false,
      status: false,
  };

  promotions$: VendorPromotionModel[] = [];
  filteredPromotions$: VendorPromotionModel[] = [];
  allUsersByIds$: UserModel[] = [];
  isPromotionsLoading$ = false;

  currentVendor$: VendorModel = {} as VendorModel;

  editPromotion: VendorPromotionModel = {
    id: '',
    name: '',
    startDate: '',
    endDate: '',
    description: '',
    percentage: 0,
    productId: [],
    status: false,
    isFeatured: false,
    vendorId: '',
    createdAt: '',
    storeId: ''
  };

  editRow: { [key: string]: boolean } = {};

  addRow = false;
  deleteRow = false;

  searchTerm = '';

  pageSize = 10;
  currentPage = 1;
  totalPage = 1;
  totalPages = 0;
  totalPromotions = 0;
  startIndex = 0;
  endIndex = 0;

  sortDirection = 'asc';

  private destroy$: Subject<void> = new Subject<void>();

  constructor(
    private promotionsApiService: PromotionsApiService,
    private authApiService: AuthApiService,
    private vendorApiService: VendorApiService,
    private store: Store<{ orders: VendorPromotionModel[] }>,
    private router: Router,
    private sanitizer: DomSanitizer
  ) {
    this.authApiService.resetInactivityTimer(); // reset inactivity timer
  }

  ngOnInit() {
    if (this.promotions$.length === 0) {
      this.getAllPromotions();
    } else {
        this.filterPromotionsBySearchTerm();
        this.totalPromotions = this.promotions$.length;
        
        this.isPromotionsLoading$ = false;
    }

    if (!this.currentVendor$.name) {
      this.getMyCurrentUser();
    }
  }

  isEditRow(id: string): boolean {
    return this.editRow[id];
  }

  toggleEditPromotion(promotionToEdit: VendorPromotionModel): void {
    this.resetEditPromotion();
    this.editRow[promotionToEdit.id] = !this.editRow[promotionToEdit.id];
    this.editPromotion = this.editRow[promotionToEdit.id] == true ? promotionToEdit : {} as VendorPromotionModel;;
  }

  getPromotionById(id: string) {
    return this.promotions$.find(promotion => promotion.id === id);
  }

  async getAllPromotions() {
    return (await this.promotionsApiService.getAllPromotions()).subscribe((allPromotions: VendorPromotionModel[]) => {
      this.promotions$ = allPromotions;
      this.filterPromotionsBySearchTerm();
    });
  }

  filterPromotionsBySearchTerm() {
    this.startIndex = (this.currentPage - 1) * this.pageSize;
    this.endIndex = (this.startIndex + this.pageSize) > this.promotions$.length ? this.promotions$.length : (this.startIndex + this.pageSize);

    if (!this.searchTerm) {
        this.filteredPromotions$ = this.promotions$.slice(this.startIndex, this.endIndex);
    } else {
      this.filteredPromotions$ = this.promotions$.filter(promotion => {
        return promotion.name.toLowerCase().includes(this.searchTerm.toLowerCase());
      }).slice(this.startIndex, this.endIndex);
    }
    
    this.calculateTotalPages();
  }

  goToPrevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.filterPromotionsBySearchTerm();
    }
  }

  goToNextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.filterPromotionsBySearchTerm();
    }
  }

  goToFirstPage() {
    this.currentPage = 1;
    this.filterPromotionsBySearchTerm();
  }

  goToLastPage() {
    this.currentPage = this.totalPages;
    this.filterPromotionsBySearchTerm();
  }

  setPage(pageNumber: number) {
    this.currentPage = pageNumber;
    this.filterPromotionsBySearchTerm();
  }

  calculateTotalPages() {
    this.totalPages = Math.ceil(this.promotions$.length / this.pageSize);
  }

  sortBy(key: string) {
    this.filteredPromotions$.sort((a: any, b: any) => {
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

  ngOnDestroy(): void {
      this.destroy$.next();
      this.destroy$.complete();
  }

  resetEditPromotion() {
    this.editPromotion = {
      id: '',
      name: '',
      startDate: '',
      endDate: '',
      description: '',
      percentage: 0,
      productId: [],
      status: false,
      isFeatured: false,
      vendorId: '',
      createdAt: '',
      storeId: ''
    }
  }

  sanitizeUserInput() {
    this.sanitizedDescription = this.sanitizer.bypassSecurityTrustHtml(this.userDescription);
  }

  closeToaster() {
    this.toaster.isOpen = false;
  }

  formatDate(dateString: string) {
    return formatDateString(dateString);
  }

  toggleViewPromotion(id: string) {}

  toggleAddPromotion() {
    this.resetEditPromotion();
    this.addRow = !this.addRow;
    this.deleteRow = false;
  }

  publishPromotion() {
    if (this.editPromotion.name === ''
      || this.editPromotion.startDate === ''
      || this.editPromotion.endDate === ''
      || this.editPromotion.percentage === 0
    ) {
      this.toasterMessage = 'Please fill all the fields!';
      this.toasterType = 'error';
      this.toaster.isOpen = true;
      setTimeout(() => {
          this.closeToaster();
      }, 3000);

      return;
    }

    if (new Date(this.editPromotion.startDate) > new Date(this.editPromotion.endDate)) {
      this.toasterMessage = 'Start date should be before end date!';
      this.toasterType = 'error';
      this.toaster.isOpen = true;
      setTimeout(() => {
          this.closeToaster();
      }, 3000);
      return;
    }

    if (this.editPromotion.percentage <= 0) {
      this.toasterMessage = 'Percentage should be greater than 0!';
      this.toasterType = 'error';
      this.toaster.isOpen = true;
      setTimeout(() => {
          this.closeToaster();
      }, 3000);
      return;
    }

    this.editPromotion.vendorId = this.currentVendor$.id;
    this.editPromotion.storeId = this.currentVendor$.storeId;

    this.promotionsApiService.publishPromotion(this.editPromotion).subscribe(() => {
      this.toasterMessage = 'Promotion created successfully!';
      this.toasterType ='success';
      this.toaster.isOpen = true;
      setTimeout(() => {
          this.closeToaster();
      }, 3000);
      this.getAllPromotions();
      this.resetEditPromotion();
      this.toggleAddPromotion();
    }, () => {
      this.toasterMessage = 'Failed to create promotion!';
      this.toasterType = 'error';
      this.toaster.isOpen = true;
      setTimeout(() => {
          this.closeToaster();
      }, 3000);
    });
  }

  toggleDeletePromotion(promotion: VendorPromotionModel) {
    this.resetEditPromotion();
    this.addRow = false;
    this.editRow[promotion.id] = false;
    this.deleteRow = true;
    this.editPromotion = { ...promotion };
    this.modal.isOpen = true;
  }

  closePromotionModal() {
    this.modal.isOpen = false;
    this.resetEditPromotion();
    this.addRow = false;
    this.deleteRow = false;
  }

  performDeletePromotion(): void {
    this.promotionsApiService.deletePromotion(this.editPromotion.id).subscribe(() => {
      this.toasterMessage = 'Promotion deleted successfully!';
      this.toasterType ='success';
      this.toaster.isOpen = true;
      setTimeout(() => {
          this.closeToaster();
      }, 3000);
      this.getAllPromotions();
      this.closePromotionModal();
    }, () => {
      this.toasterMessage = 'Failed to delete promotion!';
      this.toasterType = 'error';
      this.toaster.isOpen = true;
      setTimeout(() => {
          this.closeToaster();
      }, 3000);
    });
  }

  performUpdatePromotion() {
    if (this.editPromotion.name === ''
      || this.editPromotion.startDate === ''
      || this.editPromotion.endDate === ''
      || this.editPromotion.percentage === 0
    ) {
      this.toasterMessage = 'Please fill all the fields!';
      this.toasterType = 'error';
      this.toaster.isOpen = true;
      setTimeout(() => {
          this.closeToaster();
      }, 3000);

      return;
    }

    if (new Date(this.editPromotion.startDate) > new Date(this.editPromotion.endDate)) {
      this.toasterMessage = 'Start date should be before end date!';
      this.toasterType = 'error';
      this.toaster.isOpen = true;
      setTimeout(() => {
          this.closeToaster();
      }, 3000);
      return;
    }

    if (this.editPromotion.percentage <= 0) {
      this.toasterMessage = 'Percentage should be greater than 0!';
      this.toasterType = 'error';
      this.toaster.isOpen = true;
      setTimeout(() => {
          this.closeToaster();
      }, 3000);
      return;
    }

    this.editPromotion.updatedAt = new Date().toISOString();

    this.promotionsApiService.updatePromotion(this.editPromotion).subscribe(() => {
      this.toasterMessage = 'Promotion updated successfully!';
      this.toasterType ='success';
      this.toaster.isOpen = true;
      this.editRow[this.editPromotion.id] = !this.editRow[this.editPromotion.id];
      setTimeout(() => {
          this.closeToaster();
      }, 3000);
      this.getAllPromotions();
      this.resetEditPromotion();
      this.resetEditPromotion();
    }, () => {
      this.toasterMessage = 'Failed to update promotion!';
      this.toasterType = 'error';
      this.toaster.isOpen = true;
      setTimeout(() => {
          this.closeToaster();
      }, 3000);
    });
  }

  async getMyCurrentUser() {
    (await this.authApiService.getCurrentUser()).subscribe(async (user: any) => {
        if (Object.keys(user).length > 0) {
            const currentUser = user.user;
            if (Object.keys(currentUser).length > 0) {
                (await this.vendorApiService.getVendorByUserId(currentUser.id)).subscribe((vendor: VendorModel) => {
                    if (vendor && Object.keys(vendor).length > 0) {
                        this.currentVendor$ = vendor;
                    }
                });
            }
        }
    });
  }

  getCurrentVendorName(text?: string) {
    if (!text) return null;

    return this.currentVendor$.name;
  }

  getUserById(id: string) {
    // const user = this.allUsers$.filter(user => user.id === id)[0];
    // return user || {} as any;
  }

  formatPromotionDate(date?: string) {
    if (!date) {
      return '';
    }
    return formatDateString(date);
  }
}
