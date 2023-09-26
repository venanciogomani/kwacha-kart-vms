import { Injectable } from "@angular/core";
import { Store } from "@ngrx/store";
import { ProductCategories } from "src/state/dataset";
import { ProductCategoryModel } from "src/state";
import { BehaviorSubject, Observable } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { CategoriesState } from "src/state/reducers/categories.reducer";
import { loadCategoriesSuccess } from "src/state/actions/categories.actions";

@Injectable(
    { providedIn: "root" }
)

export class CategoryApiService {
    private apiUrl = 'http://localhost:2200/api/';

    private isDataLoaded$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    
    constructor(
        private store: Store<{}>,
        private http: HttpClient
    ) { }

    async createInitialCategoriesState() {
        (await this.getAllCategories()).subscribe((allCategories: ProductCategoryModel[]) => {
            const initialState: CategoriesState = {
                categories: allCategories,
                loading: false
            }

            this.store.dispatch(loadCategoriesSuccess(initialState.categories));
            this.isDataLoaded$.next(true);
        });
    }

    async getAllCategories(): Promise<Observable<ProductCategoryModel[]>> {
        const headers = { 'Content-Type': 'application/json' };

        return this.http.get<ProductCategoryModel[]>(`${this.apiUrl}categories`, { headers });
    }

    async getCategoryById(id: string): Promise<Observable<ProductCategoryModel>> {
        const headers = { 'Content-Type': 'application/json' };

        return this.http.get<ProductCategoryModel>(`${this.apiUrl}categories/${id}`, { headers });
    }

    isDataLoaded(): Observable<boolean> {
        return this.isDataLoaded$.asObservable();
    }
}