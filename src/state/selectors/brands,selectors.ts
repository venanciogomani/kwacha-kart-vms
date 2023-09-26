import { createSelector, createFeatureSelector } from "@ngrx/store";
import { BrandsState } from "../reducers/brands.reducer";

export const selectBrandsState = createFeatureSelector<BrandsState>("brands");

export const selectBrands = createSelector(
    selectBrandsState,
    (state: BrandsState) => state.brands
);

export const selectBrandById = (id: string) => createSelector(
    selectBrandsState,
    (state: BrandsState) => state.brands.find(brand => brand.id === id)
);

export const selectLoading = createSelector(
    selectBrandsState,
    (state: BrandsState) => state.loading
);