import { createSelector, createFeatureSelector } from "@ngrx/store";
import { CategoriesState } from "../reducers/categories.reducer";

export const selectCategoriesState = createFeatureSelector<CategoriesState>("categories");

export const selectCategories = createSelector(
    selectCategoriesState,
    (state: CategoriesState) => state.categories
);

export const selectCategoryById = (id: string) => createSelector(
    selectCategoriesState,
    (state: CategoriesState) => state.categories.find(category => category.id === id)
);

export const selectLoading = createSelector(
    selectCategoriesState,
    (state: CategoriesState) => state.loading
);