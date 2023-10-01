import { Component, ViewChild } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subject, filter, switchMap, takeUntil } from 'rxjs';
import { ToasterComponent } from 'src/app/shared/toaster/toaster.component';
import { AuthApiService } from 'src/services/api/auth.api.service';
import { CategoryApiService } from 'src/services/api/category.api.service';
import { formatDateString } from 'src/services/helpers';
import { ProductCategoryModel } from 'src/state';
import { selectCategories, selectLoading } from 'src/state/selectors/categories.selectors';
import { selectMyUser } from 'src/state/selectors/user.selectors';

type SortStatus = {
    [key in 'title' | 'price' | 'salePrice' | 'quantity']: boolean;
}

@Component({
  selector: 'app-product-categories',
  templateUrl: './product-categories.component.html',
  styleUrls: ['./product-categories.component.scss']
})
export class ProductCategoriesComponent {
    @ViewChild(ToasterComponent) toaster!: ToasterComponent;

    userDescription: string = '<script>alert("XSS Attack")</script>';
    sanitizedDescription!: SafeHtml;

    toasterMessage = 'Something went wrong!';
    toasterType = 'error';
    
    sortStatus: SortStatus = {
        title: false,
        price: false,
        salePrice: false,
        quantity: false
    };

    categories$: ProductCategoryModel[] = [];
    fileterdCategories$: ProductCategoryModel[] = [];
    isCategoriesLoading$ = false;

    parentCategories$: any[] = [];

    editCategories$: ProductCategoryModel = {
        id: '',
        name: '',
        status: false,
        createdAt: ''
    };

    currentVendorId = '';

    editRow: { [key: string]: boolean } = {};

    addRow = false;

    searchTerm = '';

    pageSize = 10;
    currentPage = 1;
    totalPage = 1;
    totalPages = 0;
    totalCategories = 0;
    startIndex = 0;
    endIndex = 0;

    sortDirection = 'asc';

    private destroy$: Subject<void> = new Subject<void>();

    constructor(
        private categoryApiService: CategoryApiService,
        private authApiService: AuthApiService,
        private store: Store,
        private router: Router,
        private sanitizer: DomSanitizer
    ) {
        this.store.select(selectCategories).subscribe(( categories: ProductCategoryModel[] ) => {
            this.categories$ = categories;
            this.filterCategorysBySearchTerm();
        });

        this.store.select(selectMyUser).subscribe((user: any) => {
            if (user && user.user && user.user.id) {
                this.currentVendorId = user.user.id;
            }
        });

        this.authApiService.resetInactivityTimer(); // reset inactivity timer
    }

    ngOnInit(): void {
        if (this.categories$.length === 0) {
            this.categoryApiService
                .isDataLoaded()
                .pipe(takeUntil(this.destroy$),
                    filter((isDataLoaded: boolean) => isDataLoaded),
                    switchMap(() => this.store.select(selectLoading))
                )
                .subscribe((isLoading: boolean) => {
                    if (isLoading) {
                        this.isCategoriesLoading$ = isLoading;
                    }
                });

            if (this.parentCategories$.length === 0) {
                this.getAllParentCategories();
            }
        } else {
            this.getAllCategories();
        }
    }

    isEditRow(id: string): boolean {
        return this.editRow[id];
    }

    toggleEditCategories(id: string): void {
        this.editRow[id] = !this.editRow[id];
    }

    async getAllCategories() {
        (await this.categoryApiService.getAllCategories()).subscribe((allCategories: ProductCategoryModel[]) => {
            this.categories$ = allCategories;
        });
        if (this.parentCategories$.length === 0) {
            this.getAllParentCategories();
        }
    }

    getCategoryParentById(id: string) {
        return this.parentCategories$.find(category => category.id === id) || {};
    }

    async getAllParentCategories() {
        (await this.categoryApiService.getAllParentCategories()).subscribe((allParentCategories: any[]) => {
            this.parentCategories$ = allParentCategories;
        });
    }

    filterCategorysBySearchTerm() {
        this.startIndex = (this.currentPage - 1) * this.pageSize;
        this.endIndex = (this.startIndex + this.pageSize) > this.categories$.length ? this.categories$.length : (this.startIndex + this.pageSize);

        if (!this.searchTerm) {
            this.fileterdCategories$ = this.categories$.slice(this.startIndex, this.endIndex);
        } else {
            this.fileterdCategories$ = this.categories$.filter(category => {
                return category.id.toLowerCase().includes(this.searchTerm.toLowerCase());
            }).slice(this.startIndex, this.endIndex);
        }
        
        this.calculateTotalPages();
        this.authApiService.resetInactivityTimer(); // reset inactivity timer
    }

    goToPrevPage() {
        if (this.currentPage > 1) {
            this.currentPage--;
            this.filterCategorysBySearchTerm();
        }
    }

    goToNextPage() {
        if (this.currentPage < this.totalPages) {
            this.currentPage++;
            this.filterCategorysBySearchTerm();
        }
    }

    goToFirstPage() {
        this.currentPage = 1;
        this.filterCategorysBySearchTerm();
    }

    goToLastPage() {
        this.currentPage = this.totalPages;
        this.filterCategorysBySearchTerm();
    }

    setPage(pageNumber: number) {
        this.currentPage = pageNumber;
        this.filterCategorysBySearchTerm();
    }

    calculateTotalPages() {
        this.totalPages = Math.ceil(this.categories$.length / this.pageSize);
    }

    sortBy(key: string) {
        this.fileterdCategories$.sort((a: any, b: any) => {
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

    resetEditCategories() {
        this.editCategories$ = {
            id: '',
            name: '',
            status: false,
            createdAt: ''
        };
    }

    toggleCategoryStatus() {
        this.editCategories$.status = !this.editCategories$.status;
    }

    toggleAddCategory(): void {
        this.resetEditCategories();
        this.addRow = !this.addRow;
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

    publishCategory() {
        if (
            this.editCategories$.name === '' 
            || this.editCategories$.description === ''
        ) {
            this.toasterMessage = 'Please fill all the required fields!';
            this.toasterType = 'error';
            this.toaster.isOpen = true;
            setTimeout(() => {
                this.closeToaster();
            }, 3000);
            return;
        }

        const modifiedCategoryName = this.editCategories$.name.trim().toLowerCase().replace(/\s+/g, '_');
        const timestamp = new Date().getTime();
        this.editCategories$.id = `${modifiedCategoryName}_${Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)}_${timestamp}`;

        this.editCategories$.updatedAt = new Date().toISOString();

        this.categoryApiService.saveCategory(this.editCategories$).subscribe((category: ProductCategoryModel) => {
            this.resetEditCategories();
            this.toasterMessage = 'Category added successfully!';
            this.toasterType = 'success';
            this.toaster.isOpen = true;
            setTimeout(() => {
                this.closeToaster();
            }, 3000);
            this.getAllCategories();
            this.toggleAddCategory();
        }, () => {
            this.toasterMessage = 'Something went wrong!';
            this.toasterType = 'error';
            this.toaster.isOpen = true;
            setTimeout(() => {
                this.closeToaster();
            }, 3000);
        });
    }
}
