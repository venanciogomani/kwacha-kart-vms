import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { BrandApiService } from 'src/services/api/brand.api.service';
import { CategoryApiService } from 'src/services/api/category.api.service';
import { ProductApiService } from 'src/services/api/products.api.service';
import { VendorApiService } from 'src/services/api/vendor.api.service';
import { ProductBrandModel, ProductCategoryModel, ProductModel, VendorModel } from 'src/state';
import { selectLoading, selectVendorById } from 'src/state/selectors/vendors.selectors';

type SortStatus = {
    [key in 'title' | 'price' | 'salePrice' | 'quantity']: boolean;
}

type TabStatus = {
    [key in 'orders' | 'invoice' | 'products']: boolean;
}

@Component({
  selector: 'app-view-vendor',
  templateUrl: './view-vendor.component.html',
  styleUrls: ['./view-vendor.component.scss']
})
export class ViewVendorComponent {
    sortStatus: SortStatus = {
        title: false,
        price: false,
        salePrice: false,
        quantity: false
    };

    tabStatus: TabStatus = {
        orders: true,
        invoice: false,
        products: false
    };

    products$: ProductModel[] = [];
    fileteredProducts$: ProductModel[] = [];
    isProductLoading$: boolean = false;
    isOrderTab$: boolean = true;
    allProductCategories$: ProductCategoryModel[] = [];
    allProductBrands$: ProductBrandModel[] = [];

    singleVendor$!: VendorModel;

    productEdit$: ProductModel = {} as ProductModel;

    editRow: { [key: string]: boolean } = {};

    addRow = false;

    searchTerm = '';

    pageSize = 10;
    currentPage = 1;
    totalPage = 1;
    totalPages = 0;
    totalProducts = 0;
    startIndex = 0;
    endIndex = 0;

    sortDirection = 'asc';

    vendorTitle: string = 'Vendor';

    constructor(
        private router: ActivatedRoute,
        private route: Router,
        private productApiService: ProductApiService,
        private vendorApiService: VendorApiService,
        private categoryApiService: CategoryApiService,
        private brandApiService: BrandApiService,
        private store: Store,
    ) {
        // Use this when auth functionality is enabled
        // this.store.select(selectProducts).subscribe((product: ProductModel[]) => {
        //     this.products$ = product;
        // });
        const vendorId = this.router.snapshot.paramMap.get('id') || '';

        this.store.select(selectVendorById(vendorId)).subscribe((vendor: any) => {
            this.singleVendor$ = vendor;
        });

        this.products$ = this.productApiService.getProductsByVendorId(this.router.snapshot.paramMap.get('id') || '');

        this.store.select(selectLoading).subscribe((isLoading: boolean) => {
            this.isProductLoading$ = isLoading; // use this for loading screen or lazyloading
        });
    }

    async ngOnInit(): Promise<void> {
        if (!this.singleVendor$) {
            (await this.vendorApiService.getVendorById(this.router.snapshot.paramMap.get('id') || '')).subscribe((vendor: VendorModel) => {
                this.singleVendor$ = vendor;
                this.vendorTitle = vendor.name;
            });
        } else {
            this.vendorTitle = this.singleVendor$.name;
        }

        if (this.products$.length === 0) {
            this.productApiService
                .isDataLoaded()
                .subscribe((isDataLoaded: boolean) => {
                    if (isDataLoaded) {
                        this.getAllProducts();
                    }
                });
        } else {
            this.filterProductsBySearchTerm();
            this.totalProducts = this.products$.length;
        }

        if (this.allProductCategories$.length === 0) {
            this.productCategories();
        }

        if (this.allProductBrands$.length === 0) {
            this.getProductBrands();
        }
    }

    async getAllProducts() {
        (await this.productApiService.getAllProducts()).subscribe((allProducts: ProductModel[]) => {
            this.products$ = allProducts;
            this.filterProductsBySearchTerm();
        });
    }

    async getCurrentVendor() {
        return this.vendorApiService.getVendorById(this.router.snapshot.paramMap.get('id') || '');
    }

    isEditRow(id: string): boolean {
        return this.editRow[id];
    }

    toggleEditProduct(productToEdit: ProductModel): void {
        this.editRow[productToEdit.id] = !this.editRow[productToEdit.id];
        this.productEdit$ = this.editRow[productToEdit.id] == true ? productToEdit : {} as ProductModel;
    }

    toggleAddProduct(): void {
        this.addRow = !this.addRow;
    }

    filterProductsBySearchTerm() {
        this.startIndex = (this.currentPage - 1) * this.pageSize;
        this.endIndex = (this.startIndex + this.pageSize) > this.products$.length ? this.products$.length : (this.startIndex + this.pageSize);

        if (!this.searchTerm) {
            this.fileteredProducts$ = this.products$.slice(this.startIndex, this.endIndex);
        } else {
            this.fileteredProducts$ = this.products$.filter(product => {
                return product.title.toLowerCase().includes(this.searchTerm.toLowerCase());
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
    }

    sortBy(key: string) {
        this.fileteredProducts$.sort((a: any, b: any) => {
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
        this.route.navigate([`/products/view/${id}`]);
    }

    toggleTabStatus(tab: keyof TabStatus): void {
        this.tabStatus = {
            orders: false,
            invoice: false,
            products: false
        };
        this.tabStatus[tab] = true;
    }

    isTabActive(tab: keyof TabStatus): boolean {
        return this.tabStatus[tab];
    }

    async productCategories() {
        return (await this.categoryApiService.getAllCategories()).subscribe((categories: ProductCategoryModel[]) => {
            this.allProductCategories$ = categories;
        });
    }

    getProductCategoryById(categoryId: string): ProductCategoryModel {
        return this.allProductCategories$.find(category => category.id === categoryId) || {} as ProductCategoryModel;
    }

    async getProductBrands() {
        return (await this.brandApiService.getAllBrands()).subscribe((brands: ProductBrandModel[]) => {
            this.allProductBrands$ = brands;
        });
    }

    getProductBrandById(brandId: string): ProductBrandModel {
        return this.allProductBrands$.find(brand => brand.id === brandId) || {} as ProductBrandModel;
    }

    toggleViewOrder(id: string) {
        this.route.navigate([`dashboard/vendors/orders/${id}`]);
    }

    toggleViewTransaction(id: string) {
        this.route.navigate([`dashboard/vendors/transactions/${id}`]);
    }
}
