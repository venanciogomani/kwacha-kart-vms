import { createAction } from "@ngrx/store";
import { ProductModel } from "../models";

export enum ProductsActionTypes {
    LoadProducts = '[Products] Load Products',
    LoadSingleProduct = '[Products] Load Single Product',
    LoadProductsSuccess = '[Products] Load Products Success',
}

export const loadProducts = createAction(
    ProductsActionTypes.LoadProducts
);

export const loadSingleProduct = createAction(
    ProductsActionTypes.LoadSingleProduct,
    (id: string) => ({ id }),
);

export const loadProductsSuccess = createAction(
    ProductsActionTypes.LoadProductsSuccess,
    (products: ProductModel[]) => ({ products }),
);