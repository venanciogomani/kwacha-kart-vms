import { createAction } from "@ngrx/store";
import { ProductReviewModel } from "../models";

export enum ReviewsActionTypes {
    LoadReviews = '[Reviews] Load Reviews',
    LoadReviewsSuccess = '[Reviews] Load Reviews Success',
    LoadSingleReview = '[Reviews] Load Single Review',
    LoadSingleReviewSuccess = '[Reviews] Load Single Review Success',
    EditReview = '[Reviews] Edit Review',
    EditReviewSuccess = '[Reviews] Edit Review Success',
    DeleteReview = '[Reviews] Delete Review',
    DeleteReviewSuccess = '[Reviews] Delete Review Success',
}

export const loadReviews = createAction(
    ReviewsActionTypes.LoadReviews
);

export const loadReviewsSuccess = createAction(
    ReviewsActionTypes.LoadReviewsSuccess,
    (reviews: ProductReviewModel[]) => ({ reviews }),
);

export const loadSingleReview = createAction(
    ReviewsActionTypes.LoadSingleReview,
    (id: string) => ({ id }),
);

export const loadSingleReviewSuccess = createAction(
    ReviewsActionTypes.LoadSingleReviewSuccess,
    (review: ProductReviewModel) => ({ review }),
);

export const editReview = createAction(
    ReviewsActionTypes.EditReview,
    (review: ProductReviewModel) => ({ review }),
);

export const editReviewSuccess = createAction(
    ReviewsActionTypes.EditReviewSuccess,
    (review: ProductReviewModel) => ({ review }),
);

export const deleteReview = createAction(
    ReviewsActionTypes.DeleteReview,
    (id: string) => ({ id }),
);

export const deleteReviewSuccess = createAction(
    ReviewsActionTypes.DeleteReviewSuccess,
    (id: string) => ({ id }),
);