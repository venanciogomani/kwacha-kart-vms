import { Injectable } from "@angular/core";
import { Store } from "@ngrx/store";
import { ProductBrands } from "src/state/dataset";
import { ProductBrandModel } from "src/state";
import { BehaviorSubject, Observable } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { BrandsState } from "src/state/reducers/brands.reducer";
import { loadBrandsSuccess } from "src/state/actions/brands.actions";

@Injectable(
    { providedIn: "root" }
)

export class BrandApiService {
    private apiUrl = 'http://localhost:2200/api/';

    private isDataLoaded$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    
    constructor(
        private store: Store<{}>,
        private http: HttpClient
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
        const headers = { 'Content-Type': 'application/json' };

        return this.http.get<ProductBrandModel[]>(`${this.apiUrl}brands`, { headers });
    }

    getBrandById(id: string): ProductBrandModel {
        const brand = ProductBrands.filter(brand => brand.id === id);

        if (brand.length === 0) {
            return {} as ProductBrandModel;
        }

        return brand[0];
    }

    saveBrand(brand: ProductBrandModel): Observable<ProductBrandModel> {
        const headers = { 'Content-Type': 'application/json' };

        return this.http.post<ProductBrandModel>(`${this.apiUrl}brands`, brand, { headers });
    }

    isDataLoaded(): BehaviorSubject<boolean> {
        return this.isDataLoaded$;
    }
}