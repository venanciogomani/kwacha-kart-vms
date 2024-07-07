import { Injectable } from "@angular/core";
import { Store } from "@ngrx/store";
import { ProductBrands } from "src/state/dataset";
import { ProductBrandModel } from "src/state";
import { BehaviorSubject, Observable } from "rxjs";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { BrandsState } from "src/state/reducers/brands.reducer";
import { loadBrandsSuccess } from "src/state/actions/brands.actions";
import { AuthApiService } from "./auth.api.service";
// import { environment } from "src/environments/environment.prod";
import { environment } from "src/environments/environments";

@Injectable(
    { providedIn: "root" }
)

export class BrandApiService {
    private apiUrl = environment.apiUrl;

    private isDataLoaded$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    
    constructor(
        private store: Store<{}>,
        private http: HttpClient,
        private authApiService: AuthApiService
    ) { }

    async createInitialBrandsState() {
        (await this.getAllBrands()).subscribe((allBrands: ProductBrandModel[]) => {
            const initialState: BrandsState = {
                brands: allBrands,
                loading: false
            }

            this.store.dispatch(loadBrandsSuccess(initialState.brands));
            this.isDataLoaded$.next(true);
        });
    }

    async getAllBrands() {
        const authToken = this.authApiService.getAuthToken();
        if (!authToken) {
            return new Observable<ProductBrandModel[]>();
        }
        const headers = new HttpHeaders({ 'content-type': 'application/json' }).set('Authorization', `Bearer ${authToken}`);
        const options = { headers, withCredentials: true };

        return this.http.get<ProductBrandModel[]>(`${this.apiUrl}brands`, options);
    }

    getBrandById(id: string): ProductBrandModel {
        const brand = ProductBrands.filter(brand => brand.id === id);

        if (brand.length === 0) {
            return {} as ProductBrandModel;
        }

        return brand[0];
    }

    saveBrand(brand: ProductBrandModel): Observable<ProductBrandModel> {
        const authToken = this.authApiService.getAuthToken();
        if (!authToken) {
            return new Observable<ProductBrandModel>();
        }
        const headers = new HttpHeaders({ 'content-type': 'application/json' }).set('Authorization', `Bearer ${authToken}`);
        const options = { headers, withCredentials: true };

        return this.http.post<ProductBrandModel>(`${this.apiUrl}brands`, brand, options);
    }

    updateBrand(brand: ProductBrandModel): Observable<ProductBrandModel> {
        const authToken = this.authApiService.getAuthToken();
        if (!authToken) {
            return new Observable<ProductBrandModel>();
        }
        const headers = new HttpHeaders({ 'content-type': 'application/json' }).set('Authorization', `Bearer ${authToken}`);
        const options = { headers, withCredentials: true };

        return this.http.put<ProductBrandModel>(`${this.apiUrl}brands`, brand, options);
    }

    deleteBrand(id: string): Observable<any> {
        const authToken = this.authApiService.getAuthToken();
        if (!authToken) {
            return new Observable<any>();
        }
        const headers = new HttpHeaders({ 'content-type': 'application/json' }).set('Authorization', `Bearer ${authToken}`);
        const options = { headers };

        return this.http.delete<any>(`${this.apiUrl}brands/${id}`, options);
    }

    isDataLoaded(): BehaviorSubject<boolean> {
        return this.isDataLoaded$;
    }
}