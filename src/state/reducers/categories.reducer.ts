import { createReducer, on } from "@ngrx/store";
import {
    loadCategories,
    loadCategoriesSuccess,
    loadSingleCategory,
    loadSingleCategorySuccess,
    addCategory,
    addCategorySuccess,
    editCategory,
    editCategorySuccess,
    deleteCategory,
    deleteCategorySuccess,
} from "../actions/categories.actions";
import { ProductCategoryModel } from "../models";

export interface CategoriesState {
    categories: ProductCategoryModel[];
    loading: boolean;
}

export const initialState: CategoriesState = {
    categories: [],
    loading: false,
};

export const categoriesReducer = createReducer(
    initialState,
    on(loadCategories, (state) => ({ ...state, loading: true })),
    on(loadCategoriesSuccess, (state, { categories }) => ({ ...state, categories: categories, loading: false })),
    on(loadSingleCategory, (state) => ({ ...state, loading: true })),
    on(loadSingleCategorySuccess, (state, { category }) => ({ ...state, categories: [...state.categories, category], loading: false })),
    on(addCategory, (state) => ({ ...state, loading: true })),
    on(addCategorySuccess, (state, { category }) => ({ ...state, categories: [...state.categories, category], loading: false })),
    on(editCategory, (state) => ({ ...state, loading: true })),
    on(editCategorySuccess, (state, { category }) => ({ ...state, categories: [...state.categories, category], loading: false })),
    on(deleteCategory, (state) => ({ ...state, loading: true })),
    on(deleteCategorySuccess, (state, { id }) => ({ ...state, categories: state.categories.filter(category => category.id !== id), loading: false })),
);

export function reducer(state: CategoriesState | undefined, action: any) {
    return categoriesReducer(state, action);
}