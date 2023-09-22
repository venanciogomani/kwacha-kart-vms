import { createSelector, createFeatureSelector } from "@ngrx/store";
import { ProductsState } from "../reducers/products.reducer";

export const selectProductsState = createFeatureSelector<ProductsState>("products");

export const selectProducts = createSelector(
    selectProductsState,
    (state: ProductsState) => state.products
);

export const selectProductById = (id: string) => createSelector(
    selectProductsState,
    (state: ProductsState) => state.products.find(product => product.id === id)
);

export const selectLoading = createSelector(
    selectProductsState,
    (state: ProductsState) => state.loading
);