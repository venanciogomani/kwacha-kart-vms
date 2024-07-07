import { Injectable } from "@angular/core";
import { Store } from "@ngrx/store";
import { ProductModel } from "src/state";
import { loadProductsSuccess } from "src/state/actions/products.actions";
import { ProductsState } from "src/state/reducers/products.reducer";
import { ProductItems } from "src/state/dataset";
import { BehaviorSubject, Observable } from "rxjs";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { AuthApiService } from "./auth.api.service";
// import { environment } from "src/environments/environment.prod";
import { environment } from "src/environments/environments";

@Injectable(
    { providedIn: "root" }
)

export class ProductApiService {
    private apiUrl = environment.apiUrl;

    private isDataLoaded$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

    constructor(
        private store: Store<ProductsState>,
        private http: HttpClient,
        private authApiService: AuthApiService
    ) { }

    async createInitialProductsState(userId: string) {
        (await this.getAllProductsByVendorId(userId)).subscribe((allProducts: ProductModel[]) => {
            const initialState: ProductsState = {
                products: allProducts,
                loading: false
            }

            this.store.dispatch(loadProductsSuccess(initialState.products));
            this.isDataLoaded$.next(true);
        });
    }

    async getAllProducts(): Promise<Observable<ProductModel[]>> {
        const authToken = this.authApiService.getAuthToken();
        if (!authToken) {
            return new Observable<ProductModel[]>();
        }
        const headers = new HttpHeaders({ 'content-type': 'application/json' }).set('Authorization', `Bearer ${authToken}`);
        const options = { headers, withCredentials: true };

        return this.http.get<ProductModel[]>(`${this.apiUrl}products`, options);
    }

    async getAllProductsByVendorId(vendorId: string): Promise<Observable<ProductModel[]>> {
        const authToken = this.authApiService.getAuthToken();
        if (!authToken) {
            return new Observable<ProductModel[]>();
        }
        const headers = new HttpHeaders({ 'content-type': 'application/json' }).set('Authorization', `Bearer ${authToken}`);
        const options = { headers, withCredentials: true };

        return this.http.get<ProductModel[]>(`${this.apiUrl}products/vendor/${vendorId}`, options);
    }

    async getProductById(id: string): Promise<Observable<ProductModel>> {
        const authToken = this.authApiService.getAuthToken();
        if (!authToken) {
            return new Observable<ProductModel>();
        }
        const headers = new HttpHeaders({ 'content-type': 'application/json' }).set('Authorization', `Bearer ${authToken}`);
        const options = { headers, withCredentials: true };
        
        return this.http.get<ProductModel>(`${this.apiUrl}products/${id}`, options);
    }

    getProductsByVendorId(vendorId: string): ProductModel[] {
        return [] as ProductModel[];
    }

    saveProduct(product: ProductModel): Observable<ProductModel> {
        const authToken = this.authApiService.getAuthToken();
        if (!authToken) {
            return new Observable<ProductModel>();
        }
        const headers = new HttpHeaders({ 'content-type': 'application/json' }).set('Authorization', `Bearer ${authToken}`);
        const options = { headers, withCredentials: true };

        return this.http.post<ProductModel>(`${this.apiUrl}products`, product, options);
    }

    updateProduct(product: ProductModel): Observable<ProductModel> {
        const authToken = this.authApiService.getAuthToken();
        if (!authToken) {
            return new Observable<ProductModel>();
        }
        const headers = new HttpHeaders({ 'content-type': 'application/json' }).set('Authorization', `Bearer ${authToken}`);
        const options = { headers, withCredentials: true };

        return this.http.put<ProductModel>(`${this.apiUrl}products/${product.id}`, product, options);
    }

    deleteProduct(id: string): Observable<void> {
        const authToken = this.authApiService.getAuthToken();
        if (!authToken) {
            return new Observable<void>();
        }
        const headers = new HttpHeaders({ 'content-type': 'application/json' }).set('Authorization', `Bearer ${authToken}`);
        const options = { headers, withCredentials: true };

        return this.http.delete<void>(`${this.apiUrl}products/${id}`, options);
    }

    isDataLoaded(): Observable<boolean> {
        return this.isDataLoaded$.asObservable();
    }
}