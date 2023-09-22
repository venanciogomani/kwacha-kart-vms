import { createReducer, on } from "@ngrx/store";
import { loadProducts, loadSingleProduct, loadProductsSuccess } from "../actions/products.actions";
import { ProductModel } from "../models";

export interface ProductsState {
    products: ProductModel[];
    loading: boolean;
}

export const initialState: ProductsState = {
    products: [],
    loading: false,
};

export const productsReducer = createReducer(
    initialState,
    on(loadProducts, (state) => ({ ...state, loading: true })),
    on(loadSingleProduct, (state) => ({ ...state, loading: true })),
    on(loadProductsSuccess, (state, { products }) => ({ ...state, products: products, loading: false })),
);

export function reducer(state: ProductsState | undefined, action: any) {
    return productsReducer(state, action);
}