import { Component, ViewChild } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subject, filter, switchMap, takeUntil } from 'rxjs';
import { ToasterComponent } from 'src/app/shared/toaster/toaster.component';
import { OrderApiService } from 'src/services/api/order.api.service';
import { UserModel, VendorOrderModel } from 'src/state';
import { selectOrders } from 'src/state/selectors/orders.selectors';
import { selectLoading } from 'src/state/selectors/vendors.selectors';
import { formatDateString } from 'src/services/helpers';
import { AuthApiService } from 'src/services/api/auth.api.service';

type SortStatus = {
    [key in 'name' | 'city' | 'status']: boolean;
}

@Component({
  selector: 'app-vendor-orders',
  templateUrl: './vendor-orders.component.html',
  styleUrls: ['./vendor-orders.component.scss']
})
export class VendorOrdersComponent {
    @ViewChild(ToasterComponent) toaster!: ToasterComponent;

    userDescription: string = '<script>alert("XSS Attack")</script>';
    sanitizedDescription!: SafeHtml;

    toasterMessage = 'Something went wrong!';
    toasterType = 'error';
    
    sortStatus: SortStatus = {
        name: false,
        city: false,
        status: false,
    };

    orders$: VendorOrderModel[] = [];
    fileterdOrders$: VendorOrderModel[] = [];
    allUsersByIds$: UserModel[] = [];
    isOrdersLoading$ = false;

    editOrders: VendorOrderModel = {
        id: '',
        orderNo: '',
        orderDate: '',
        orderStatus: '',
        orderTotal: 0,
        orderProductId: [],
        vendorId: '',
        userId: '',
        deliveryMethodId: '',
        paymentMethodId: '',
        createdAt: ''
    };

    editRow: { [key: string]: boolean } = {};

    addRow = false;

    searchTerm = '';

    pageSize = 10;
    currentPage = 1;
    totalPage = 1;
    totalPages = 0;
    totalOrders = 0;
    startIndex = 0;
    endIndex = 0;

    sortDirection = 'asc';

    private destroy$: Subject<void> = new Subject<void>();

    constructor(
        private orderApiService: OrderApiService,
        private authApiService: AuthApiService,
        private store: Store<{ orders: VendorOrderModel[] }>,
        private router: Router,
        private sanitizer: DomSanitizer
    ) {
        this.store.select(selectOrders).subscribe(( orders: VendorOrderModel[] ) => {
            this.orders$ = orders;
            this.filterOrdersBySearchTerm();
        });
    }

    ngOnInit(): void {
        if (this.orders$.length === 0) {
            this.orderApiService
                .isDataLoaded()
                .pipe(takeUntil(this.destroy$),
                    filter((isDataLoaded: boolean) => isDataLoaded),
                    switchMap(() => this.store.select(selectLoading))
                )
                .subscribe((isLoading: boolean) => {
                    if (isLoading) {
                        this.isOrdersLoading$ = isLoading;
                    }
                    if (this.orders$.length > 0) {
                        this.getAllUserIdsFromOrders();
                    }
                });
        } else {
            this.getAllOrders();
            if (this.orders$.length > 0) {
                this.getAllUserIdsFromOrders();
            }
        }
    }

    isEditRow(id: string): boolean {
        return this.editRow[id];
    }

    toggleEditOrder(id: string): void {
        this.editRow[id] = !this.editRow[id];
    }

    getOrderById(id: string) {
        return this.orders$.find(order => order.id === id);
    }

    async getAllOrders() {
        return (await this.orderApiService.getAllOrders()).subscribe((allOrders: VendorOrderModel[]) => {
            this.orders$ = allOrders;
            this.filterOrdersBySearchTerm();
        });
    }

    filterOrdersBySearchTerm() {
        this.startIndex = (this.currentPage - 1) * this.pageSize;
        this.endIndex = (this.startIndex + this.pageSize) > this.orders$.length ? this.orders$.length : (this.startIndex + this.pageSize);

        if (!this.searchTerm) {
            this.fileterdOrders$ = this.orders$.slice(this.startIndex, this.endIndex);
        } else {
            this.fileterdOrders$ = this.orders$.filter(order => {
                return order.orderNo.toLowerCase().includes(this.searchTerm.toLowerCase());
            }).slice(this.startIndex, this.endIndex);
        }
        
        this.calculateTotalPages();
    }

    goToPrevPage() {
        if (this.currentPage > 1) {
            this.currentPage--;
            this.filterOrdersBySearchTerm();
        }
    }

    goToNextPage() {
        if (this.currentPage < this.totalPages) {
            this.currentPage++;
            this.filterOrdersBySearchTerm();
        }
    }

    goToFirstPage() {
        this.currentPage = 1;
        this.filterOrdersBySearchTerm();
    }

    goToLastPage() {
        this.currentPage = this.totalPages;
        this.filterOrdersBySearchTerm();
    }

    setPage(pageNumber: number) {
        this.currentPage = pageNumber;
        this.filterOrdersBySearchTerm();
    }

    calculateTotalPages() {
        this.totalPages = Math.ceil(this.orders$.length / this.pageSize);
    }

    sortBy(key: string) {
        this.fileterdOrders$.sort((a: any, b: any) => {
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

    toggleViewOrder(id: string) {
        this.router.navigate([`dashboard/vendors/orders/${id}`]);
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    resetEditStore() {
        this.editOrders = {
            id: '',
            orderNo: '',
            orderDate: '',
            orderStatus: '',
            orderTotal: 0,
            orderProductId: [],
            vendorId: '',
            userId: '',
            deliveryMethodId: '',
            paymentMethodId: '',
            createdAt: ''
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

    getAllUserIdsFromOrders() {
        const userIds = this.orders$.map(order => order.userId);
        return userIds.length > 0 ? this.authApiService.getAllUsersByIds(userIds).subscribe((users: any) => {
            this.allUsersByIds$ = users.data;
        }, (error) => {
            console.log(error);
        }) : null;
    }

    getUserById(id: string) {
        return this.allUsersByIds$.find(user => user.id === id);
    }
}
