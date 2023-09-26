import { createAction } from "@ngrx/store";
import { ProductModel } from "../models";

export enum ProductsActionTypes {
    LoadProducts = '[Products] Load Products',
    LoadProductsSuccess = '[Products] Load Products Success',
    LoadSingleProduct = '[Products] Load Single Product',
    LoadSingleProductSuccess = '[Products] Load Single Product Success',
    AddProduct = '[Products] Add Product',
    AddProductSuccess = '[Products] Add Product Success',
    EditProduct = '[Products] Edit Product',
    EditProductSuccess = '[Products] Edit Product Success',
    DeleteProduct = '[Products] Delete Product',
    DeleteProductSuccess = '[Products] Delete Product Success',
}

export const loadProducts = createAction(
    ProductsActionTypes.LoadProducts
);

export const loadProductsSuccess = createAction(
    ProductsActionTypes.LoadProductsSuccess,
    (products: ProductModel[]) => ({ products }),
);

export const loadSingleProduct = createAction(
    ProductsActionTypes.LoadSingleProduct,
    (id: string) => ({ id }),
);

export const loadSingleProductSuccess = createAction(
    ProductsActionTypes.LoadSingleProductSuccess,
    (product: ProductModel) => ({ product }),
);

export const addProduct = createAction(
    ProductsActionTypes.AddProduct,
    (product: ProductModel) => ({ product }),
);

export const addProductSuccess = createAction(
    ProductsActionTypes.AddProductSuccess,
    (product: ProductModel) => ({ product }),
);

export const editProduct = createAction(
    ProductsActionTypes.EditProduct,
    (product: ProductModel) => ({ product }),
);

export const editProductSuccess = createAction(
    ProductsActionTypes.EditProductSuccess,
    (product: ProductModel) => ({ product }),
);

export const deleteProduct = createAction(
    ProductsActionTypes.DeleteProduct,
    (id: string) => ({ id }),
);

export const deleteProductSuccess = createAction(
    ProductsActionTypes.DeleteProductSuccess,
    (id: string) => ({ id }),
);