import { createReducer, on } from "@ngrx/store";
import { 
    loadProducts, 
    loadProductsSuccess, 
    loadSingleProduct,
    loadSingleProductSuccess,
    addProduct,
    addProductSuccess,
    editProduct,
    editProductSuccess,
    deleteProduct,
    deleteProductSuccess, 
} from "../actions/products.actions";
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
    on(loadProductsSuccess, (state, { products }) => ({ ...state, products: products, loading: false })),
    on(loadSingleProduct, (state) => ({ ...state, loading: true })),
    on(loadSingleProductSuccess, (state, { product }) => ({ ...state, products: [...state.products, product], loading: false })),
    on(addProduct, (state) => ({ ...state, loading: true })),
    on(addProductSuccess, (state, { product }) => ({ ...state, products: [...state.products, product], loading: false })),
    on(editProduct, (state) => ({ ...state, loading: true })),
    on(editProductSuccess, (state, { product }) => ({ ...state, products: [...state.products, product], loading: false })),
    on(deleteProduct, (state) => ({ ...state, loading: true })),
    on(deleteProductSuccess, (state, { id }) => ({ ...state, products: state.products.filter(product => product.id !== id), loading: false })),
);

export function reducer(state: ProductsState | undefined, action: any) {
    return productsReducer(state, action);
}