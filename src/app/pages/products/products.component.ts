import { Component, ViewChild } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subject, filter, switchMap, takeUntil } from 'rxjs';
import { ModalComponent } from 'src/app/shared/modal/modal.component';
import { ToasterComponent } from 'src/app/shared/toaster/toaster.component';
import { AuthApiService } from 'src/services/api/auth.api.service';
import { BrandApiService } from 'src/services/api/brand.api.service';
import { CategoryApiService } from 'src/services/api/category.api.service';
import { ProductApiService } from 'src/services/api/products.api.service';
import { formatDateString } from 'src/services/helpers';
import { ProductBrandModel, ProductCategoryModel, ProductModel } from 'src/state';
import { selectLoading, selectProducts } from 'src/state/selectors/products.selectors';
import { selectMyUser } from 'src/state/selectors/user.selectors';
import { selectVendors } from 'src/state/selectors/vendors.selectors';

type SortStatus = {
    [key in 'title' | 'price' | 'salePrice' | 'quantity']: boolean;
}

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent {
    @ViewChild(ModalComponent) modal!: ModalComponent;
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

    products$: ProductModel[] = [];
    fileterdProducts$: ProductModel[] = [];
    isProductsLoading$ = false;

    productCategories$: ProductCategoryModel[] = [];
    productBrands$: ProductBrandModel[] = [];

    editProducts$: ProductModel = {
        id: '',
        title: '',
        price: 0,
        salePrice: 0,
        quantity: 0,
        dateCreated: '',
        categoryId: '',
        brandId: '',
        vendorId: '',
        status: false
    };

    currentVendorId = '';

    editRow: { [key: string]: boolean } = {};

    addRow = false;
    deleteRow = false;

    searchTerm = '';

    pageSize = 10;
    currentPage = 1;
    totalPage = 1;
    totalPages = 0;
    totalProducts = 0;
    startIndex = 0;
    endIndex = 0;

    sortDirection = 'asc';

    private destroy$: Subject<void> = new Subject<void>();

    constructor(
        private productApiService: ProductApiService,
        private categoryApiService: CategoryApiService,
        private authApiService: AuthApiService,
        private brandApiService: BrandApiService,
        private store: Store,
        private router: Router,
        private sanitizer: DomSanitizer
    ) {
        this.store.select(selectProducts).subscribe(( products: ProductModel[] ) => {
            this.products$ = products;
            this.filterProductsBySearchTerm();
        });

        this.store.select(selectMyUser).subscribe((user: any) => {
            if (user && user.user && user.user.id) {
                this.currentVendorId = user.user.id;
                console.log(user);
            }
        });
    }

    async ngOnInit(): Promise<void> {
        if (this.products$.length === 0) {
            this.productApiService
                .isDataLoaded()
                .pipe(takeUntil(this.destroy$),
                    filter((isDataLoaded: boolean) => isDataLoaded),
                    switchMap(() => this.store.select(selectLoading))
                )
                .subscribe((isLoading: boolean) => {
                    if (isLoading) {
                        this.isProductsLoading$ = isLoading;
                    }
                });
        } else {
            this.getAllProducts();
        }

        if (this.productCategories$.length === 0) {
            this.categoryApiService
                .isDataLoaded()
                .pipe(takeUntil(this.destroy$),
                    filter((isDataLoaded: boolean) => isDataLoaded)
                )
                .subscribe((isDataLoaded: boolean) => {
                    if (isDataLoaded) {
                        this.getAllCategories();
                    }
                });
        } else {
            this.getAllCategories();
        }

        if (this.productBrands$.length === 0) {
            this.brandApiService
                .isDataLoaded()
                .pipe(takeUntil(this.destroy$),
                    filter((isDataLoaded: boolean) => isDataLoaded)
                )
                .subscribe((isDataLoaded: boolean) => {
                    if (isDataLoaded) {
                        this.getAllBrands();
                    }
                });
        } else {
            this.getAllBrands();
        }

        (await this.authApiService.getCurrentUser()).subscribe((user: any) => {
            if (user && user.user && user.user.id) {
                this.store.select(selectVendors).subscribe((vendors: any) => {
                    if (vendors && vendors.length > 0) {
                        this.currentVendorId = vendors.find((vendor: any) => vendor.userId === user.user.id)?.id;
                    }
                });
            }
        });
    }

    isEditRow(id: string): boolean {
        return this.editRow[id];
    }

    toggleEditProduct(product: ProductModel): void {
        this.resetEditProduct();
        this.addRow = false;
        this.editRow[product.id] = !this.editRow[product.id];
        this.editProducts$ = { ...product };
    }

    getProductById(id: string) {
        return this.products$.find(product => product.id === id);
    }

    async getAllCategories() {
        (await this.categoryApiService.getAllCategories()).subscribe((allCategories: ProductCategoryModel[]) => {
            this.productCategories$ = allCategories;
        });
    }

    getCategoryById(id: string) {
        return this.productCategories$.find(category => category.id === id);
    }

    async getAllBrands() {
        (await this.brandApiService.getAllBrands()).subscribe((allBrands: ProductBrandModel[]) => {
            this.productBrands$ = allBrands;
        });
    }

    getBrandsById(id: string) {
        return this.productBrands$.find(brand => brand.id === id);
    }

    async getAllProducts() {
        return (await this.productApiService.getAllProducts()).subscribe((allProducts: ProductModel[]) => {
            this.products$ = allProducts;
            this.totalProducts = this.products$.length;
            this.filterProductsBySearchTerm();
        });
    }

    filterProductsBySearchTerm() {
        this.startIndex = (this.currentPage - 1) * this.pageSize;
        this.endIndex = (this.startIndex + this.pageSize) > this.products$.length ? this.products$.length : (this.startIndex + this.pageSize);

        if (!this.searchTerm) {
            this.fileterdProducts$ = this.products$.slice(this.startIndex, this.endIndex);
        } else {
            this.fileterdProducts$ = this.products$.filter(products => {
                return products.id.toLowerCase().includes(this.searchTerm.toLowerCase());
            }).slice(this.startIndex, this.endIndex);
        }
        
        this.calculateTotalPages();
    }

    goToPrevPage() {
        if (this.currentPage > 1) {
            this.currentPage--;
            this.filterProductsBySearchTerm();
        }
    }

    goToNextPage() {
        if (this.currentPage < this.totalPages) {
            this.currentPage++;
            this.filterProductsBySearchTerm();
        }
    }

    goToFirstPage() {
        this.currentPage = 1;
        this.filterProductsBySearchTerm();
    }

    goToLastPage() {
        this.currentPage = this.totalPages;
        this.filterProductsBySearchTerm();
    }

    setPage(pageNumber: number) {
        this.currentPage = pageNumber;
        this.filterProductsBySearchTerm();
    }

    calculateTotalPages() {
        this.totalPages = Math.ceil(this.products$.length / this.pageSize);
        this.totalProducts = this.products$.length;
    }

    sortBy(key: string) {
        this.fileterdProducts$.sort((a: any, b: any) => {
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

    toggleViewProduct(id: string) {
        this.router.navigate([`dashboard/products/view/${id}`]);
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    resetEditProduct() {
        this.editProducts$ = {
            id: '',
            title: '',
            price: 0,
            salePrice: 0,
            quantity: 0,
            dateCreated: '',
            categoryId: '',
            brandId: '',
            vendorId: '',
            status: false
        };

        if (this.currentVendorId !== '') {
            this.editProducts$.vendorId = this.currentVendorId;
        }
    }

    toggleAddProduct(): void {
        this.resetEditProduct();
        this.addRow = !this.addRow;
        this.deleteRow = false;
    }

    toggleDeleteProduct(product: ProductModel): void {
        this.resetEditProduct();
        this.editProducts$ = { ...product };
        this.deleteRow = !this.deleteRow;
        this.addRow = false;
        this.modal.isOpen = true;
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

    publishProduct() {
        if (
            this.editProducts$.title === '' 
            || this.editProducts$.price === 0 
            || this.editProducts$.quantity === 0 
            || this.editProducts$.categoryId === '' 
            || this.editProducts$.brandId === ''
        ) {
            this.toasterMessage = 'Please fill all the required fields!';
            this.toasterType = 'error';
            this.toaster.isOpen = true;
            setTimeout(() => {
                this.closeToaster();
            }, 3000);
            return;
        }

        const numericSalePrice = Number(this.editProducts$.salePrice);
        const numericPrice = Number(this.editProducts$.price);
        
        if (numericSalePrice > numericPrice) {
            this.toasterMessage = 'Sale price cannot be greater than price!';
            this.toasterType = 'error';
            this.toaster.isOpen = true;
            setTimeout(() => {
                this.closeToaster();
            }, 3000);
            return;
        }
        
        if (this.editProducts$.vendorId === '') {
            this.toasterMessage = 'Please login to add product!';
            this.toasterType = 'error';
            this.toaster.isOpen = true;
            setTimeout(() => {
                this.closeToaster();
            }, 3000);
            return;
        }

        const modifiedProductName = this.editProducts$.title.trim().toLowerCase().replace(/\s+/g, '_');
        const timestamp = new Date().getTime();
        this.editProducts$.id = `${modifiedProductName}_${Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)}_${timestamp}`;

        this.editProducts$.dateCreated = new Date().toISOString();
        this.editProducts$.description = 'Some description';
        this.editProducts$.detailedDescription = 'Some detailed description';
        this.editProducts$.warranty = 'none';

        this.productApiService.saveProduct(this.editProducts$).subscribe((product: ProductModel) => {
            this.addRow = false;
            this.resetEditProduct();
            this.toasterMessage = 'Product added successfully!';
            this.toasterType = 'success';
            this.toaster.isOpen = true;
            setTimeout(() => {
                this.closeToaster();
            }, 3000);
            this.getAllProducts();
        }, () => {
            this.toasterMessage = 'Something went wrong!';
            this.toasterType = 'error';
            this.toaster.isOpen = true;
            setTimeout(() => {
                this.closeToaster();
            }, 3000);
        });
    }

    performUpdateProduct() {
        if (
            this.editProducts$.title === '' 
            || this.editProducts$.price === 0 
            || this.editProducts$.quantity === 0 
            || this.editProducts$.categoryId === '' 
            || this.editProducts$.brandId === ''
        ) {
            this.toasterMessage = 'Please fill all the required fields!';
            this.toasterType = 'error';
            this.toaster.isOpen = true;
            setTimeout(() => {
                this.closeToaster();
            }, 3000);
            return;
        }

        const numericSalePrice = Number(this.editProducts$.salePrice);
        const numericPrice = Number(this.editProducts$.price);
        
        if (numericSalePrice > numericPrice) {
            this.toasterMessage = 'Sale price cannot be greater than price!';
            this.toasterType = 'error';
            this.toaster.isOpen = true;
            setTimeout(() => {
                this.closeToaster();
            }, 3000);
            return;
        }
        
        if (this.editProducts$.vendorId === '') {
            this.toasterMessage = 'Please login to add product!';
            this.toasterType = 'error';
            this.toaster.isOpen = true;
            setTimeout(() => {
                this.closeToaster();
            }, 3000);
            return;
        }

        this.productApiService.updateProduct(this.editProducts$).subscribe((product: ProductModel) => {
            this.addRow = false;
            this.editRow[this.editProducts$.id] = false;
            this.resetEditProduct();
            this.toasterMessage = 'Product updated successfully!';
            this.toasterType = 'success';
            this.toaster.isOpen = true;
            setTimeout(() => {
                this.closeToaster();
            }, 3000);
            this.getAllProducts();
        }, () => {
            this.toasterMessage = 'Something went wrong!';
            this.toasterType = 'error';
            this.toaster.isOpen = true;
            setTimeout(() => {
                this.closeToaster();
            }, 3000);
        });
    }

    performDeleteProduct() {
        this.productApiService.deleteProduct(this.editProducts$.id).subscribe(() => {
            this.addRow = false;
            this.resetEditProduct();
            this.toasterMessage = 'Product deleted successfully!';
            this.toasterType = 'success';
            this.toaster.isOpen = true;
            setTimeout(() => {
                this.closeToaster();
            }, 3000);
            this.getAllProducts();
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

    closeProductModal() {
        this.modal.isOpen = false;
        this.deleteRow = false;
    }
}
