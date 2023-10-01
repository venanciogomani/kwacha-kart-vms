import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { ProductApiService } from 'src/services/api/products.api.service';
import { ProductBrandModel, ProductCategoryModel, ProductModel, ProductTagModel, VendorModel } from 'src/state';
import { loadSingleProductSuccess } from 'src/state/actions/products.actions';
import { selectBrands } from 'src/state/selectors/brands.selectors';
import { selectCategories } from 'src/state/selectors/categories.selectors';
import { selectProductById } from 'src/state/selectors/products.selectors';
import { selectVendorById, selectVendors } from 'src/state/selectors/vendors.selectors';
import { formatDateString } from 'src/services/helpers';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { AuthApiService } from 'src/services/api/auth.api.service';

@Component({
  selector: 'app-view-product',
  templateUrl: './view-product.component.html',
  styleUrls: ['./view-product.component.scss']
})
export class ViewProductComponent {
    userDescription: string = '<script>alert("XSS Attack")</script>';
    sanitizedDescription!: SafeHtml;
    
    product$: ProductModel = {
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
    }
    productId$!: string;

    categories$: ProductCategoryModel[] = [];
    brands$: ProductBrandModel[] = [];
    tags$: ProductTagModel[] = [];
    colors$: string[] = [];

    allVendors$: VendorModel[] = [];

    isProductLoaded$ = false;

    vendor$ = {
        name: '',
        phone: '',
        email: ''
    }

    isEditing$ = false;
    
    constructor(
        private router: Router,
        private activatedRoute: ActivatedRoute,
        private productApiService: ProductApiService,
        private authApiService: AuthApiService,
        private sanitizer: DomSanitizer,
        private store: Store<any>
    ) { 
        this.authApiService.resetInactivityTimer(); // reset inactivity timer
    }

    async ngOnInit(): Promise<void> {
        this.getCurrentProduct();
        this.getAllCategories();
        this.getAllBrands();
        this.getAllVendors();
        if (this.product$.id === '') {
            const productId = this.activatedRoute.snapshot.paramMap.get('id');
            if (productId) {
                (await this.productApiService.getProductById(productId)).subscribe((product: ProductModel) => {
                    this.store.dispatch(loadSingleProductSuccess(product));
                    this.product$ = product;
                    this.getVendorById();
                });
            }
        }
    }

    getCurrentProduct() {
        const productId = this.activatedRoute.snapshot.paramMap.get('id');
        if (!productId) {
            return;
        }
        this.store.select(selectProductById(productId)).subscribe((product) => {
            if (product) {
                this.product$ = product;
                this.getVendorById();
            }
        });
    }

    getAllCategories() {
        this.store.select(selectCategories).subscribe((categories) => {
            if (categories) {
                this.categories$ = categories;
            }
        });
    }

    getAllBrands() {
        this.store.select(selectBrands).subscribe((brands) => {
            if (brands) {
                this.brands$ = brands;
            }
        });
    }

    getProductCategoryById(categoryId: string): ProductCategoryModel | undefined {
        return this.categories$.find((category) => category.id === categoryId);
    }

    getProductBrandById(brandId: string): ProductBrandModel | undefined {
        return this.brands$.find((brand) => brand.id === brandId);
    }

    getVendorById() {
        this.store.select(selectVendorById(this.product$.vendorId)).subscribe((vendor) => {
            if (vendor) {
                this.vendor$.name = vendor.name;
                this.vendor$.phone = vendor.phone;
                this.vendor$.email = vendor.email;
                this.isProductLoaded$ = true;
            }
        });
    }

    getAllVendors() {
        this.store.select(selectVendors).subscribe((vendors) => {
            if (vendors) {
                this.allVendors$ = vendors;
            }
        });
    }

    toggleEdit() {
        this.isEditing$ = !this.isEditing$;
    }

    formatDateString(dateString: string) {
        return formatDateString(dateString);
    }

    sanitizeUserInput() {
        this.sanitizedDescription = this.sanitizer.bypassSecurityTrustHtml(this.userDescription);
    }
}
