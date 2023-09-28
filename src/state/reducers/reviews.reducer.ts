import { createReducer, on } from "@ngrx/store";
import {
    loadReviews,
    loadReviewsSuccess,
    loadSingleReview,
    loadSingleReviewSuccess,
    editReview,
    editReviewSuccess,
    deleteReview,
    deleteReviewSuccess,
} from "../actions/reviews.actions";
import { ProductReviewModel } from "../models";

export interface ReviewsState {
    reviews: ProductReviewModel[];
    loading: boolean;
}

export const initialState: ReviewsState = {
    reviews: [],
    loading: false,
};

export const reviewsReducer = createReducer(
    initialState,
    on(loadReviews, (state) => ({ ...state, loading: true })),
    on(loadReviewsSuccess, (state, { reviews }) => ({ ...state, reviews: reviews, loading: false })),
    on(loadSingleReview, (state) => ({ ...state, loading: true })),
    on(loadSingleReviewSuccess, (state, { review }) => ({ ...state, reviews: [...state.reviews, review], loading: false })),
    on(editReview, (state) => ({ ...state, loading: true })),
    on(editReviewSuccess, (state, { review }) => ({ ...state, reviews: [...state.reviews, review], loading: false })),
    on(deleteReview, (state) => ({ ...state, loading: true })),
    on(deleteReviewSuccess, (state, { id }) => ({ ...state, reviews: state.reviews.filter(review => review.id !== id), loading: false })),
);

export function reducer(state: ReviewsState | undefined, action: any) {
    return reviewsReducer(state, action);
}