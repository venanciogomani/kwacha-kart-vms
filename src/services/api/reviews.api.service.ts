import { Injectable } from "@angular/core";
import { Store } from "@ngrx/store";
import { ProductReviewModel } from "src/state";
import { BehaviorSubject, Observable } from "rxjs";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { ReviewsState } from "src/state/reducers/reviews.reducer";
import { loadReviewsSuccess } from "src/state/actions/reviews.actions";
import { AuthApiService } from "./auth.api.service";
// import { environment } from "src/environments/environment.prod";
import { environment } from "src/environments/environments";

@Injectable(
    { providedIn: "root" }
)

export class ReviewApiService {
    private apiUrl = environment.apiUrl;

    private isDataLoaded$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

    constructor(
        private store: Store<{}>,
        private http: HttpClient,
        private authApiService: AuthApiService
    ) { }

    async createInitialReviewsState(vendorId: string) {
        (await this.getAllReviewsByVendorId(vendorId)).subscribe((allReviews: ProductReviewModel[]) => {
            const initialState: ReviewsState = {
                reviews: allReviews,
                loading: false
            }

            this.store.dispatch(loadReviewsSuccess(initialState.reviews));
            this.isDataLoaded$.next(true);
        });
    }

    async getAllReviews() {
        const authToken = this.authApiService.getAuthToken();
        if (!authToken) {
            return new Observable<ProductReviewModel[]>();
        }
        const headers = new HttpHeaders({ 'content-type': 'application/json' }).set('Authorization', `Bearer ${authToken}`);
        const options = { headers, withCredentials: true };

        return this.http.get<ProductReviewModel[]>(`${this.apiUrl}reviews`, options);
    }

    async getAllReviewsByVendorId(vendorId: string): Promise<Observable<ProductReviewModel[]>> {
        const authToken = this.authApiService.getAuthToken();
        if (!authToken) {
            return new Observable<ProductReviewModel[]>();
        }
        const headers = new HttpHeaders({ 'content-type': 'application/json' }).set('Authorization', `Bearer ${authToken}`);
        const options = { headers, withCredentials: true };

        return this.http.get<ProductReviewModel[]>(`${this.apiUrl}reviews/vendor/${vendorId}`, options);
    }

    async getReviewById(id: string): Promise<Observable<ProductReviewModel>> {
        const authToken = this.authApiService.getAuthToken();
        if (!authToken) {
            return new Observable<ProductReviewModel>();
        }
        const headers = new HttpHeaders({ 'content-type': 'application/json' }).set('Authorization', `Bearer ${authToken}`);
        const options = { headers, withCredentials: true };

        return this.http.get<ProductReviewModel>(`${this.apiUrl}reviews/${id}`, options);
    }

    isDataLoaded(): BehaviorSubject<boolean> {
        return this.isDataLoaded$;
    }
}