import { Component, ViewChild } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subject, filter, switchMap, takeUntil } from 'rxjs';
import { ToasterComponent } from 'src/app/shared/toaster/toaster.component';
import { BrandApiService } from 'src/services/api/brand.api.service';
import { formatDateString } from 'src/services/helpers';
import { ProductBrandModel } from 'src/state';
import { selectBrands, selectLoading } from 'src/state/selectors/brands.selectors';

type SortStatus = {
    [key in 'title' | 'price' | 'salePrice' | 'quantity']: boolean;
}

@Component({
  selector: 'app-product-brands',
  templateUrl: './product-brands.component.html',
  styleUrls: ['./product-brands.component.scss']
})
export class ProductBrandsComponent {
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

    brands$: ProductBrandModel[] = [];
    fileterdBrands$: ProductBrandModel[] = [];
    isBrandsLoading$ = false;

    parentBrands$: any[] = [];

    editBrands$: ProductBrandModel = {
        id: '',
        name: '',
        status: false,
        createdAt: ''
    };

    editRow: { [key: string]: boolean } = {};

    addRow = false;

    searchTerm = '';

    pageSize = 10;
    currentPage = 1;
    totalPage = 1;
    totalPages = 0;
    totalBrands = 0;
    startIndex = 0;
    endIndex = 0;

    sortDirection = 'asc';

    private destroy$: Subject<void> = new Subject<void>();

    constructor(
        private brandApiService: BrandApiService,
        private store: Store,
        private router: Router,
        private sanitizer: DomSanitizer
    ) {
        this.store.select(selectBrands).subscribe(( brands: ProductBrandModel[] ) => {
            this.brands$ = brands;
            this.filterBrandsBySearchTerm();
        });
    }

    ngOnInit(): void {
        if (this.brands$.length === 0) {
            this.brandApiService
                .isDataLoaded()
                .pipe(takeUntil(this.destroy$),
                    filter((isDataLoaded: boolean) => isDataLoaded),
                    switchMap(() => this.store.select(selectLoading))
                )
                .subscribe((isLoading: boolean) => {
                    if (isLoading) {
                        this.isBrandsLoading$ = isLoading;
                    }
                });
        } else {
            this.getAllBrands();
        }
    }

    isEditRow(id: string): boolean {
        return this.editRow[id];
    }

    toggleEditBrands(id: string): void {
        this.editRow[id] = !this.editRow[id];
    }

    async getAllBrands() {
        (await this.brandApiService.getAllBrands()).subscribe((allBrands: ProductBrandModel[]) => {
            this.brands$ = allBrands;
        });
    }

    filterBrandsBySearchTerm() {
        this.startIndex = (this.currentPage - 1) * this.pageSize;
        this.endIndex = (this.startIndex + this.pageSize) > this.brands$.length ? this.brands$.length : (this.startIndex + this.pageSize);

        if (!this.searchTerm) {
            this.fileterdBrands$ = this.brands$.slice(this.startIndex, this.endIndex);
        } else {
            this.fileterdBrands$ = this.brands$.filter(brand => {
                return brand.id.toLowerCase().includes(this.searchTerm.toLowerCase());
            }).slice(this.startIndex, this.endIndex);
        }
        
        this.calculateTotalPages();
    }

    goToPrevPage() {
        if (this.currentPage > 1) {
            this.currentPage--;
            this.filterBrandsBySearchTerm();
        }
    }

    goToNextPage() {
        if (this.currentPage < this.totalPages) {
            this.currentPage++;
            this.filterBrandsBySearchTerm();
        }
    }

    goToFirstPage() {
        this.currentPage = 1;
        this.filterBrandsBySearchTerm();
    }

    goToLastPage() {
        this.currentPage = this.totalPages;
        this.filterBrandsBySearchTerm();
    }

    setPage(pageNumber: number) {
        this.currentPage = pageNumber;
        this.filterBrandsBySearchTerm();
    }

    calculateTotalPages() {
        this.totalPages = Math.ceil(this.brands$.length / this.pageSize);
    }

    sortBy(key: string) {
        this.fileterdBrands$.sort((a: any, b: any) => {
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

    resetEditBrands() {
        this.editBrands$ = {
            id: '',
            name: '',
            status: false,
            createdAt: ''
        };
    }

    toggleBrandStatus() {
        this.editBrands$.status = !this.editBrands$.status;
    }

    toggleAddBrand(): void {
        this.resetEditBrands();
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

    publishBrand() {
        if (
            this.editBrands$.name === '' 
            || this.editBrands$.description === ''
        ) {
            this.toasterMessage = 'Please fill all the required fields!';
            this.toasterType = 'error';
            this.toaster.isOpen = true;
            setTimeout(() => {
                this.closeToaster();
            }, 3000);
            return;
        }

        const modifiedBrandName = this.editBrands$.name.trim().toLowerCase().replace(/\s+/g, '_');
        const timestamp = new Date().getTime();
        this.editBrands$.id = `${modifiedBrandName}_${Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)}_${timestamp}`;

        this.editBrands$.updatedAt = new Date().toISOString();

        this.brandApiService.saveBrand(this.editBrands$).subscribe((brand: ProductBrandModel) => {
            this.resetEditBrands();
            this.toasterMessage = 'Brand added successfully!';
            this.toasterType = 'success';
            this.toaster.isOpen = true;
            setTimeout(() => {
                this.closeToaster();
            }, 3000);
            this.getAllBrands();
            this.toggleAddBrand();
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
