import { createSelector, createFeatureSelector } from "@ngrx/store";
import { ReviewsState } from "../reducers/reviews.reducer";

export const selectReviewsState = createFeatureSelector<ReviewsState>("reviews");

export const selectReviews = createSelector(
    selectReviewsState,
    (state: ReviewsState) => state.reviews
);

export const selectReviewById = (id: string) => createSelector(
    selectReviewsState,
    (state: ReviewsState) => state.reviews.find(review => review.id === id)
);

export const selectLoading = createSelector(
    selectReviewsState,
    (state: ReviewsState) => state.loading
);