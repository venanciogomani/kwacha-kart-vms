import { createAction, props } from '@ngrx/store';
import { ProductCategoryModel } from '../models';

export enum CategoriesActionTypes {
    LoadCategories = '[Categories] Load Categories',
    LoadCategoriesSuccess = '[Categories] Load Categories Success',
    LoadSingleCategory = '[Categories] Load Single Category',
    LoadSingleCategorySuccess = '[Categories] Load Single Category Success',
    AddCategory = '[Categories] Add Category',
    AddCategorySuccess = '[Categories] Add Category Success',
    EditCategory = '[Categories] Edit Category',
    EditCategorySuccess = '[Categories] Edit Category Success',
    DeleteCategory = '[Categories] Delete Category',
    DeleteCategorySuccess = '[Categories] Delete Category Success',
}

export const loadCategories = createAction(
    CategoriesActionTypes.LoadCategories
);

export const loadCategoriesSuccess = createAction(
    CategoriesActionTypes.LoadCategoriesSuccess,
    (categories: ProductCategoryModel[]) => ({ categories }),
);

export const loadSingleCategory = createAction(
    CategoriesActionTypes.LoadSingleCategory,
    (id: string) => ({ id }),
);

export const loadSingleCategorySuccess = createAction(
    CategoriesActionTypes.LoadSingleCategorySuccess,
    (category: ProductCategoryModel) => ({ category }),
);

export const addCategory = createAction(
    CategoriesActionTypes.AddCategory,
    (category: ProductCategoryModel) => ({ category }),
);

export const addCategorySuccess = createAction(
    CategoriesActionTypes.AddCategorySuccess,
    (category: ProductCategoryModel) => ({ category }),
);

export const editCategory = createAction(
    CategoriesActionTypes.EditCategory,
    (category: ProductCategoryModel) => ({ category }),
);

export const editCategorySuccess = createAction(
    CategoriesActionTypes.EditCategorySuccess,
    (category: ProductCategoryModel) => ({ category }),
);

export const deleteCategory = createAction(
    CategoriesActionTypes.DeleteCategory,
    (id: string) => ({ id }),
);

export const deleteCategorySuccess = createAction(
    CategoriesActionTypes.DeleteCategorySuccess,
    (id: string) => ({ id }),
);