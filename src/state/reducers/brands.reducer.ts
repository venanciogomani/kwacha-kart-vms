import { createReducer, on } from "@ngrx/store";
import {
    loadBrands,
    loadBrandsSuccess,
    loadSingleBrand,
    loadSingleBrandSuccess,
    addBrand,
    addBrandSuccess,
    editBrand,
    editBrandSuccess,
    deleteBrand,
    deleteBrandSuccess,
} from "../actions/brands.actions";
import { ProductBrandModel } from "../models";

export interface BrandsState {
    brands: ProductBrandModel[];
    loading: boolean;
}

export const initialState: BrandsState = {
    brands: [],
    loading: false,
};

export const brandsReducer = createReducer(
    initialState,
    on(loadBrands, (state) => ({ ...state, loading: true })),
    on(loadBrandsSuccess, (state, { brands }) => ({ ...state, brands: brands, loading: false })),
    on(loadSingleBrand, (state) => ({ ...state, loading: true })),
    on(loadSingleBrandSuccess, (state, { brand }) => ({ ...state, brands: [...state.brands, brand], loading: false })),
    on(addBrand, (state) => ({ ...state, loading: true })),
    on(addBrandSuccess, (state, { brand }) => ({ ...state, brands: [...state.brands, brand], loading: false })),
    on(editBrand, (state) => ({ ...state, loading: true })),
    on(editBrandSuccess, (state, { brand }) => ({ ...state, brands: [...state.brands, brand], loading: false })),
    on(deleteBrand, (state) => ({ ...state, loading: true })),
    on(deleteBrandSuccess, (state, { id }) => ({ ...state, brands: state.brands.filter(brand => brand.id !== id), loading: false })),
);

export function reducer(state: BrandsState | undefined, action: any) {
    return brandsReducer(state, action);
}