import { Injectable } from "@angular/core";
import { Store } from "@ngrx/store";
import { ProductCategories } from "src/state/dataset";
import { ProductCategoryModel } from "src/state";
import { BehaviorSubject, Observable } from "rxjs";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { CategoriesState } from "src/state/reducers/categories.reducer";
import { loadCategoriesSuccess } from "src/state/actions/categories.actions";
import { AuthApiService } from "./auth.api.service";

@Injectable(
    { providedIn: "root" }
)

export class CategoryApiService {
    private apiUrl = 'http://localhost:2200/api/';

    private isDataLoaded$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    
    constructor(
        private store: Store<{}>,
        private http: HttpClient,
        private authApiService: AuthApiService
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
        const authToken = this.authApiService.getAuthToken();
        if (!authToken) {
            return new Observable<ProductCategoryModel[]>();
        }
        const headers = new HttpHeaders({ 'content-type': 'application/json' }).set('Authorization', `Bearer ${authToken}`);
        const options = { headers, withCredentials: true };

        return this.http.get<ProductCategoryModel[]>(`${this.apiUrl}categories`, options);
    }

    async getAllParentCategories(): Promise<Observable<any[]>> {
        const authToken = this.authApiService.getAuthToken();
        if (!authToken) {
            return new Observable<any[]>();
        }
        const headers = new HttpHeaders({ 'content-type': 'application/json' }).set('Authorization', `Bearer ${authToken}`);
        const options = { headers, withCredentials: true };

        return this.http.get<any[]>(`${this.apiUrl}categories/parent`, options);
    }

    async getCategoryById(id: string): Promise<Observable<ProductCategoryModel>> {
        const authToken = this.authApiService.getAuthToken();
        if (!authToken) {
            return new Observable<ProductCategoryModel>();
        }
        const headers = new HttpHeaders({ 'content-type': 'application/json' }).set('Authorization', `Bearer ${authToken}`);
        const options = { headers, withCredentials: true };

        return this.http.get<ProductCategoryModel>(`${this.apiUrl}categories/${id}`, options);
    }

    saveCategory(category: ProductCategoryModel): Observable<ProductCategoryModel> {
        const authToken = this.authApiService.getAuthToken();
        if (!authToken) {
            return new Observable<ProductCategoryModel>();
        }
        const headers = new HttpHeaders({ 'content-type': 'application/json' }).set('Authorization', `Bearer ${authToken}`);
        const options = { headers, withCredentials: true };

        return this.http.post<ProductCategoryModel>(`${this.apiUrl}categories`, category, options);
    }

    updateCategory(category: ProductCategoryModel): Observable<ProductCategoryModel> {
        const authToken = this.authApiService.getAuthToken();
        if (!authToken) {
            return new Observable<ProductCategoryModel>();
        }
        const headers = new HttpHeaders({ 'content-type': 'application/json' }).set('Authorization', `Bearer ${authToken}`);
        const options = { headers, withCredentials: true };

        return this.http.put<ProductCategoryModel>(`${this.apiUrl}categories`, category, options);
    }

    deleteCategory(id: string): Observable<void> {
        const authToken = this.authApiService.getAuthToken();
        if (!authToken) {
            return new Observable<void>();
        }
        const headers = new HttpHeaders({ 'content-type': 'application/json' }).set('Authorization', `Bearer ${authToken}`);
        const options = { headers, body: { id }, withCredentials: true };

        return this.http.delete<void>(`${this.apiUrl}categories`, options);
    }

    isDataLoaded(): Observable<boolean> {
        return this.isDataLoaded$.asObservable();
    }
}