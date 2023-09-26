import { createAction } from "@ngrx/store";
import { ProductBrandModel } from "../models";

export enum BrandsActionTypes {
    LoadBrands = '[Brands] Load Brands',
    LoadBrandsSuccess = '[Brands] Load Brands Success',
    LoadSingleBrand = '[Brands] Load Single Brand',
    LoadSingleBrandSuccess = '[Brands] Load Single Brand Success',
    AddBrand = '[Brands] Add Brand',
    AddBrandSuccess = '[Brands] Add Brand Success',
    EditBrand = '[Brands] Edit Brand',
    EditBrandSuccess = '[Brands] Edit Brand Success',
    DeleteBrand = '[Brands] Delete Brand',
    DeleteBrandSuccess = '[Brands] Delete Brand Success',
}

export const loadBrands = createAction(
    BrandsActionTypes.LoadBrands
);

export const loadBrandsSuccess = createAction(
    BrandsActionTypes.LoadBrandsSuccess,
    (brands: ProductBrandModel[]) => ({ brands }),
);

export const loadSingleBrand = createAction(
    BrandsActionTypes.LoadSingleBrand,
    (id: string) => ({ id }),
);

export const loadSingleBrandSuccess = createAction(
    BrandsActionTypes.LoadSingleBrandSuccess,
    (brand: ProductBrandModel) => ({ brand }),
);

export const addBrand = createAction(
    BrandsActionTypes.AddBrand,
    (brand: ProductBrandModel) => ({ brand }),
);

export const addBrandSuccess = createAction(
    BrandsActionTypes.AddBrandSuccess,
    (brand: ProductBrandModel) => ({ brand }),
);

export const editBrand = createAction(
    BrandsActionTypes.EditBrand,
    (brand: ProductBrandModel) => ({ brand }),
);

export const editBrandSuccess = createAction(
    BrandsActionTypes.EditBrandSuccess,
    (brand: ProductBrandModel) => ({ brand }),
);

export const deleteBrand = createAction(
    BrandsActionTypes.DeleteBrand,
    (id: string) => ({ id }),
);

export const deleteBrandSuccess = createAction(
    BrandsActionTypes.DeleteBrandSuccess,
    (id: string) => ({ id }),
);