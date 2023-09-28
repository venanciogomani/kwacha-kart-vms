import { Injectable } from "@angular/core";
import { Store } from "@ngrx/store";
import { ProductReviewModel } from "src/state";
import { BehaviorSubject, Observable } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { ReviewsState } from "src/state/reducers/reviews.reducer";
import { loadReviewsSuccess } from "src/state/actions/reviews.actions";

@Injectable(
    { providedIn: "root" }
)

export class ReviewApiService {
    private apiUrl = 'http://localhost:2200/api/';

    private isDataLoaded$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

    constructor(
        private store: Store<{}>,
        private http: HttpClient
    ) { }

    async createInitialReviewsState() {
        (await this.getAllReviews()).subscribe((allReviews: ProductReviewModel[]) => {
            const initialState: ReviewsState = {
                reviews: allReviews,
                loading: false
            }

            this.store.dispatch(loadReviewsSuccess(initialState.reviews));
            this.isDataLoaded$.next(true);
        });
    }

    async getAllReviews() {
        const headers = { 'Content-Type': 'application/json' };

        return this.http.get<ProductReviewModel[]>(`${this.apiUrl}reviews`, { headers });
    }

    async getReviewById(id: string): Promise<Observable<ProductReviewModel>> {
        const headers = { 'Content-Type': 'application/json' };

        return this.http.get<ProductReviewModel>(`${this.apiUrl}reviews/${id}`, { headers });
    }

    isDataLoaded(): BehaviorSubject<boolean> {
        return this.isDataLoaded$;
    }
}