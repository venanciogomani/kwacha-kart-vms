import { Injectable } from "@angular/core";
import { Store } from "@ngrx/store";
import { ProductModel } from "src/state";
import { loadProductsSuccess } from "src/state/actions/products.actions";
import { ProductsState } from "src/state/reducers/products.reducer";
import { ProductItems } from "src/state/dataset";
import { BehaviorSubject, Observable } from "rxjs";
import { HttpClient } from "@angular/common/http";

@Injectable(
    { providedIn: "root" }
)

export class ProductApiService {
    private apiUrl = 'http://localhost:2200/api/';

    private isDataLoaded$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

    constructor(
        private store: Store<ProductsState>,
        private http: HttpClient
    ) { }

    async createInitialProductsState() {
        (await this.getAllProducts()).subscribe((allProducts: ProductModel[]) => {
            const initialState: ProductsState = {
                products: allProducts,
                loading: false
            }

            this.store.dispatch(loadProductsSuccess(initialState.products));
            this.isDataLoaded$.next(true);
        });
    }

    async getAllProducts(): Promise<Observable<ProductModel[]>> {
        const headers = { 'Content-Type': 'application/json' };

        return this.http.get<ProductModel[]>(`${this.apiUrl}products`, { headers });
    }

    async getProductById(id: string): Promise<Observable<ProductModel>> {
        const headers = { 'Content-Type': 'application/json' };
        
        return this.http.get<ProductModel>(`${this.apiUrl}products/${id}`, { headers });
    }

    getProductsByVendorId(vendorId: string): ProductModel[] {
        return [] as ProductModel[];
    }

    saveProduct(product: ProductModel): Observable<ProductModel> {
        const headers = { 'Content-Type': 'application/json' };

        return this.http.post<ProductModel>(`${this.apiUrl}products`, product, { headers });
    }

    isDataLoaded(): Observable<boolean> {
        return this.isDataLoaded$.asObservable();
    }
}