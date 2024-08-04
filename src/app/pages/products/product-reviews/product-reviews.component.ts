import { Component, ViewChild } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subject, filter, switchMap, takeUntil } from 'rxjs';
import { ToasterComponent } from 'src/app/shared/toaster/toaster.component';
import { AuthApiService } from 'src/services/api/auth.api.service';
import { ProductApiService } from 'src/services/api/products.api.service';
import { ReviewApiService } from 'src/services/api/reviews.api.service';
import { ProductModel, ProductReviewModel } from 'src/state';
import { selectProducts } from 'src/state/selectors/products.selectors';
import { selectLoading, selectReviews } from 'src/state/selectors/reviews.selector';

type SortStatus = {
  [key in 'customer' | 'product' | 'comment' | 'rating']: boolean;
}

@Component({
  selector: 'app-product-reviews',
  templateUrl: './product-reviews.component.html',
  styleUrls: ['./product-reviews.component.scss']
})
export class ProductReviewsComponent {
    @ViewChild(ToasterComponent) toaster!: ToasterComponent;

    userDescription: string = '<script>alert("XSS Attack")</script>';
    sanitizedDescription!: SafeHtml;

    toasterMessage = 'Something went wrong!';
    toasterType = 'error';
    
    sortStatus: SortStatus = {
        customer: false,
        product: false,
        comment: false,
        rating: false
    };

    reviews$: ProductReviewModel[] = [];
    fileterdReviews$: ProductReviewModel[] = [];
    isReviewsLoading$ = true;

    parentReviews$: any[] = [];

    editReviews$: ProductReviewModel = {
        id: '',
        rating: 0,
        comment: '',
        productId: '',
        authorId: '',
        dateCreated: ''
    };

    allCustomers$: any[] = [];
    allProducts$: ProductModel[] = [];

    editRow: { [key: string]: boolean } = {};

    addRow = false;

    searchTerm = '';

    pageSize = 10;
    currentPage = 1;
    totalPage = 1;
    totalPages = 0;
    totalReviews = 0;
    startIndex = 0;
    endIndex = 0;

    sortDirection = 'asc';

    private destroy$: Subject<void> = new Subject<void>();

    constructor(
        private reviewApiService: ReviewApiService,
        private productApiService: ProductApiService,
        private authApiService: AuthApiService,
        private store: Store,
        private router: Router,
        private sanitizer: DomSanitizer
    ) {
        this.store.select(selectReviews).subscribe(( reviews: ProductReviewModel[] ) => {
            this.reviews$ = reviews;
            this.filterReviewsBySearchTerm();
        });

        this.store.select(selectProducts).subscribe(( products: ProductModel[] ) => {
            this.allProducts$ = products;
        });

        this.authApiService.resetInactivityTimer(); // reset inactivity timer
    }

    ngOnInit(): void {
        if (this.reviews$.length === 0) {
            this.reviewApiService
                .isDataLoaded()
                .pipe(takeUntil(this.destroy$),
                    filter((isDataLoaded: boolean) => isDataLoaded),
                    switchMap(() => this.store.select(selectLoading))
                )
                .subscribe((isLoading: boolean) => {
                    if (isLoading) {
                        this.isReviewsLoading$ = isLoading;
                    }
                });
        } else {
            this.getAllReviews();
        }

        if (this.allProducts$.length === 0) {
            this.isReviewsLoading$ = true;
            this.getAllProducts();
        }

        this.getAllCustomers();
    }

    isEditRow(id: string): boolean {
        return this.editRow[id];
    }

    toggleEditReviews(id: string): void {
        this.editRow[id] = !this.editRow[id];
    }

    async getAllReviews() {
        this.authApiService.getAllUsers().subscribe((allCustomers: any[]) => {
            this.allCustomers$ = allCustomers;
        });
    }

    async getAllProducts() {
        (await this.productApiService.getAllProducts()).subscribe((allProducts: ProductModel[]) => {
            this.allProducts$ = allProducts;
            this.isReviewsLoading$ = false;
        });
    }

    filterReviewsBySearchTerm() {
        this.startIndex = (this.currentPage - 1) * this.pageSize;
        this.endIndex = (this.startIndex + this.pageSize) > this.reviews$.length ? this.reviews$.length : (this.startIndex + this.pageSize);

        if (!this.searchTerm) {
            this.fileterdReviews$ = this.reviews$.slice(this.startIndex, this.endIndex);
        } else {
            this.fileterdReviews$ = this.reviews$.filter(review => {
                return review.comment.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
                    this.getCustomerNameById(review.authorId).toLowerCase().includes(this.searchTerm.toLowerCase()) ||
                    this.getProductById(review.productId).toLowerCase().includes(this.searchTerm.toLowerCase());
            }).slice(this.startIndex, this.endIndex);
        }
        
        this.calculateTotalPages();
        this.authApiService.resetInactivityTimer(); // reset inactivity timer
    }

    getAllCustomers() {
        if (this.allCustomers$.length === 0) {
            this.authApiService.getAllUsers().subscribe((allCustomers: any[]) => {
                this.allCustomers$ = allCustomers;
                this.isReviewsLoading$ = false;
            });
        }
    }

    getProductById(id: string) {
        const product = this.allProducts$.find(product => product.id === id);
        return product ? product.title : '';
    }

    getCustomerNameById(id: string) {
        const customer = this.allCustomers$.find(customer => customer.id === id);
        return customer ? customer.name : '';
    }

    goToPrevPage() {
        if (this.currentPage > 1) {
            this.currentPage--;
            this.filterReviewsBySearchTerm();
        }
    }

    goToNextPage() {
        if (this.currentPage < this.totalPages) {
            this.currentPage++;
            this.filterReviewsBySearchTerm();
        }
    }

    goToFirstPage() {
        this.currentPage = 1;
        this.filterReviewsBySearchTerm();
    }

    goToLastPage() {
        this.currentPage = this.totalPages;
        this.filterReviewsBySearchTerm();
    }

    setPage(pageNumber: number) {
        this.currentPage = pageNumber;
        this.filterReviewsBySearchTerm();
    }

    calculateTotalPages() {
        this.totalPages = Math.ceil(this.reviews$.length / this.pageSize);
    }

    sortBy(key: string) {
        this.fileterdReviews$.sort((a: any, b: any) => {
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

    sanitizeUserInput() {
        this.sanitizedDescription = this.sanitizer.bypassSecurityTrustHtml(this.userDescription);
    }

    closeToaster() {
        this.toaster.isOpen = false;
    }

    toggleSelectAll(event: any) {
        const checkboxes = document.querySelectorAll('input[type="checkbox"]');
        checkboxes.forEach((checkbox: any) => {
            checkbox.checked = event.target.checked;
        });
    }
}
